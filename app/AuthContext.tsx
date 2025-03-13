import { useContext, createContext, type PropsWithChildren, useEffect } from 'react'
import { useStorageState } from './UseStorageState'
import { router } from 'expo-router'
import { supabase } from '@/lib/Supabase'
import { UserSession } from '@/types'

// TODO: CLEAN UP THIS FILE -
// TODO: CREATE ERROR TYPE AND RETURN THAT INSTEAD OF SHIT
// TODO: REMOVE ALL FUNCTIONALITY FROM THE AUTH CONTEXT REGISTER AND LOGIN FUNCTIONS TO THEIR OWN SEPARATE METHOD FUNCTIONS


const AuthContext = createContext<{
    register: (email: string, firstName: string, lastName: string, password: string) => any
    login: (email: string, password: string) => any
    logOut: () => void
    session?: string | undefined | null
    setUserSession?: (oldSession: UserSession) => void
    isLoading: boolean
}>({
    register: async (email: string, firstName: string, lastName: string, password: string) => null,
    login: async (email: string, password: string) => null,
    logOut: () => null,
    session: null,
    setUserSession: () => null,
    isLoading: false
})

// This hook can be used to access the user info.
export function useSession() {
    const value = useContext(AuthContext)
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSession must be wrapped in a <SessionProvider />')
        }
    }

    return value
}

export function SessionProvider({ children }: PropsWithChildren) {

    const [[isLoading, session], setSession] = useStorageState('session')

    useEffect(() => {
    }, [session])


    const registerUser = async (email: string, password: string, firstName: string) => {
        const { error } = await supabase.auth.signUp({
            email, password, options: {
                data: {
                    first_name: firstName
                }
            }
        })

        if (error) {
            console.log(error.message)
            return { registered: false, errorMessage: error.message }
        }

        return { registered: true, errorMessage: '' }
    }

    const loginUser = async (email: string, password: string) => {
        const { data: { user }, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            console.log(error.message)
            return { loggedIn: false, errorMessage: error.message }
        }

        const userInformation = await getUserInformation(user)

        if (userInformation.error) {
            console.log(userInformation.errorMessage)
            return { loggedIn: false, errorMessage: userInformation.errorMessage }
        }

        return { user, loggedIn: true, errorMessage: '' }
    }

    const getUserInformation = async (user: any) => {
        // get family
        const {
            data: family_parent,
            error
        } = await supabase.from('family_parent').select('*').eq('parent_id', user.id).limit(1)

        if (error) {
            return {
                error: true,
                errorMessage: error.message
            }
        }

        // TODO: Get User Preferences

        // Create the session
        const userSession: UserSession = {
            userId: user.id,
            firstName: user.user_metadata.first_name,
            familyId: family_parent[0]?.family_id
        }

        const sessionString = JSON.stringify(userSession)
        setSession(sessionString)
        return {
            error: false,
            errorMessage: ''
        }
    }

    return (
        <AuthContext.Provider
            value={{
                register: async (email, firstName, lastName, password) => {

                    const lowerCaseEmail = email.toLowerCase()

                    const { registered, errorMessage } = await registerUser(lowerCaseEmail, password, firstName)

                    if (!registered) {
                        return {
                            registered,
                            errorMessage
                        }
                    }

                    const { data, error } = await supabase.from('parents').insert([{
                        email: lowerCaseEmail, first_name: firstName, last_name: lastName
                    }]).select().limit(1).single()

                    if (error) {
                        return {
                            registered: true,
                            errorMessage: error.message
                        }
                    }

                    // Create the session
                    const userSession: UserSession = {
                        userId: data.id,
                        firstName
                    }

                    const sessionString = JSON.stringify(userSession)
                    setSession(sessionString)

                    return {
                        registered: true,
                        errorMessage: ''
                    }
                },
                login: async (email: string, password: string) => {
                    const { user, loggedIn, errorMessage } = await loginUser(email, password)
                    if (!loggedIn) return { loggedIn, errorMessage }
                    if (!user) return {
                        loggedIn: false,
                        errorMessage: 'There was an error logging you in. Try again later.'
                    }

                    return { loggedIn, errorMessage: '' }
                },
                logOut: () => {
                    setSession(null)
                    router.replace('/Login')
                },
                session,
                isLoading
            }}>
            {children}
        </AuthContext.Provider>
    )
}
