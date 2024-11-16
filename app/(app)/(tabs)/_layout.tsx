import { Tabs, router } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider'
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { UserSession, useSession } from '@/app/AuthContext';
import { AddIcon, ArrowRightIcon, Icon } from '@/components/ui/icon';
import { TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { HStack } from '@/components/ui/hstack';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
    const { session } = useSession();
    const userSession: UserSession = session ? JSON.parse(session) : undefined;

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
                            <TouchableOpacity onPress={() => router.push('/(app)/CreateEventScreen')} className='mr-3'>
                                <HStack>
                                    <Ionicons name="log-out-outline" size={32} color="white" />
                                </HStack>
                            </TouchableOpacity>
                        ),
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => router.push('/(app)/CreateEventScreen')} className='ml-3'>
                                <HStack>
                                    <Ionicons name="people-outline" size={32} color="white" />
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
                            <TouchableOpacity onPress={() => router.push('/(app)/CreateEventScreen')} className='mr-5 p-2'>
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
    );
}
