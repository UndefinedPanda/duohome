import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Button, ButtonText } from '@/components/ui/button'
import { useSession } from '@/app/AuthContext'
import { CalendarUtils } from 'react-native-calendars'
import { Colors } from '../../../constants/Colors'
import { ThemedView } from '@/components/ThemedView'
import { HStack } from '@/components/ui/hstack'
import { Card } from '@/components/ui/card'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Grid, GridItem } from '@/components/ui/grid'
import { VStack } from '@/components/ui/vstack'
import { router } from 'expo-router'
import { ThemedText } from '@/components/ThemedText'
import { supabase } from '@/lib/Supabase'
import { useEffect, useState } from 'react'
import moment from 'moment'
import { TodayEvent } from '@/types'

const CARD_SIZE = 'lg'

export default function HomeScreen() {
    const getDate = (count: number) => {
        const date = new Date()
        const newDate = date.setDate(date.getDate() + count)
        return new Date(newDate)
    }

    const [todayEvents, setTodayEvents] = useState<TodayEvent[]>([])

    const { session } = useSession()
    const userSession = session ? JSON.parse(session) : {}

    useEffect(() => {
        console.log(userSession);

        if (!session) return
        getTodaysEvent()
    }, [session])


    const openCreateFamilyScreen = () => {
        router.push('/CreateFamilyScreen')
    }

    const getTodaysEvent = async () => {

        const today = moment([]).format('YYYY-MM-DD h:mm a').split(' ')[0]
        console.log(today);

        const { data, error } = await supabase.from('events').select('type,date_time,children_names').eq('family_id', userSession.familyId)
            .eq('date', today)

        if (error) {
            console.log(error.message)
            return
        }

        if (!data) return


        setTodayEvents(data)
    }


    return (
        <ThemedView style={styles.mainContainer}>
            <Grid style={styles.headerContainer} _extra={{
                className: 'grid-cols-12'
            }}>
                {/* <GridItem _extra={{
                    className: 'col-span-8'
                }}>
                    <VStack className='flex '>
                        <Button className="mt-4 bg-red-500 rounded-lg" size="xl" onPress={logOut}>
                            <ButtonText>Logout</ButtonText>
                        </Button>
                        {userSession?.familyId ?
                            <Button className="mt-4 bg-cyan-950 rounded-lg" size="xl"
                                onPress={openViewFamilyScreen}>
                                <ButtonText>View Family</ButtonText>
                            </Button>
                            :
                            <Button className="mt-4 bg-cyan-950 rounded-lg" size="xl"
                                onPress={openCreateFamilyScreen}>
                                <ButtonText>Create Family</ButtonText>
                            </Button>
                        }
                    </VStack>
                </GridItem> */}
            </Grid>
            <Grid style={styles.upComingEventsContainer} _extra={{
                className: 'grid-cols-8'
            }}>
                <GridItem _extra={{
                    className: 'col-span-8'
                }}>
                    <Card style={styles.upComingEventCard} size={CARD_SIZE} variant="elevated" className="m-3">
                        <Heading style={styles.heading} size="xl" className="mb-1">
                            Upcoming Events
                        </Heading>
                        <VStack>
                            <Heading size="lg" className="mb-1">
                                Today
                            </Heading>

                            <Card className='bg-emerald-100' size='sm' variant="elevated">
                                <HStack>
                                    <View style={styles.littleEventBar}>
                                    </View>
                                    <VStack>
                                        {todayEvents.length > 0 ? todayEvents.map(event => {
                                            const time = moment(event.date_time).format("h:mm A")
                                            console.log(event.date_time);

                                            return (<ThemedText key={event.date_time ? event.date_time + Math.random() * 10425 : ''}>{event.type} - {time}: {event?.children_names?.join(', ')}</ThemedText>)
                                        }) :
                                            <ThemedText>No Events Today!</ThemedText>
                                        }
                                    </VStack>
                                </HStack>
                            </Card>
                        </VStack>
                    </Card>
                </GridItem>
            </Grid>
            <View>
                <Grid _extra={{
                    className: 'grid-cols-8'
                }}>
                    <GridItem _extra={{
                        className: 'col-span-8'
                    }}>
                        <Heading style={styles.heading} size="xl" className="mx-3">
                            Messages
                        </Heading>
                        <TouchableOpacity>
                            <HStack className='mr-3' style={{ width: '85%' }}>
                                <Card style={styles.cardNumber} size='md' className="ml-3 mt-3">
                                    <Heading size='xl'>0</Heading>
                                </Card>
                                <Card style={styles.eventCard} size='md' className="mr-3 mt-3">
                                    <Text size='lg'>New Messages</Text>
                                </Card>
                            </HStack>
                        </TouchableOpacity>
                    </GridItem>
                    <GridItem _extra={{
                        className: 'col-span-8'
                    }}>
                        <Heading style={styles.heading} size="xl" className="mx-3">
                            Event Change Requests
                        </Heading>
                        <TouchableOpacity>
                            <HStack className='mr-3' style={{ width: '85%' }}>
                                <Card style={styles.cardNumber} size='md' className="ml-3 mt-3">
                                    <Heading size='xl'>0</Heading>
                                </Card>
                                <Card style={styles.eventCard} size='md' className="mr-3 mt-3">
                                    <Text size='lg'>New Requests</Text>
                                </Card>
                            </HStack>
                        </TouchableOpacity>
                    </GridItem>
                    <GridItem _extra={{
                        className: 'col-span-8'
                    }}>
                        <Heading style={styles.heading} size="xl" className="mx-3">
                            Images
                        </Heading>
                        <TouchableOpacity>
                            <HStack className='mr-3' style={{ width: '85%' }}>
                                <Card style={styles.cardNumber} size='md' className="ml-3 mt-3 ">
                                    <Heading size='xl'>0</Heading>
                                </Card>
                                <Card style={styles.eventCard} size='md' className="mr-3 mt-3">
                                    <Text size='lg'>New Images</Text>
                                </Card>
                            </HStack>
                        </TouchableOpacity>
                    </GridItem>
                    <GridItem _extra={{
                        className: 'col-span-8'
                    }}>
                        <Heading style={styles.heading} size="xl" className="mx-3">
                            Documents
                        </Heading>
                        <TouchableOpacity>
                            <HStack className='mr-3' style={{ width: '85%' }}>
                                <Card style={styles.cardNumber} size='md' className="ml-3 mt-3">
                                    <Heading size='xl'>0</Heading>
                                </Card>
                                <Card style={styles.eventCard} size='md' className="mr-3 mt-3">
                                    <Text size='lg'>New Documents</Text>
                                </Card>
                            </HStack>
                        </TouchableOpacity>
                    </GridItem>
                </Grid>
            </View>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        width: "100%",
        height: '100%'
    },
    headerContainer: {
        width: '100%',
        height: 50,
        padding: 15,
        backgroundColor: Colors.light.green
    },
    upComingEventsContainer: {
        height: 230,
        marginTop: -50
    },
    cardNumber: {
        borderTopEndRadius: 0,
        borderBottomEndRadius: 0,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 5,
        backgroundColor: Colors.light.green,
        marginBottom: 20,
        shadowColor: '#151515',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 2
    },
    eventCard: {
        width: '100%',
        marginBottom: 20,
        shadowColor: '#151515',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 2
    },
    littleEventBar: {
        width: 10,
        borderRadius: 5,
        backgroundColor: Colors.light.darkGreen,
        marginRight: 10,
    },
    upComingEventCard: {
        height: '90%',
        marginBottom: 20,
        shadowColor: '#151515',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 2
    },
    eventVStack: {
        marginRight: 40
    },
    heading: {
        color: Colors.light.green
    },
    informationSectionNumber: {
        paddingRight: 20,
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

})