import DateTimePicker from '@react-native-community/datetimepicker'
import { useSession } from '../../AuthContext'
import { VStack } from '@/components/ui/vstack'
import {
    FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText,
    FormControlLabel,
    FormControlLabelText
} from '@/components/ui/form-control'
import React, { useEffect, useState } from 'react'
import { Center } from '@/components/ui/center'
import { Alert, SafeAreaView, StyleSheet, View } from 'react-native'
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
import BlueButton from '@/components/custom/buttons/BlueButton'
import moment, { Moment } from 'moment'
import { router, useLocalSearchParams } from 'expo-router'
import { Child, UserSession } from '@/types'

import ntc from '../../../lib/ntc'

export default function EditEventScreen() {

    const ERROR_MESSAGE_TIMEOUT = 5000

    const [isInvalid, setIsInvalid] = useState<boolean>(false)

    const [selectedChildren, setSelectedChildren] = useState<string[]>([])

    const [eventType, setEventType] = useState<string>('')
    const [markerColour, setMarkerColour] = useState<string>('')
    const [markerColourName, setMarkerColourName] = useState<string>('')
    const [eventDate, setEventDate] = useState<Date>(new Date())
    const [description, setDescription] = useState<string>('')

    const [children, setChildren] = useState<Child[]>([])

    const [[isLoading, session], setSession] = useStorageState('session')
    const userSession: UserSession = session ? JSON.parse(session) : {}

    const { eventId } = useLocalSearchParams()
    const [selectedEvent, setSelectedEvent] = useState<any[]>();
    const [selectedEventChildren, setSelectedEventChildren] = useState<any[]>()

    const [createdByParentName, setCreatedByParentName] = useState<string>('')
    const [createdByParentId, setCreatedByParentId] = useState<string>('')

    useEffect(() => {
        // TODO: Add loading icon
        if (isLoading) console.log('loading')
        setTimeout(() => setIsInvalid(false), ERROR_MESSAGE_TIMEOUT)
        if (session) {
            getChildren().then((data) => setChildren(data))
            getSelectedEvent().then((data) => setSelectedEvent(data))
        }

        console.log(selectedEvent)

    }, [isInvalid, session])

    useEffect(() => {
        if (!selectedEvent) return

        setEventType(selectedEvent[0].type)
        setDescription(selectedEvent[0].description)
        setEventDate(new Date(selectedEvent[0].date_time))
        const markerColourName = ntc.name(`${selectedEvent[0].marker_colour}`)
        setMarkerColour(selectedEvent[0].marker_colour)
        setMarkerColourName(markerColourName[1].toString())
        setCreatedByParentId(selectedEvent[0].parent_id)
    }, [selectedEvent])


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

    const getSelectedEvent = async () => {
        // TODO: send back to main screen or handle this accordingly
        if (!eventId) return;
        const { data, error } = await supabase.from('events').select('*').eq('id', eventId)
        if (error) {
            console.log(error.message)
            return []
        }
        setSelectedEventChildren(data[0].children_names)

        const createdByWhichParent = await supabase.from('parents').select('first_name').eq('id', data[0].parent_id)
        if (createdByWhichParent.error) {
            console.log(createdByWhichParent.error.message)
            return []
        }
        const parentFirstName: string = createdByWhichParent.data[0].first_name

        setCreatedByParentName(parentFirstName.charAt(0).toUpperCase() + parentFirstName.slice(1))
        return data

    }

    const editEvent = async () => {

        if (!selectedEvent) {
            Alert.alert('Theres no selected Event. Please try again.')
            return
        }

        if(createdByParentId !== userSession.userId) {
            Alert.alert('You cannot change events that your co parent has created. Please Request a change')
            return
        }

        const originalDate = new Date()

        let names = []

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

        console.log(markerColour)
        console.log(eventType)

        const { data, error } = await supabase.from('events').update([
            {
                type: eventType,
                date,
                date_time: eventDate,
                description,
                marker_colour: markerColour
            }
        ]).eq('id', selectedEvent[0].id).select()

        if (error) {
            Alert.alert('There was an error updating this event. Please try again')
            return
        }

        Alert.alert('Successfully updated this event')

        router.replace('/(app)/(tabs)')

    }

    return (

        <KeyboardAwareScrollView>
            <Center style={styles.container}>
                <VStack className="w-full px-4">
                    <ThemedText style={styles.createdByText}>Created By {createdByParentName} </ThemedText>
                    <FormControl className="mb-4" size="lg" isInvalid={isInvalid}>
                        <FormControlLabel>
                            <FormControlLabelText>
                                This Event Is For
                            </FormControlLabelText>
                        </FormControlLabel>
                        <CheckboxGroup isDisabled
                            value={selectedChildren}
                            onChange={(keys) => {
                                setSelectedChildren(keys)
                            }}
                        >
                            <VStack space="xl">
                                {children.map((child, index) => {
                                    if (selectedEventChildren?.includes(child.name)) {
                                        return (

                                            <Checkbox key={child.id} value={child.id ? child.id.toString() : ''} isChecked={selectedEventChildren?.includes(child.name)}>
                                                <CheckboxIndicator>
                                                    <CheckboxIcon color="#000" as={CheckIcon} />
                                                </CheckboxIndicator>
                                                <CheckboxLabel>{child.name}</CheckboxLabel>
                                            </Checkbox>
                                        )
                                    }
                                })}
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
                                Event Type
                            </FormControlLabelText>
                        </FormControlLabel>
                        <Select onValueChange={(value) => {
                            setEventType(value)
                            console.log(value)
                        }}  >
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
                        <Select onValueChange={(value) => setMarkerColour(value)} defaultValue={markerColourName} initialLabel={markerColourName} >
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
                                    timeZoneName={Intl.DateTimeFormat().resolvedOptions().timeZone}
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
                            <TextareaInput defaultValue={description} onChangeText={(text) => setDescription(text)} />
                        </Textarea>
                        <FormControlError>
                            {/*<FormControlErrorIcon as={AlertCircleIcon}/>*/}
                            <FormControlErrorText>
                                A description is required
                            </FormControlErrorText>
                        </FormControlError>
                    </FormControl>

                    <BlueButton text="Edit Event" onPress={editEvent} />

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
    },
    createdByText: {
        paddingTop: 20,
        marginBottom: 10,
        fontSize: 25
    }
})

