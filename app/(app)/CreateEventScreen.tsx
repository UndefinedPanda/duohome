import DateTimePicker from '@react-native-community/datetimepicker'
import { useSession } from '../AuthContext'
import { VStack } from '@/components/ui/vstack'
import {
    FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText,
    FormControlLabel,
    FormControlLabelText
} from '@/components/ui/form-control'
import React, { useEffect, useState } from 'react'
import { Center } from '@/components/ui/center'
import { Alert, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native'
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
import { AlertCircleIcon, CheckIcon, ChevronDownIcon } from '@/components/ui/icon'
import { setStorageItemAsync, useStorageState } from '@/app/UseStorageState'
import { Textarea, TextareaInput } from '@/components/ui/textarea'
import { Checkbox, CheckboxGroup, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from '@/components/ui/checkbox'
import { supabase } from '@/lib/Supabase'
import Button from '@/components/Button'
import moment, { Moment } from 'moment'
import { router } from 'expo-router'
import { Child, UserSession } from '@/types'

export default function CreateEventScreen() {

    const ERROR_MESSAGE_TIMEOUT = 5000


    const [isInvalid, setIsInvalid] = useState<boolean>(false)

    const [selectedChildren, setSelectedChildren] = useState<string[]>([])

    const [eventType, setEventType] = useState<string>('')
    const [markerColour, setMarkerColour] = useState<string>('')
    const [eventDate, setEventDate] = useState<Date>(new Date())
    const [description, setDescription] = useState<string>('')

    const [children, setChildren] = useState<Child[]>([])

    const { session } = useSession()
    const userSession: UserSession = session ? JSON.parse(session) : {}

    useEffect(() => {
        setTimeout(() => setIsInvalid(false), ERROR_MESSAGE_TIMEOUT)
        if (session) getChildren().then((data) => setChildren(data))
    }, [isInvalid, session])

    useEffect(() => {


        if (!userSession.familyId) {
            Alert.alert('Must create a family!', 'You must create a family before creating events',
                [
                    { text: 'Go Back', onPress: () => router.replace('/(app)/(tabs)') },
                    { text: 'Create Family', onPress: () => { router.replace('/(app)/CreateFamilyScreen') } },

                ],
            )
        }
    }, [])

    const onDateTimeChange = (event: any, selectedDate: any) => {
        setEventDate(selectedDate)
    }


    const getChildren = async () => {
        const { data, error } = await supabase.from('children').select('id,name').eq('family_id', userSession.familyId)
        if (error) {
            console.log(error.message)
            return []
        }
        return data
    }

    const createEvent = async () => {

        const originalDate = new Date()

        let names = []

        if (selectedChildren.length < 1) {
            Alert.alert('Must select at least one child')
            return
        }

        if (!eventType) {
            Alert.alert('Must select an event / appointment type')
            return
        }
        if (!markerColour) {
            Alert.alert('Must select an calendar marker colour')
            return
        }

        if (eventDate.toISOString() === originalDate.toISOString()) {
            Alert.alert('Must select a date in the future')
            return
        }

        if (!description) {
            Alert.alert('Must add a brief description')
            return
        }

        // get children names
        for (const child of selectedChildren) {
            const { data, error } = await supabase.from('children').select('name').eq('id', child).single()
            if (error) console.log(error)
            names.push(data?.name)
        }

        const date = moment(eventDate).format('YYYY-MM-DD h:mm a').split(' ')[0]
        const time = eventDate.toISOString().split('T')[1]

        const { data, error } = await supabase.from('events').insert([
            {
                parent_id: userSession.userId,
                family_id: userSession.familyId,
                children_names: names,
                type: eventType,
                date,
                date_time: eventDate,
                description,
                marker_colour: markerColour
            }
        ]).select()

        if (error) {
            Alert.alert('There was an error creating this event. Please try again')
            console.log(error?.message)
            return
        }

        console.log(data)

        Alert.alert('Successfully Created This Event!!')

        router.replace('/(app)/(tabs)')

    }



    return (

        <KeyboardAwareScrollView>
            <Center style={styles.container}>
                <VStack className="w-full px-4">
                    <FormControl className="mb-4" size="lg" isInvalid={isInvalid}>
                        <FormControlLabel>
                            <FormControlLabelText>
                                Who's this event for?
                            </FormControlLabelText>
                        </FormControlLabel>
                        <CheckboxGroup
                            value={selectedChildren}

                            onChange={(keys) => {
                                console.log(keys)
                                setSelectedChildren(keys)
                            }}
                        >
                            <VStack space="xl">
                                {children.map(child => (
                                    <Checkbox key={child.id} value={child.id ? child.id.toString() : ''}>
                                        <CheckboxIndicator>
                                            <CheckboxIcon color="#000" as={CheckIcon} />
                                        </CheckboxIndicator>
                                        <CheckboxLabel>{child.name}</CheckboxLabel>
                                    </Checkbox>
                                ))}

                            </VStack>
                        </CheckboxGroup>
                        <FormControlError>
                            <FormControlErrorIcon as={AlertCircleIcon} />
                            <FormControlErrorText>Must select at least one child</FormControlErrorText>
                        </FormControlError>
                    </FormControl>


                    <FormControl className="mb-4" size="lg" isInvalid={isInvalid}>
                        <FormControlLabel>
                            <FormControlLabelText>
                                Type
                            </FormControlLabelText>
                        </FormControlLabel>
                        <Select onValueChange={(value) => setEventType(value)}>
                            <SelectTrigger className="border-black">
                                <SelectInput placeholder="Please Choose One" />
                                <SelectIcon className="mr-3" as={ChevronDownIcon} />
                            </SelectTrigger>
                            <SelectPortal>
                                <SelectBackdrop />
                                <SelectContent style={styles.selectContent}>
                                    <SelectItem key="1" label="Doctor Appointment" value="Doctor"
                                        textStyle={{
                                            size: '3xl'

                                        }} />
                                    <SelectItem key="2" label="Dentist Appointment" value="Dentist"
                                        textStyle={{
                                            size: '3xl'
                                        }} />
                                    <SelectItem key="3" label="Medical Appointment" value="Medical"
                                        textStyle={{
                                            size: '3xl'
                                        }} />
                                    <SelectItem key="4" label="Appointment" value="Appointment" textStyle={{
                                        size: '3xl'
                                    }} />
                                    <SelectItem key="5" label="School" value="School" textStyle={{
                                        size: '3xl'
                                    }} />
                                    <SelectItem key="6" label="Extra Curricular" value="Extra Curricular" textStyle={{
                                        size: '3xl'
                                    }} />
                                    <SelectItem key="7" label="Sports" value="Sports" textStyle={{
                                        size: '3xl'
                                    }} />
                                    <SelectItem key="8" label="Other" value="Other" textStyle={{
                                        size: '3xl'
                                    }} />
                                </SelectContent>
                            </SelectPortal>
                        </Select>
                        <FormControlError>
                            <FormControlErrorIcon as={AlertCircleIcon} />
                            <FormControlErrorText>Must choose an event type</FormControlErrorText>
                        </FormControlError>
                    </FormControl>

                    <FormControl className="mb-4" size="lg" isInvalid={isInvalid}>
                        <FormControlLabel>
                            <FormControlLabelText>
                                Marker Colour
                            </FormControlLabelText>
                        </FormControlLabel>
                        <Select onValueChange={(value) => setMarkerColour(value)}>
                            <SelectTrigger className="border-black">
                                <SelectInput placeholder="Please Choose One" />
                                <SelectIcon className="mr-3" as={ChevronDownIcon} />
                            </SelectTrigger>
                            <SelectPortal>
                                <SelectBackdrop />
                                <SelectContent style={styles.selectContent}>
                                    <SelectItem key="01" label="Red" value="#E3170A" textStyle={{
                                        size: '3xl'

                                    }} />
                                    <SelectItem key="11" label="Green" value="#6AB547" textStyle={{
                                        size: '3xl'
                                    }} />
                                    <SelectItem key="22" label="Blue" value="#48ACF0" textStyle={{
                                        size: '3xl'
                                    }} />
                                    <SelectItem key="33" label="Orange" value="#F15025" textStyle={{
                                        size: '3xl'
                                    }} />
                                    <SelectItem key="44" label="Indigo" value="#2B286F" textStyle={{
                                        size: '3xl'
                                    }} />
                                    <SelectItem key="55" label="Pink" value="#D4399D" textStyle={{
                                        size: '3xl'
                                    }} />
                                    <SelectItem key="66" label="Yellow" value="#F3D930" textStyle={{
                                        size: '3xl'
                                    }} />
                                    <SelectItem key="77" label="Fuscia" value="#8B30F3" textStyle={{
                                        size: '3xl'
                                    }} />
                                </SelectContent>
                            </SelectPortal>
                        </Select>
                        <FormControlError>
                            <FormControlErrorIcon as={AlertCircleIcon} />
                            <FormControlErrorText>Must choose a colour</FormControlErrorText>
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
                                    <FormControlLabelText>Date</FormControlLabelText>
                                </FormControlLabel>
                                <DateTimePicker
                                    style={styles.datePicker}
                                    testID="dateTimePicker"
                                    value={eventDate}
                                    mode={'datetime'}
                                    onChange={onDateTimeChange}
                                    timeZoneName='GMT-5'
                                />
                            </FormControl>
                        </HStack>
                    </SafeAreaView>
                    <FormControl className="mb-6"
                        isInvalid={isInvalid}
                        size="lg"
                        isDisabled={false}
                        isReadOnly={false}
                        isRequired={false}
                    >
                        <FormControlLabel>
                            <FormControlLabelText>Description </FormControlLabelText>
                        </FormControlLabel>
                        <Textarea
                            size="md"
                            isReadOnly={false}
                            isInvalid={false}
                            isDisabled={false}
                        >
                            <TextareaInput placeholder="Add a description..." onChangeText={(text) => setDescription(text)} />
                        </Textarea>
                        <FormControlError>
                            {/*<FormControlErrorIcon as={AlertCircleIcon}/>*/}
                            <FormControlErrorText>
                                A description is required
                            </FormControlErrorText>
                        </FormControlError>
                    </FormControl>

                    <Button text="Create Event" onPress={createEvent} />

                </VStack>
            </Center>
        </KeyboardAwareScrollView>
    )

}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        paddingLeft:
            10,
        paddingRight:
            10
    },
    addChildButton: {
        backgroundColor: Colors.light.green
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
        paddingTop: 10,
        paddingBottom: 10,
        color: '#ff0000'
    },
    datePicker: {
        marginTop: 3,
        marginLeft: -15
    }
})

