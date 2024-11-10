import { Text } from 'react-native'
import { Redirect, Stack } from 'expo-router'
import { useColorScheme } from '@/hooks/useColorScheme'
import { SessionProvider, useSession } from '../AuthContext'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider'
import { Colors } from '@/constants/Colors';

export default function AppLayout() {
    const {session, isLoading} = useSession()
    const colorScheme = useColorScheme()

    // You can keep the splash screen open, or render a loading screen like we do here.
    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    // Only require authentication within the (app) group's layout as users
    // need to be able to access the (auth) group and sign in again.
    if (!session) {
        // On web, static rendering will stop here as the user is not authenticated
        // in the headless Node process that the pages are rendered in.
        // @ts-ignore
        return <Redirect href="/Login"/>
    }

    // This layout can be deferred because it's not the root layout.
    return (
        <GluestackUIProvider mode="light">
            <SessionProvider>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{
                        headerShown: false, headerTitle: 'Home'
                    }}/>
                    <Stack.Screen name="CreateFamilyScreen" options={{
                        headerShown: true,
                        headerTitle: 'Create Your Family',
                        headerStyle: {
                            backgroundColor: Colors.light.beige
                        }
                    }}/>
                </Stack>
            </SessionProvider>
        </GluestackUIProvider>
    )
}
