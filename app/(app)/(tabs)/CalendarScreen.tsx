import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { Calendar, CalendarUtils } from 'react-native-calendars'

import CalendarKit, { EventItem } from '@howljs/calendar-kit'
import { ThemedView } from '@/components/ThemedView'
import { useSession } from '@/app/AuthContext'
import { supabase } from '@/lib/Supabase'
import { Spinner } from '@/components/ui/spinner'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import moment from 'moment'
import { UserSession } from '@/types'
import { router } from 'expo-router'

const TODAYS_DATE = CalendarUtils.getCalendarDateString(new Date())

export default function CalendarScreen() {

    const getDate = (count: number) => {
        const date = new Date(TODAYS_DATE)
        const newDate = date.setDate(date.getDate() + count)
        return CalendarUtils.getCalendarDateString(newDate)
    }

    const { session } = useSession()
    const userSession: UserSession = session ? JSON.parse(session) : {}
    const [markedDates, setMarkedDates] = useState<any>({})
    const [selectedDate, setSelectedDate] = useState(TODAYS_DATE)
    const [eventItems, setEventItems] = useState<EventItem[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    const calendarRef = useRef(null)
    const calendarViewRef = useRef(null)

    const [selectedEvent, setSelectedEvent] = useState(null);

    const onCalendarDayPressed = async (day: { dateString: string }) => {
        setSelectedDate(day.dateString)
    }

    useEffect(() => {
        //@ts-ignore
        calendarRef.current?.goToDate({
            date: selectedDate
        })
        //@ts-ignore
        calendarRef.current?.goToHour(0, true)
        //@ts-ignore
        calendarRef.current?.setVisibleDate(selectedDate)
    }, [selectedDate])

    useEffect(() => {
        if (!session) return
        getEvents().then(() => setIsLoading(false))
    }, [])

    const getEvents = async () => {
        const { data, error } = await supabase.from('events').select('*').eq('family_id', userSession.familyId)
        if (error) {
            console.log(error.message)
            setIsLoading(false)
            return
        }

        if (!data) return

        const checkedDates: any = []

        const preparedMarkedDates: any = {}
        const events: EventItem[] = []

        for (let i = 0; i < data.length; i++) {

            const eventStart = new Date(data[i].date_time);
            const addedHour = 60 * 60 * 1000
            const eventEnd = new Date(eventStart.getTime() + addedHour)

            const event = {
                id: data[i].id,
                title: data[i].description,
                start: { dateTime: eventStart.toISOString().split('.')[0] + 'Z' },
                end: { dateTime: eventEnd.toISOString().split('.')[0] + 'Z' },
                color: data[i].marker_colour,
            }

            events.push(event);

            if (checkedDates.includes(data[i].date)) {
                continue
            }

            const date = data[i].date
            const sameDates = []

            for (let j = 0; j < data.length; j++) {
                if (data[i].id !== data[j].id && date === data[j].date) {
                    sameDates.push(data[j])
                }
                checkedDates.push(date);
            }

            const dots = [{ key: data[i].id, color: data[i].marker_colour }]
            sameDates.forEach(date => dots.push({ key: date.type, color: date.marker_colour }))
            preparedMarkedDates[date] = {
                dots,
            }
        }
        setEventItems(events)
        setMarkedDates(preparedMarkedDates)
    }

    // Delete / Edit the event here
    const pressEvent = async (event: any) => {
        if(!event) return
        router.push(`/(app)/screens/EditEventScreen?eventId=${event.id}`)
    }

    const handleEventDragStart = async (event: any) => {
        setSelectedEvent(event);
        console.log('set the selected event')
    }

    const editEventEnd = async (event: any, newStart: any, newEnd: any) => {
        const selectedEvent = eventItems.filter(eventItem => eventItem.id === event.id)
        if (!selectedEvent) return console.log('no event?')
        const newStartTime = selectedEvent[0].start.dateTime
        const newEndTime = selectedEvent[0].end.dateTime
        console.log(newStart, newEnd)
        if (!newStartTime || !newEndTime) return

        const newStartDate = new Date(newStartTime)
        const newEndDate = new Date(newEndTime)

        console.log(newStart, newEnd)
        const newEvent = {
            id: selectedEvent[0].id,
            title: selectedEvent[0].description,
            start: { dateTime: newStartDate.toISOString().split('.')[0] + 'Z' },
            end: { dateTime: newEndDate.toISOString().split('.')[0] + 'Z' },
            color: selectedEvent[0].marker_colour,
        }

        // console.log(selectedEvent);
    }

    const longPressEvent = async (event: any) => {
        console.log(event);
    }

    return (
        <ThemedView style={styles.container}>
            {isLoading ? <Spinner size="large" color={Colors.light.green} /> :
                (<View>
                    <Calendar
                        minDate={getDate(-1)}
                        markingType={'multi-dot'}
                        markedDates={markedDates}
                        // theme={{
                        //     textInactiveColor: '#a68a9f',
                        //     textSectionTitleDisabledColor: 'grey',
                        //     textSectionTitleColor: '#319e8e',
                        //     arrowColor: '#319e8e'
                        // }}
                        onDayPress={(day: { dateString: any }) => onCalendarDayPressed(day)}
                    />
                    <View style={styles.timeline} ref={calendarViewRef}>
                        <CalendarKit
                            events={eventItems} hourFormat="h:mm a" ref={calendarRef} numberOfDays={1} scrollToNow={false}
                            // allowDragToEdit={true}
                            // selectedEvent={selectedEvent}
                            // onDragSelectedEventStart={handleEventDragStart}
                            // // @ts-ignore
                            // onDragSelectedEventEnd={editEventEnd}
                            // use this to delete the event
                            onLongPressEvent={longPressEvent}
                            onPressEvent={pressEvent} />
                    </View>
                </View>)}

        </ThemedView>
    )
}


const styles = StyleSheet.create({
    container: {
    },
    timeline: {
        width: '100%',
        height: 500
    },
    agenda: {
        height: 500
    },
    text: {
        textAlign: 'center',
        padding: 10,
        backgroundColor: 'lightgrey',
        fontSize: 16
    },
    disabledText: {
        color: 'grey'
    },
    defaultText: {
        color: 'purple'
    }
    // customCalendar: {
    //     height: 250,
    //     borderBottomWidth: 1,
    //     borderBottomColor: 'lightgrey'
    // },
    // customDay: {
    //     textAlign: 'center'
    // },
    // customHeader: {
    //     backgroundColor: '#FCC',
    //     flexDirection: 'row',
    //     justifyContent: 'space-around',
    //     marginHorizontal: -4,
    //     padding: 8
    // },
    // customTitleContainer: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     padding: 10
    // },
    // customTitle: {
    //     fontSize: 16,
    //     fontWeight: 'bold',
    //     color: '#00BBF2'
    // }
})