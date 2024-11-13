import { Tabs, router } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider'
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { UserSession, useSession } from '@/app/AuthContext';

export default function TabLayout() {
    const { session } = useSession();
    const userSession: UserSession = session ? JSON.parse(session) : undefined;

    return (
        <GluestackUIProvider>
            <Tabs
                sceneContainerStyle={{ backgroundColor: Colors.light.background }}
                screenOptions={{
                    tabBarStyle: {
                        backgroundColor: Colors.light.green,
                        shadowColor: '#000',
                        shadowOpacity: 0.25
                    },
                    tabBarInactiveTintColor: Colors.light.beige,
                    tabBarActiveTintColor: Colors.light.beige,
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
                        headerStatusBarHeight: 0,
                        // headerTitle: `Welcome ${ userSession?.firstName }`,
                        tabBarIcon: ({ color, focused }) => (
                            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
                        )
                    }
                    }
                />
                <Tabs.Screen
                    name="CalendarScreen"
                    options={{
                        title: '',
                        headerStatusBarHeight:15,
                        tabBarIcon: ({ color, focused }) => (
                            <TabBarIcon name={focused ? 'calendar' : 'calendar-outline'} color={color} />
                        )
                    }}
                />
            </Tabs>
        </GluestackUIProvider>
    );
}
