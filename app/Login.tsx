import { Link, router } from 'expo-router'
import { useSession } from './AuthContext'
import { VStack } from '@/components/ui/vstack'
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

export default function LoginScreen() {

    const MIN_EMAIL_PASSWORD_SIZE = 6
    const ERROR_MESSAGE_TIMEOUT = 5000

    const { login } = useSession()

    const [isInvalid, setIsInvalid] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        setTimeout(() => setIsInvalid(false), ERROR_MESSAGE_TIMEOUT)
    }, [isInvalid])


    const handleEmailChange = (email: string) => {
        setEmail(email)
    }
    const handlePasswordChange = (password: string) => {
        setPassword(password)
    }

    const handleSubmit = async () => {
        if (password?.length < MIN_EMAIL_PASSWORD_SIZE) {
            setIsInvalid(true)
            return
        } else if (email?.length < MIN_EMAIL_PASSWORD_SIZE) {
            setIsInvalid(true)
            return
        } else {
            setIsInvalid(false)
        }

        const { loggedIn, errorMessage } = await login(email, password)
        if (!loggedIn) {
            setErrorMessage(errorMessage)
            return
        }

        router.replace('/(app)/(tabs)')

    }

    return (

        <KeyboardAwareScrollView>
            <Center style={styles.container}>
                <VStack className="w-full p-4">

                    <Center style={styles.image}>
                        <Image
                            size="2xl"
                            source={require('../assets/images/logo.png')}
                            alt="image"
                        />
                    </Center>

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
                            <FormControlLabelText>Email</FormControlLabelText>
                        </FormControlLabel>
                        <Input className="my-1 border-black" size="xl">
                            <InputField
                                type="text"
                                placeholder="Email Address"
                                value={email}
                                onChangeText={(email) => handleEmailChange(email)}
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
                                An Email Address Is Required
                            </FormControlErrorText>
                        </FormControlError>
                    </FormControl>
                    <FormControl className="py-2"
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
                                onChangeText={(password) => handlePasswordChange(password)}
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
                                At least 6 characters are required.
                            </FormControlErrorText>
                        </FormControlError>
                    </FormControl>
                    <Button className="w-full self-end mt-4 bg-primary-500" size="xl" onPress={handleSubmit}>
                        <ButtonText>Login</ButtonText>
                    </Button>
                    <Center className="mt-10">
                        <Link className="font-bold" href="/Register">
                            <ThemedText className="py-2">Need An Account? Click Here </ThemedText>
                        </Link>

                    </Center>
                </VStack>
            </Center>
        </KeyboardAwareScrollView>
    )

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
})

