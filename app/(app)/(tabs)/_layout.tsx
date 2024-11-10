import { Tabs, router } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider'
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { UserSession, useSession } from '@/app/AuthContext';

export default function TabLayout() {
    const {session} = useSession();
    const userSession: UserSession = session ? JSON.parse(session) : undefined;

    return (
        <GluestackUIProvider>
            <Tabs
                sceneContainerStyle={ {backgroundColor: Colors.light.background} }
                screenOptions={ {
                    tabBarStyle: {
                        backgroundColor: '#eae0c9',
                        shadowColor: '#000',
                        shadowOpacity: 0.25
                    },
                    tabBarActiveTintColor: Colors.light.green,
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: Colors.light.beige,
                        shadowColor: '#000',
                        shadowOpacity: 0.25,
                        shadowRadius: 3
                    }
                } }>
                <Tabs.Screen
                    name="index"
                    options={ {
                        title: 'Home',
                        headerTitle: `Welcome ${ userSession?.firstName }`,
                        tabBarIcon: ({color, focused}) => (
                            <TabBarIcon name={ focused ? 'home' : 'home-outline' } color={ color }/>
                        )
                    }
                    }
                />
                {/*<Tabs.Screen*/ }
                {/*    name="agenda"*/ }
                {/*    options={{*/ }
                {/*        title: 'Agenda',*/ }
                {/*        tabBarIcon: ({color, focused}) => (*/ }
                {/*            <TabBarIcon name={focused ? 'list' : 'list-outline'} color={color}/>*/ }
                {/*        )*/ }
                {/*    }}*/ }
                {/*/>*/ }
                <Tabs.Screen
                    name="CalendarScreen"
                    options={ {
                        title: 'Calendar',
                        tabBarIcon: ({color, focused}) => (
                            <TabBarIcon name={ focused ? 'calendar' : 'calendar-outline' } color={ color }/>
                        )
                    } }
                />
            </Tabs>
        </GluestackUIProvider>
    );
}
