import { Tabs, router, useNavigation } from 'expo-router'
import { TabBarIcon } from '@/components/navigation/TabBarIcon'
import { Colors } from '@/constants/Colors'
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider'
import { Text } from '@/components/ui/text'
import { AddIcon, ArrowRightIcon, Icon } from '@/components/ui/icon'
import { TouchableOpacity, View } from 'react-native'
import { HStack } from '@/components/ui/hstack'
import { Ionicons } from '@expo/vector-icons'
import { useSession } from '@/app/AuthContext'
import { useEffect, useState } from 'react'
import { UserSession } from '@/types'
import { supabase } from '@/lib/Supabase'
import { useStorageState } from '@/app/UseStorageState'

export default function TabLayout() {

    const navigation = useNavigation()

    const { logOut } = useSession()
    const [[isLoading, session], setSession] = useStorageState('session')
    const [familyId, setFamilyId] = useState()
    const [userSession, setUserSession] = useState(session ? JSON.parse(session) : {})

    const [hasNotification, setHasNotification] = useState<boolean>(false);

    useEffect(() => {
        if (userSession) {
            checkNotifications()
            checkFamilyId()
        }
    }, [])

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            checkFamilyId()
            checkNotifications()
        });

        return unsubscribe;
    }, [navigation])

    useEffect(() => {
        setUserSession(session ? JSON.parse(session) : {})
    }, [session])

    const checkNotifications = async () => {
        const userEmail = (await supabase.auth.getUser()).data.user?.email

        const { data, error } = await supabase.from('family_invite').select('*').eq('invited_parent_email', userEmail).eq('declined', false).eq('accepted', false)

        if (error) {
            console.error(error.message)
            return
        }

        if (data.length === 0) setHasNotification(false)
        if (data.length > 0) setHasNotification(true)
    }

    const checkFamilyId = async () => {
        const userId = (await supabase.auth.getUser()).data.user?.id
        const { data, error } = await supabase.from('family_parent').select('family_id').eq('parent_id', userId)

        if (error) {
            console.log(error)
            return
        }
        setFamilyId(data[0].family_id)
    }

    console.log(userSession)

    return (
        <GluestackUIProvider>
            <Tabs
                screenOptions={{
                    tabBarStyle: {
                        backgroundColor: Colors.light.green,
                        shadowColor: '#000',
                        shadowOpacity: 0.25
                    },
                    tabBarInactiveTintColor: '#f7fff7',
                    tabBarActiveTintColor: '#f7fff7',
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: Colors.light.green,
                        shadowColor: 'transparent', // this covers iOS
                        elevation: 0 // this covers Android
                        // shadowColor: '#000',
                        // shadowOpacity: 0.25,
                        // shadowRadius: 3
                    }
                }}>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        headerTitle: ``,
                        headerStatusBarHeight: 50,
                        headerRight: () => (
                            <HStack>
                                {hasNotification ? (<TouchableOpacity onPress={() => router.push('/(app)/screens/NotificationsScreen')} className='mr-3'>
                                    <HStack>
                                        <Ionicons name="notifications" size={34} color="orange" />
                                    </HStack>
                                </TouchableOpacity>) : ''}
                                <TouchableOpacity onPress={() => logOut()} className='mr-3'>
                                    <HStack>
                                        <Ionicons name="log-out-outline" size={34} color="white" />
                                    </HStack>
                                </TouchableOpacity>
                            </HStack>
                        ),
                        headerLeft: () => familyId ? (
                            <TouchableOpacity onPress={() => router.push('/(app)/screens/ViewFamilyScreen')} className='ml-3'>
                                <HStack>
                                    <Ionicons name="people-outline" size={32} color="white" />
                                </HStack>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={() => router.push('/(app)/screens/CreateFamilyScreen')} className='ml-3'>
                                <HStack>
                                    <Ionicons name="person-add-outline" size={28} color="white" />
                                </HStack>
                            </TouchableOpacity>
                        ),
                        tabBarIcon: ({ color, focused }) => (
                            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
                        )
                    }
                    }
                />
                <Tabs.Screen
                    name="CalendarScreen"
                    options={{
                        title: 'Calendar',
                        headerTitle: '',
                        headerStatusBarHeight: 50,
                        headerRight: () => (
                            <TouchableOpacity onPress={() => router.push('/(app)/screens/CreateEventScreen')} className='mr-5 p-2'>
                                <HStack>
                                    <Icon size='xl' as={AddIcon} color='#fff' />
                                    <Text className='ml-2 text-white'>
                                        Add Event
                                    </Text>
                                </HStack>
                            </TouchableOpacity>
                        ),
                        tabBarIcon: ({ color, focused }) => (
                            <TabBarIcon name={focused ? 'calendar' : 'calendar-outline'} color={color} />
                        )
                    }}
                />
            </Tabs>
        </GluestackUIProvider>
    )
}
