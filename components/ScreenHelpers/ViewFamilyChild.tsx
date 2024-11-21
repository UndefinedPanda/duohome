import { useState } from "react"
import { SafeAreaView } from "react-native"
import { ThemedView } from "../ThemedView"
import { FormControl, FormControlLabel, FormControlLabelText, FormControlError, FormControlErrorText } from "../ui/form-control"
import { HStack } from "../ui/hstack"
import { Input, InputField } from "../ui/input"
import DateTimePicker from '@react-native-community/datetimepicker'
import { StyleSheet } from "react-native"

type ChildProps = {
    name: string
    birthday: string,
}

export default function ViewFamilyChild(props: ChildProps) {

    const [isInvalid, setIsInvalid] = useState(false)
    const [show, setShow] = useState(false)
    const [childBirthday, setChildBirthday] = useState(props.birthday)

    return (
        <ThemedView>
            <FormControl className="mb-2"
                isInvalid={isInvalid}
                size="lg"
                isDisabled={false}
                isReadOnly={false}
                isRequired={false}
            >{/*  */}
                <FormControlLabel>
                    <FormControlLabelText>Child Name</FormControlLabelText>
                </FormControlLabel>
                <Input className="my-1 border-black" size="xl">
                    <InputField
                        type="text"
                        // placeholder="Joe"
                        value={props.name}
                    // onChangeText={(name) => onChildNameChange(name)}
                    />
                </Input>
                <FormControlError>
                    {/*<FormControlErrorIcon as={AlertCircleIcon}/>*/}
                    <FormControlErrorText>
                        A Child Name Is Required
                    </FormControlErrorText>
                </FormControlError>
            </FormControl>
            <SafeAreaView>
                <HStack className="mb-5">
                    <FormControl className="py-3"
                        isInvalid={isInvalid}
                        size="lg"
                        isDisabled={false}
                        isReadOnly={false}
                        isRequired={false}
                    >
                        <FormControlLabel>
                            <FormControlLabelText>Child Birthday</FormControlLabelText>
                        </FormControlLabel>
                        <DateTimePicker
                            style={styles.datePicker}
                            testID="dateTimePicker"
                            value={new Date(childBirthday)}
                            mode={'date'}
                        />
                    </FormControl>
                </HStack>
            </SafeAreaView>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    datePicker: {
        marginTop: 3,
        marginLeft: -15
    }
})

