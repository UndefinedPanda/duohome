import DateTimePicker from '@react-native-community/datetimepicker'
import { VStack } from '@/components/ui/vstack'
import {
    FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText,
    FormControlLabel,
    FormControlLabelText
} from '@/components/ui/form-control'
import React, { useEffect, useState } from 'react'
import { Input, InputField } from '@/components/ui/input'
import { Button, ButtonGroup, ButtonSpinner, ButtonText } from '@/components/ui/button'
import { Center } from '@/components/ui/center'
import { Alert, SafeAreaView, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { ThemedText } from '@/components/ThemedText'
import { Colors } from '@/constants/Colors'
import { HStack } from '@/components/ui/hstack'
import {
    Select,
    SelectBackdrop,
    SelectContent,
    SelectIcon,
    SelectInput, SelectItem,
    SelectPortal,
    SelectTrigger
} from '@/components/ui/select'
import { AlertCircleIcon, ChevronDownIcon } from '@/components/ui/icon'
import { router } from 'expo-router'
import { supabase } from '@/lib/Supabase'
import { useStorageState } from '@/app/UseStorageState'
import { Child, UserSession } from '@/types'

export default function CreateFamilyScreen() {

    const ERROR_MESSAGE_TIMEOUT = 5000

    const [errorMessage, setErrorMessage] = useState('')
    const [isInvalid, setIsInvalid] = useState(false)

    const [disabledButton, setDisabledButton] = useState(false);

    const [familyName, setFamilyName] = useState('')
    const [childName, setChildName] = useState('')
    const [childCreated, setChildCreated] = useState(false)
    const [childBirthday, setChildBirthday] = useState(new Date())
    const [children, setChildren] = useState<Child[]>([])
    const [parentType, setParentType] = useState('')

    const [show, setShow] = useState(false)

    const [[isLoading, session], setSession] = useStorageState('session')

    useEffect(() => {
        setTimeout(() => setIsInvalid(false), ERROR_MESSAGE_TIMEOUT)
    }, [isInvalid, session])

    const onChange = (event: any, selectedDate: any) => {
        const currentDate = new Date(selectedDate)
        setShow(false)
        setChildBirthday(currentDate)
        console.log(currentDate)
    }

    const onFamilyNameChange = (name: string) => {
        setFamilyName(name)
    }

    const onChildNameChange = (name: string) => {
        setChildName(name)
    }

    const handleSelectChange = (value: string) => {
        setParentType(value)
    }

    const handleAddChild = async () => {
        const originalDate = new Date()

        if (!childName) return Alert.alert('You must add a child name')
        // if (childBirthday === originalDate) return Alert.alert('You must input a valid birthday')

        const newChild: Child = {
            name: childName,
            birthday: childBirthday.toISOString()
        }

        if (children.some(({ name }) => name === newChild.name)) {
            return Alert.alert(childName + ' Is already in your family')
        }

        setChildren([...children, newChild])
        setChildName('')
        setChildBirthday(new Date())

        Alert.alert('Successfully added ' + childName + ' to your family')
        return
    }
    const handleCreateFamily = async () => {
        setDisabledButton(true);
        if (!familyName) return Alert.alert('You must provide a family name')
        if (!parentType) return Alert.alert('You must select whether you are the father or the mother')
        if (children.length < 1) return Alert.alert('You must add a child before creating your family')

        // create family in database
        const addedFamily = await addFamilyToDatabase()
        if (!addedFamily) return Alert.alert('There was an error')
        // success
        Alert.alert('family created')
        router.replace('/(app)/(tabs)')
    }

    const updateParentType = async () => {
        if (!parentType) return Alert.alert('You must select whether you are the father or the mother')

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return Alert.alert('Something went wrong. Please make sure you have internet connection.')

        const { error } = await supabase.from('parents').update({
            parent_type: parentType
        }).eq('id', user.id).select()

        console.log(error)

        if (error) {
            setErrorMessage('There was an error. Please try again')
            return false
        }

        return true
    }

    const addFamilyToDatabase = async () => {

        const updatedParentType = await updateParentType()

        if (!updatedParentType) Alert.alert('There was an error.')

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return Alert.alert('Something went wrong. Please make sure you have internet connection.')

        const { data, error } = await supabase.from('families').insert([{
            name: familyName
        }]).select().limit(1).single()

        if (error) {
            setErrorMessage('There was an error creating your family. Please try again')
            Alert.alert('There was an error creating your family. Please try again')
            return false
        }

        const result = await supabase.from('family_parent').insert([{
            family_id: data?.id,
            parent_id: user?.id
        }])

        // TODO: Fix this
        if (result.error) {
            Alert.alert('There was an error')
        }

        // TODO: Set the session with the new family id

        const oldSession: UserSession = JSON.parse(session ? session : '')

        const newSession = {
            userId: oldSession.userId,
            firstName: oldSession.firstName,
            familyId: data?.id
        }
        console.log(newSession)
        setSession(JSON.stringify(newSession))

        await addChildrenToDatabaseAndFamily(data)
        return true
    }

    const addChildrenToDatabaseAndFamily = async (family: any) => {

        children.forEach(child => child.family_id = family.id)

        const { data, error } = await supabase.from('children').insert(children).select()
        if (error) {
            console.log(error.message)
            setErrorMessage('There was an error. Please try again')
            return
        }
    }

    return (

        <KeyboardAwareScrollView>
            <Center style={styles.container}>
                <VStack className="w-full p-4">
                    <Center>
                        <ThemedText style={styles.errorMessage}>{errorMessage}</ThemedText>
                    </Center>

                    <FormControl className="py-4"
                        isInvalid={isInvalid}
                        size="lg"
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
                                placeholder="Family Name"
                                value={familyName}
                                onChangeText={(name) => onFamilyNameChange(name)}
                            />
                        </Input>
                        <FormControlError>
                            {/*<FormControlErrorIcon as={AlertCircleIcon}/>*/}
                            <FormControlErrorText>
                                A Family Name Is Required
                            </FormControlErrorText>
                        </FormControlError>
                    </FormControl>

                    <FormControl className="mb-4" size="lg">
                        <FormControlLabel>
                            <FormControlLabelText>
                                I Am The
                            </FormControlLabelText>
                        </FormControlLabel>
                        <Select onValueChange={handleSelectChange}>
                            <SelectTrigger className="border-black">
                                <SelectInput placeholder="Please Choose One" />
                                <SelectIcon className="mr-3" as={ChevronDownIcon} />
                            </SelectTrigger>
                            <SelectPortal>
                                <SelectBackdrop />
                                <SelectContent style={styles.selectContent}>
                                    <SelectItem label="Father" value="father" textStyle={{
                                        size: '3xl'

                                    }} />
                                    <SelectItem label="Mother" value="mother" textStyle={{
                                        size: '3xl'
                                    }} />
                                </SelectContent>
                            </SelectPortal>
                        </Select>
                        <FormControlError>
                            <FormControlErrorIcon as={AlertCircleIcon} />
                            <FormControlErrorText>Mandatory field</FormControlErrorText>
                        </FormControlError>
                    </FormControl>


                    <FormControl className="mb-2"
                        isInvalid={isInvalid}
                        size="lg"
                        isDisabled={false}
                        isReadOnly={false}
                        isRequired={false}
                    >
                        <FormControlLabel>
                            <FormControlLabelText>Child Name</FormControlLabelText>
                        </FormControlLabel>
                        <Input className="my-1 border-black" size="xl">
                            <InputField
                                type="text"
                                placeholder="Joe"
                                value={childName}
                                onChangeText={(name) => onChildNameChange(name)}
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
                                    value={childBirthday}
                                    mode={'date'}
                                    onChange={onChange}
                                />
                            </FormControl>
                        </HStack>
                    </SafeAreaView>

                    <Center className="mb-3">
                        <ThemedText>
                            <ThemedText
                                style={{ color: Colors.light.green }}>{children.length}
                            </ThemedText>
                            {children.length === 1 ? ' child' : ' children'} added
                        </ThemedText>
                    </Center>

                    <Button style={styles.addChildButton} className="w-full self-end" size="xl"
                        onPress={handleAddChild}>
                        <ButtonText> Add Child</ButtonText>
                    </Button>

                    {children.length > 0 ? (
                        <ButtonGroup>
                            <Button style={styles.createFamilyButton}
                                disabled={disabledButton} className="w-full self-end mt-4"
                                size="xl"
                                onPress={handleCreateFamily}>
                                <ButtonText>Create Family</ButtonText>
                            </Button>
                        </ButtonGroup>
                    ) : ''}
                </VStack>
            </Center>
        </KeyboardAwareScrollView>
    )

}

const styles = StyleSheet.create({
    container: {
        paddingLeft:
            10,
        paddingRight:
            10
    },
    addChildButton: {
        backgroundColor: Colors.light.blue
    },
    createFamilyButton: {
        marginTop: 100,
        backgroundColor: Colors.light.green
    },
    createFamilyButtonError: {
        backgroundColor: Colors.light.errorRed
    },
    selectContent: {
        paddingBottom: 400
    },
    selectItem: {
        fontSize: 100
    },
    image: {
        marginBottom: 50
    },
    errorMessage: {
        color: '#ff0000'
    },
    datePicker: {
        marginTop: 3,
        marginLeft: -15
    }
})

