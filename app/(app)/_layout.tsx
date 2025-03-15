import { Text } from 'react-native'
import { Redirect, Stack } from 'expo-router'
import { useColorScheme } from '@/hooks/useColorScheme'
import { SessionProvider, useSession } from '../AuthContext'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider'
import { Colors } from '@/constants/Colors'

export default function AppLayout() {
    const { session, isLoading } = useSession()
    const colorScheme = useColorScheme()

    // You can keep the splash screen open, or render a loading screen like we do here.
    if (isLoading) {
        return <Text>Loading...</Text>
    }

    // Only require authentication within the (app) group's layout as users
    // need to be able to access the (auth) group and sign in again.
    if (!session) {
        // On web, static rendering will stop here as the user is not authenticated
        // in the headless Node process that the pages are rendered in.
        // @ts-ignore
        return <Redirect href="/Login" />
    }

    // This layout can be deferred because it's not the root layout.
    return (
        <GluestackUIProvider>
            <SessionProvider>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{
                        headerShown: false, headerTitle: 'Home',
                        contentStyle: {
                            backgroundColor: '#fff'
                        },
                    }} />
                    <Stack.Screen name="screens/CreateFamilyScreen" options={{
                        headerShown: true,
                        headerTitle: 'Create Your Family',
                        headerTintColor: '#fff',
                        headerBackTitle: 'Back',
                        headerStyle: {
                            backgroundColor: Colors.light.green
                        },
                        contentStyle: {
                            backgroundColor: '#fff'
                        },
                    }} />
                    <Stack.Screen name="screens/ViewFamilyScreen" options={{
                        contentStyle: {
                            backgroundColor: '#fff'
                        },
                        headerTintColor: '#fff',
                        headerBackTitle: 'Back',
                        headerShown: true,
                        headerTitle: 'Manage Your Family',
                        headerStyle: {
                            backgroundColor: Colors.light.green
                        }
                    }} />

                    <Stack.Screen name="screens/CreateEventScreen" options={{
                        headerShown: true,
                        headerTitle: 'Create Your Event',
                        headerTintColor: '#fff',
                        headerBackTitle: 'Back',
                        headerStyle: {
                            backgroundColor: Colors.light.green
                        },
                        contentStyle: {
                            backgroundColor: '#fff'
                        },
                    }} />
                     <Stack.Screen name="screens/EditEventScreen" options={{
                        headerShown: true,
                        headerTitle: 'Edit Selected Event',
                        headerTintColor: '#fff',
                        headerBackTitle: 'Back',
                        headerStyle: {
                            backgroundColor: Colors.light.green
                        },
                        contentStyle: {
                            backgroundColor: '#fff'
                        },
                    }} />
                    <Stack.Screen name="screens/NotificationsScreen" options={{
                        headerShown: true,
                        headerTitle: 'Notifications',
                        headerTintColor: '#fff',
                        headerBackTitle: 'Back',
                        headerStyle: {
                            backgroundColor: Colors.light.green
                        },
                        contentStyle: {
                            backgroundColor: '#fff'
                        },
                    }} />
                </Stack>
            </SessionProvider>
        </GluestackUIProvider>
    )
}
