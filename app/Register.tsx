import { Link, router } from 'expo-router'
import { useSession } from './AuthContext'
import { VStack } from '@/components/ui/vstack'
import {
    FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText,
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
import { supabase } from '@/lib/Supabase'
import { ThemedView } from '@/components/ThemedView'

export default function RegisterScreen() {
    const ERROR_MESSAGE_TIMEOUT = 10000
    const MIN_NAME_LENGTH = 2
    const MIN_PASSWORD_LENGTH = 6
    const MIN_EMAIL_LENGTH = 6

    const { register } = useSession()

    const [isInvalid, setIsInvalid] = useState(false)
    const [email, setEmail] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [emailErrorMessage, setEmailErrorMessage] = useState("")
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("")
    const [firstNameErrorMessage, setFirstNameErrorMessage] = useState("")
    const [lastNameErrorMessage, setLastNameErrorMessage] = useState("")

    useEffect(() => {
        setTimeout(() => setIsInvalid(false), ERROR_MESSAGE_TIMEOUT)
    }, [isInvalid])

    const handleEmailChange = (text: string) => {
        setEmail(text)
    }
    const handleFirstNameChange = (text: string) => {
        setFirstName(text)
    }
    const handleLastNameChange = (text: string) => {
        setLastName(text)
    }
    const handlePasswordChange = (text: string) => {
        setPassword(text)
    }
    const handleConfirmPasswordChange = (text: string) => {
        setConfirmPassword(text)
    }

    const handleSubmit = async () => {
        if (!checkUserInput()) {
            const { registered, errorMessage } = await register(email, firstName, lastName, password)

            if (!registered) {
                setEmailErrorMessage(errorMessage)
                return
            }
            router.replace('/(app)/(tabs)')
        }
    }

    const checkUserInput = () => {
        if (!email?.includes("@")) {
            setEmailErrorMessage("Email must be a valid email address")
            setIsInvalid(true)
        }
        if (email?.length < MIN_EMAIL_LENGTH) {
            setEmailErrorMessage("Email must be longer than 6 characters")
            setIsInvalid(true)
        }
        if (firstName?.length < MIN_NAME_LENGTH) {
            setFirstNameErrorMessage("First Name must be greater than 2 characters")
            setIsInvalid(true)
        }
        if (lastName?.length < MIN_NAME_LENGTH) {
            setLastNameErrorMessage("Last Name must be greater than 2 characters")
            setIsInvalid(true)
        }
        if (password?.length < MIN_PASSWORD_LENGTH) {
            setPasswordErrorMessage("Password must be greater than 6 characters")
            setIsInvalid(true)
        }
        if (confirmPassword?.length < MIN_PASSWORD_LENGTH) {
            setPasswordErrorMessage("Password must be greater than 6 characters")
            setIsInvalid(true)
        }
        if (password !== confirmPassword) {
            setPasswordErrorMessage("Password and Confirm Password must match")
            setIsInvalid(true)
        }

        return isInvalid
    }

    return (
        <KeyboardAwareScrollView>
            <Center style={styles.container}>
                <VStack className="w-full px-4">

                    <Center>
                        <Image
                            size="2xl"
                            source={require('../assets/images/logo.png')}
                            alt="image"
                        />
                    </Center>
                    <Center>
                        <ThemedText style={styles.errorMessage}>{emailErrorMessage}</ThemedText>
                    </Center>
                    <FormControl className="py-1"
                        isInvalid={isInvalid}
                        size="md"
                        isDisabled={false}
                        isReadOnly={false}
                        isRequired={false}
                    >
                        <FormControlLabel>
                            <FormControlLabelText>Email</FormControlLabelText>
                        </FormControlLabel>
                        <Input className="my-1 border-black" size="xl">
                            <InputField
                                type="text"
                                placeholder="Email Address"
                                value={email}
                                onChangeText={(text) => handleEmailChange(text)}
                            />
                        </Input>
                        <FormControlHelper>
                            <FormControlHelperText>
                                Must be a valid email address.
                            </FormControlHelperText>
                        </FormControlHelper>
                        <FormControlError>
                            {/*<FormControlErrorIcon as={AlertCircleIcon}/>*/}
                            <FormControlErrorText>
                                {emailErrorMessage}
                            </FormControlErrorText>
                        </FormControlError>
                    </FormControl>
                    <FormControl className="py-1"
                        isInvalid={isInvalid}
                        size="md"
                        isDisabled={false}
                        isReadOnly={false}
                        isRequired={false}
                    >
                        <FormControlLabel>
                            <FormControlLabelText>First Name</FormControlLabelText>
                        </FormControlLabel>
                        <Input className="my-1 border-black" size="xl">
                            <InputField
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChangeText={(text) => handleFirstNameChange(text)}
                            />
                        </Input>
                        <FormControlHelper>
                            <FormControlHelperText>
                                Please enter your first name
                            </FormControlHelperText>
                        </FormControlHelper>
                    </FormControl>
                    <FormControl className="py-1"
                        isInvalid={isInvalid}
                        size="md"
                        isDisabled={false}
                        isReadOnly={false}
                        isRequired={false}
                    >
                        <FormControlLabel>
                            <FormControlLabelText>Last Name</FormControlLabelText>
                        </FormControlLabel>
                        <Input className="my-1 border-black" size="xl">
                            <InputField
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChangeText={(text) => handleLastNameChange(text)}
                            />
                        </Input>
                        <FormControlHelper>
                            <FormControlHelperText>
                                Please enter your last name
                            </FormControlHelperText>
                        </FormControlHelper>
                    </FormControl>
                    <FormControl className="py-1"
                        isInvalid={isInvalid}
                        size="md"
                        isDisabled={false}
                        isReadOnly={false}
                        isRequired={false}
                    >
                        <FormControlLabel>
                            <FormControlLabelText>Password</FormControlLabelText>
                        </FormControlLabel>
                        <Input className="my-1 border-black" size="xl">
                            <InputField
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChangeText={(text) => handlePasswordChange(text)}
                            />
                        </Input>
                        <FormControlHelper>
                            <FormControlHelperText>
                                Must be at least 6 characters.
                            </FormControlHelperText>
                        </FormControlHelper>
                        <FormControlError>
                            {/*<FormControlErrorIcon as={AlertCircleIcon}/>*/}
                            <FormControlErrorText>
                                {passwordErrorMessage}
                            </FormControlErrorText>
                        </FormControlError>
                    </FormControl>
                    <FormControl
                        isInvalid={isInvalid}
                        size="md"
                        isDisabled={false}
                        isReadOnly={false}
                        isRequired={false}
                    >
                        <FormControlLabel>
                            <FormControlLabelText>Confirm Password</FormControlLabelText>
                        </FormControlLabel>
                        <Input className="my-1 border-black" size="xl">
                            <InputField
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChangeText={(text) => handleConfirmPasswordChange(text)}
                            />
                        </Input>
                        <FormControlError>
                            {/*<FormControlErrorIcon as={AlertCircleIcon}/>*/}
                            <FormControlErrorText>
                                {passwordErrorMessage}
                            </FormControlErrorText>
                        </FormControlError>
                    </FormControl>

                    <Button className="w-full self-end mt-6 bg-primary-500" size="md" onPress={handleSubmit}>
                        <ButtonText>Register</ButtonText>
                    </Button>
                    <Center className="mt-6">
                        <Link className="font-bold" href="/Login">
                            <ThemedText className="py-2">Already Have An Account? Click Here </ThemedText>
                        </Link>
                    </Center>
                </VStack>
            </Center>
        </KeyboardAwareScrollView>
    )
}


const styles = StyleSheet.create({
    container: {
        marginTop: 75,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 100,
    },
    errorMessage: {
        color: '#ff0000'
    }
})
