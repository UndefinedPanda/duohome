import { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from './UseStorageState';
import { router } from 'expo-router'
import { supabase } from '@/lib/Supabase';

interface RegisterError {
    error: boolean;
    message: string;
}

const AuthContext = createContext<{
    register: (email: string, firstName: string, lastName: string, password: string) => any;
    login: (email: string, password: string) => any;
    logOut: () => void;
    session?: string | null;
    isLoading: boolean;
}>({
    register: async (email: string, firstName: string, lastName: string, password: string) => null,
    login: async (email: string, password: string) => null,
    logOut: () => null,
    session: null,
    isLoading: false
});

// This hook can be used to access the user info.
export function useSession() {
    const value = useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSession must be wrapped in a <SessionProvider />');
        }
    }

    return value;
}

const registerUser = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
        console.log(error.message);
        return { registered: false, errorMessage: error.message };
    }
    return { registered: true, errorMessage: '' };
}

const loginUser = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        console.log(error.message);
        return { loggedIn: false, errorMessage: error.message };
    }
    return { data, loggedIn: true, errorMessage: '' };
}

export function SessionProvider({ children }: PropsWithChildren) {
    const [[isLoading, session], setSession] = useStorageState('session');

    return (
        <AuthContext.Provider
            value={{
                register: async (email, firstName, lastName, password) => {
                    const { registered, errorMessage } = await registerUser(email, password);

                    if (!registered) {
                        return {
                            registered,
                            errorMessage
                        }
                    }

                    const { data, error } = await supabase.from('parents').insert([{
                        email, first_name: firstName, last_name: lastName
                    }]).select();

                    if (error) {
                        return {
                            registered: true,
                            errorMessage: error.message
                        }
                    }
                    setSession(data[0].id)
                    return {
                        registered: true,
                        errorMessage: ''
                    }
                },
                login: async (email: string, password: string) => {
                    const { data, loggedIn, errorMessage } = await loginUser(email, password);
                    if (!loggedIn) return { loggedIn, errorMessage }
                    if (!data) return { loggedIn: false, errorMessage: 'There was an error logging you in. Try again later.' }
                    setSession(data.user.id)
                    return { loggedIn, errorMessage: '' }
                },
                logOut: () => {
                    setSession(null);
                    router.replace('/Login')
                },
                session,
                isLoading
            }}>
            {children}
        </AuthContext.Provider>
    );
}
