import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Calendar, CalendarUtils } from 'react-native-calendars';

import CalendarKit from '@howljs/calendar-kit';


const TODAYS_DATE = CalendarUtils.getCalendarDateString(new Date());

export default function CalendarScreen() {

    const getDate = (count: number) => {
        const date = new Date(TODAYS_DATE);
        const newDate = date.setDate(date.getDate() + count);
        return CalendarUtils.getCalendarDateString(newDate);
    };

    const [selectedDate, setSelectedDate] = useState(TODAYS_DATE);


    const calendarRef = useRef(null);
    const calendarViewRef = useRef(null);

    const onCalendarDayPressed = async (day: { dateString: string }) => {
        setSelectedDate(day.dateString);
    }

    useEffect(() => {
        console.log(selectedDate);
        //@ts-ignore
        calendarRef.current?.setVisibleDate(selectedDate);
        //@ts-ignore
        calendarRef.current?.goToDate({
            date: selectedDate
        });
        //@ts-ignore
        calendarRef.current?.goToHour(0,true);
    }, [selectedDate])

    return (
        <ScrollView style={styles.container}>
            <Calendar
                minDate={getDate(-14)}
                markingType={'multi-dot'}
                markedDates={{
                    [getDate(10)]: {
                        color: '#70d7c7',
                        customTextStyle: {
                            color: '#FFFAAA',
                            fontWeight: '700'
                        },
                        dots: [
                            { key: 'vacation', color: 'blue', selectedDotColor: 'red' },
                            { key: 'massage', color: 'red', selectedDotColor: 'white' }
                        ]
                    },

                }}
                // theme={{
                //     textInactiveColor: '#a68a9f',
                //     textSectionTitleDisabledColor: 'grey',
                //     textSectionTitleColor: '#319e8e',
                //     arrowColor: '#319e8e'
                // }}
                onDayPress={(day: { dateString: any; }) => onCalendarDayPressed(day)}
            />
            {/* //TODO: Make this a seperate component  */}
            <View style={styles.timeline} ref={calendarViewRef}>
                <CalendarKit ref={calendarRef} numberOfDays={1} scrollToNow={false}/>
            </View>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        marginTop: 100
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
});