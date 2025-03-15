import { useSession } from '../../AuthContext'
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
import { ButtonGroup, ButtonText } from '@/components/ui/button'
import { Center } from '@/components/ui/center'
import { Alert, StyleSheet, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { ThemedText } from '@/components/ThemedText'
import { Colors } from '@/constants/Colors'
import { router } from 'expo-router'
import { supabase } from '@/lib/Supabase'
import { useStorageState } from '@/app/UseStorageState'
import ViewFamilyChild from '@/components/ScreenHelpers/ViewFamilyChild'
import { Spinner } from '@/components/ui/spinner'
import { Child, UserSession } from '@/types'
import BlueButton from '@/components/custom/buttons/BlueButton'


export default function ViewFamilyScreen() {

    const ERROR_MESSAGE_TIMEOUT = 5000

    const [errorMessage, setErrorMessage] = useState('')
    const [isInvalid, setIsInvalid] = useState(false)

    const [familyName, setFamilyName] = useState('')
    const [childName, setChildName] = useState('')
    const [childCreated, setChildCreated] = useState(false)
    const [childBirthday, setChildBirthday] = useState(new Date(1980, 1, 1))
    const [children, setChildren] = useState<Child[]>([])
    const [parentType, setParentType] = useState('')

    const [hasCoParent, setHasCoParent] = useState<boolean>(false)
    const [coParentEmailAddress, setCoParentEmailAddress] = useState<string>('')

    const [show, setShow] = useState(false)
    const [isLoadingFamily, setIsLoadingFamily] = useState(true)
    const [[isLoading, session], setSession] = useStorageState('session')

    const userSession: UserSession = session ? JSON.parse(session) : {}

    useEffect(() => {
    }, [])

    useEffect(() => {
        setTimeout(() => setIsInvalid(false), ERROR_MESSAGE_TIMEOUT)

        if (!isLoading) {
            getFamilyFromDatabase().then(() => setIsLoadingFamily(false))
        }
        checkCoParent()
    }, [isInvalid, session])

    const checkCoParent = async () => {

        // TODO: Check if the coparent invite has been sent and is pending, if it is, dont display the invite form

        const { data, error } = await supabase.from('family_parent').select('parent_id').eq('family_id', userSession.familyId)
        if (error) {
            console.log(error)
            return
        }

        if (!data) return
        if (data.length > 1) setHasCoParent(true)
    }

    const getFamilyFromDatabase = async () => {
        const { data: family, error } = await supabase.from('families').select('name,id').eq('id', userSession.familyId).limit(1).single()
        if (error) {
            console.error(error)
        }

        if (family) setFamilyName(family.name)

        const { data: childrenData, error: childrenError } = await supabase.from('children').select('name,birthday').eq('family_id', family?.id)
        if (childrenData) setChildren(childrenData)

    }

    const onChange = (event: any, selectedDate: any) => {
        const currentDate = new Date(selectedDate)
        setShow(false)
        setChildBirthday(currentDate)
    }

    const onFamilyNameChange = (name: string) => {
        setFamilyName(name)
    }
    const onCoParentEmailChange = (email: string) => {
        setCoParentEmailAddress(email)
    }

    const inviteCoParent = async () => {
        const { data, error } = await supabase.from('parents').select('id,email').eq('email', coParentEmailAddress.toLowerCase()).limit(1)
        if (error) {
            console.error(error.message)
            return
        }
        if (!data) return

        const invitedParent = data[0]

        if (invitedParent.id === userSession.userId) {
            Alert.alert('You cannot invite yourself')
            setCoParentEmailAddress('')
            return
        }

        if (!userSession.familyId) {
            console.error('Theres no family id')
            return
        }

        const { data: familyInvite, error: familyInviteError } = await supabase.from('family_invite').insert([
            {
                family_id: userSession.familyId,
                inviting_parent: userSession.userId,
                invited_parent: invitedParent.id,
                invited_parent_email: invitedParent.email
            }
        ]).select()

        if (familyInviteError) {
            console.error(familyInviteError.message)
            return
        }

        if (!familyInvite) return

        Alert.alert('Sent a famly invite to your co parent. Once they accept, they will be able to view the family calendar, as well as add their own events related to your children. Parents may not remove or update the other parents events without submitting a event change request')

        setHasCoParent(true)

    }


    return (

        <KeyboardAwareScrollView>
            <Center style={styles.container}>
                <VStack className="w-full p-4">
                    <Center>
                        <ThemedText style={styles.errorMessage}>{errorMessage}</ThemedText>
                    </Center>
                    {!hasCoParent ? (
                        <View>
                            <FormControl className="py-4"
                                isInvalid={isInvalid}
                                size="lg"
                                isDisabled={false}
                                isReadOnly={false}
                                isRequired={false}
                            >
                                <FormControlLabel>
                                    <FormControlLabelText size='2xl'>Co Parent Email Address</FormControlLabelText>
                                </FormControlLabel>
                                <FormControlHelper>
                                    <FormControlHelperText>Invite your coparent to manage your families schedule together</FormControlHelperText>
                                </FormControlHelper>
                                <Input className="my-2 border-black" size="xl">
                                    <InputField
                                        type="text"
                                        placeholder='example@email.com'
                                        value={coParentEmailAddress}
                                        onChangeText={(email) => onCoParentEmailChange(email)}
                                    />
                                </Input>
                                <FormControlError>
                                    {/*<FormControlErrorIcon as={AlertCircleIcon}/>*/}
                                    <FormControlErrorText>
                                        A Co Parent Email Address Is Required
                                    </FormControlErrorText>
                                </FormControlError>
                            </FormControl>
                            <FormControl className="pb-4"
                                isInvalid={isInvalid}
                                size="lg"
                                isDisabled={false}
                                isReadOnly={false}
                                isRequired={false}
                            >
                                {/* <FormControlLabel>
                             <FormControlLabelText>Family Name</FormControlLabelText>
                         </FormControlLabel> */}
                                <ButtonGroup>
                                    <BlueButton text={'Invite Co-Parent'} style={styles.inviteCoParentButton}
                                        disabled={false} className="w-full self-end mt-4"
                                        size="xl"
                                        onPress={() => inviteCoParent()}>
                                    </BlueButton>
                                </ButtonGroup>
                            </FormControl>
                        </View>
                    ) : ''}



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
                        <Input isDisabled className="my-1 border-black" size="xl">
                            <InputField
                                type="text"
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



                    {isLoadingFamily ?
                        <Spinner size="large" color={Colors.light.green} />
                        :
                        children.map((child) => (<ViewFamilyChild key={child.name} name={child.name ? child.name : ''} birthday={child.birthday ? child.birthday : ''} />))}

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
    inviteCoParentButton: {
        marginBottom: 20,
        backgroundColor: Colors.light.blue
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

