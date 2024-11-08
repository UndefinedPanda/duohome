import { StyleSheet, View, } from 'react-native';

import { Button, ButtonText } from '@/components/ui/button'
import { useSession } from '@/app/AuthContext'
import { CalendarBody, CalendarContainer, CalendarHeader } from '@howljs/calendar-kit';
import { Calendar, CalendarUtils } from 'react-native-calendars';

import { Colors } from '../../../constants/Colors';
import { ThemedView } from '@/components/ThemedView';
import { HStack } from '@/components/ui/hstack';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Grid, GridItem } from '@/components/ui/grid';
import { VStack } from '@/components/ui/vstack';
import { router } from 'expo-router';

const TODAYS_DATE = CalendarUtils.getCalendarDateString(new Date());

const CARD_SIZE = 'lg';

export default function HomeScreen() {
    const getDate = (count: number) => {
        const date = new Date(TODAYS_DATE);
        const newDate = date.setDate(date.getDate() + count);
        return CalendarUtils.getCalendarDateString(newDate);
    };

    const openCreateFamilyScreen = () => {
        router.push('/CreateFamilyScreen')
    }

    const { logOut } = useSession();

    return (
        <ThemedView style={styles.mainContainer}>
            <View style={styles.calendarContainer} >
                {/* <Calendar
                    style={styles.calendar}
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
                    theme={{
                        // textInactiveColor: 'white',
                        textSectionTitleDisabledColor: Colors.light.text,
                        textSectionTitleColor: Colors.light.text,
                        arrowColor: Colors.light.text,
                        monthTextColor: Colors.light.green,
                        selectedDayBackgroundColor: '#00adf5',
                        selectedDayTextColor: '#ffffff',
                    }}
                    onDayPress={(day: { dateString: any; }) => console.warn('day pressed')}
                /> */}
            </View>
            <Grid style={styles.cardsContainer} _extra={{
                className: 'grid-cols-8'
            }}>
                <GridItem _extra={{
                    className: 'col-span-8'
                }}>
                    <Card style={styles.card} size={CARD_SIZE} variant="elevated" className="m-3 rounded-none ">
                        <HStack space='2xl'>
                            <VStack style={styles.eventVStack}>
                                <Heading style={styles.heading} size="lg" className="mb-1">
                                    Today's Event
                                </Heading>
                                <Text size="md">Dentist Appointment</Text>
                                <Text size="md">Time: 3:15pm</Text>
                                <Text size="md">For: Alex</Text>
                            </VStack>
                            <VStack>
                                <Heading style={styles.heading} size="lg" className="mb-1">
                                    Notifications
                                </Heading>
                                <Text size="md">2 Unread Messages</Text>
                                <Text size="md">1 Change Request</Text>
                                <Text size="md">1 New Document</Text>
                                <Text size="md">5 New Pictures</Text>
                            </VStack>
                        </HStack>
                    </Card>
                </GridItem>
                {/* <GridItem _extra={{
                        className: 'col-span-4'
                    }}>
                        <Card size={CARD_SIZE} variant="elevated" className="m-3 rounded-none">
                            <Heading size="md" className="mb-1">
                                Unread Messages
                            </Heading>
                            <Text size="sm">You have 4 Unread Messages</Text>
                        </Card>
                    </GridItem> */}

                {/* <GridItem _extra={{
                        className: 'col-span-4'
                    }}>
                        <Card size={CARD_SIZE} variant="elevated" className="m-3 rounded-none">
                            <Heading size="md" className="mb-1">
                                Recent Documents
                            </Heading>
                            <Text size="sm">1 new document</Text>
                        </Card>
                    </GridItem> */}
                <GridItem _extra={{
                    className: 'col-span-8'
                }}>
                    <Card style={styles.card} size={CARD_SIZE} variant="elevated" className="m-3 rounded-none ">
                        <Heading style={styles.heading} size="lg" className="mb-1">
                            Quick Actions
                        </Heading>
                        <HStack space='2xl'>
                            <VStack style={styles.eventVStack}>
                                <Text size="md">Create Event</Text>
                                <Text size="md">Message Co-Parent</Text>
                                <Text size="md">Scan Document</Text>
                                <Text size="md">Upload Image</Text>
                            </VStack>
                            <VStack>
                                <Button className="mt-4 bg-primary-500" size="xl" onPress={openCreateFamilyScreen}>
                                    <ButtonText>Create Family</ButtonText>
                                </Button>
                                <Button className="mt-4 bg-primary-500" size="xl" onPress={logOut}>
                                    <ButtonText>Logout</ButtonText>
                                </Button>
                                <Text size="md">1 Appointment Change Request</Text>
                                <Text size="md">1 New Document</Text>
                                <Text size="md">5 New Pictures</Text>
                            </VStack>
                        </HStack>
                    </Card>
                </GridItem>
            </Grid>
        </ThemedView>
    );
};
{/* <Button className="w-full self-end mt-6 bg-primary-500" size="md" onPress={() => {
                logOut();
            }}>
                <ButtonText>Log Out</ButtonText>
            </Button> */}

const styles = StyleSheet.create({
    mainContainer: {
        marginTop: 30,
        width: "100%",
        height: '100%'
    },
    calendarContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        width: '100%',
    },
    cardsContainer: {
        width: '100%',
        height: '100%',
        marginTop: 20,
    },
    cardsStack: {
        width: '100%'
    },
    card: {
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 3,
    },
    eventVStack: {
        marginRight: 40,
    },
    heading: {
        color: Colors.light.green,
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
    },
    calendar: {
        height: 320,
        paddingRight: 10,
        paddingLeft: 10,
        backgroundColor: Colors.light.beige,
        color: Colors.light.text,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 5,
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