import { Link, router } from 'expo-router';
import { useSession } from '../AuthContext';
import { VStack } from '@/components/ui/vstack';
import {
    FormControl, FormControlError, FormControlErrorText,
    FormControlHelper,
    FormControlHelperText,
    FormControlLabel,
    FormControlLabelText
} from '@/components/ui/form-control'
import React, { useEffect, useState } from 'react'
import { Input, InputField } from '@/components/ui/input'
import { Button, ButtonText } from '@/components/ui/button'
import { Center } from '@/components/ui/center'
import { Image } from '@/components/ui/image'
import { StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { ThemedText } from '@/components/ThemedText'

export default function CreateFamilyScreen() {

    const ERROR_MESSAGE_TIMEOUT = 5000;

    const {login} = useSession();

    const [isInvalid, setIsInvalid] = useState(false);
    const [familyName, setFamilyName] = useState("");

    const [errorMessage, setErrorMessage] = useState('');

    const [childCreated, setChildCreated] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsInvalid(false), ERROR_MESSAGE_TIMEOUT);
    }, [isInvalid]);


    const handleFamilyNameChange = (name: string) => {
        setFamilyName(name);
    }

    const handleSubmit = async () => {

    }

    return (

        <KeyboardAwareScrollView>
            <Center style={styles.container}>
                <VStack className="w-full p-4">


                    <Center>
                        <ThemedText style={styles.errorMessage}>{errorMessage}</ThemedText>
                    </Center>

                    <FormControl className="py-2"
                                 isInvalid={isInvalid}
                                 size="md"
                                 isDisabled={false}
                                 isReadOnly={false}
                                 isRequired={false}
                    >
                        <FormControlLabel>
                            <FormControlLabelText>Family Name</FormControlLabelText>
                        </FormControlLabel>
                        <Input className="my-1 border-black" size="xl">
                            <InputField
                                type="text"
                                placeholder="Surrey Family"
                                value={familyName}
                                onChangeText={(name) => handleFamilyNameChange(name)}
                            />
                        </Input>
                        <FormControlHelper>
                            <FormControlHelperText>
                                Must be at least 3 characters long, but no longer than 255.
                            </FormControlHelperText>
                        </FormControlHelper>
                        <FormControlError>
                            {/*<FormControlErrorIcon as={AlertCircleIcon}/>*/}
                            <FormControlErrorText>
                                A Family Name Is Required
                            </FormControlErrorText>
                        </FormControlError>
                    </FormControl>
                    {childCreated ? (
                            <Button className="w-full self-end mt-4 bg-primary-500" size="xl" onPress={handleSubmit}>
                                <ButtonText>Create Family</ButtonText>
                            </Button>)
                        : (
                            <Button className="w-full self-end mt-4 bg-primary-500" size="xl" onPress={handleSubmit}>
                                <ButtonText>Create Family</ButtonText>
                            </Button>)}
                </VStack>
            </Center>
        </KeyboardAwareScrollView>
    );

}

const styles = StyleSheet.create({
    container: {
        marginTop: 175,
        paddingLeft: 10,
        paddingRight: 10
    },
    image: {
        marginBottom: 50
    },
    errorMessage: {
        color: '#ff0000'
    }
});

