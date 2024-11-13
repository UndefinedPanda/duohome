import { UserSession, useSession } from '../AuthContext';
import { VStack } from '@/components/ui/vstack';
import {
    FormControl, FormControlError, FormControlErrorText,
    FormControlLabel,
    FormControlLabelText
} from '@/components/ui/form-control'
import React, { useEffect, useState } from 'react'
import { Input, InputField } from '@/components/ui/input'
import { Button, ButtonGroup, ButtonText } from '@/components/ui/button'
import { Center } from '@/components/ui/center'
import { Alert, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { ThemedText } from '@/components/ThemedText'
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { supabase } from '@/lib/Supabase';
import { useStorageState } from '@/app/UseStorageState';
import ViewFamilyChild from '@/components/ScreenHelpers/ViewFamilyChild';
import { Spinner } from '@/components/ui/spinner';

interface Child {
    name: string,
    birthday: string,
}

export default function CreateFamilyScreen() {

    const ERROR_MESSAGE_TIMEOUT = 5000;

    const { login } = useSession();

    const [errorMessage, setErrorMessage] = useState('');
    const [isInvalid, setIsInvalid] = useState(false);

    const [familyName, setFamilyName] = useState('');
    const [childName, setChildName] = useState('');
    const [childCreated, setChildCreated] = useState(false);
    const [childBirthday, setChildBirthday] = useState(new Date(1980, 1, 1));
    const [children, setChildren] = useState<Child[]>([]);
    const [parentType, setParentType] = useState('')

    const [show, setShow] = useState(false);

    const [isLoadingFamily, setIsLoadingFamily] = useState(true);

    const [[isLoading, session], setSession] = useStorageState('session');
    const userSession = session ? JSON.parse(session) : {}

    useEffect(() => {
        setTimeout(() => setIsInvalid(false), ERROR_MESSAGE_TIMEOUT);

        if (!isLoading) {
            getFamilyFromDatabase().then(() => setIsLoadingFamily(false));
        }


    }, [isInvalid, session]);

    const getFamilyFromDatabase = async () => {
        const { data: family, error } = await supabase.from('families').select('name,id').eq('id', userSession.familyId).limit(1).single();
        if (error) {
            console.error(error)
        }

        if (family) setFamilyName(family.name);

        const { data: childrenData, error: childrenError } = await supabase.from('children').select('name,birthday').eq('family_id', family?.id)
        if (childrenData) setChildren(childrenData);

    }

    const onChange = (event: any, selectedDate: any) => {
        const currentDate = new Date(selectedDate);
        setShow(false);
        setChildBirthday(currentDate);
        console.log(currentDate)
    };

    const onFamilyNameChange = (name: string) => {
        setFamilyName(name);
    }


    return (

        <KeyboardAwareScrollView>
            <Center style={styles.container}>
                <VStack className="w-full p-4">
                    <Center>
                        <ThemedText style={styles.errorMessage}>{errorMessage}</ThemedText>
                    </Center>



                    <FormControl className="py-4"
                        isInvalid={isInvalid}
                        size="lg"
                        isDisabled={false}
                        isReadOnly={false}
                        isRequired={false}
                    >
                        <FormControlLabel>
                            <FormControlLabelText>Family Name</FormControlLabelText>
                        </FormControlLabel>
                        <Input className="my-1 border-black" size="xl">
                            <InputField
                                type="text"
                                value={familyName}
                                onChangeText={(name) => onFamilyNameChange(name)}
                            />
                        </Input>
                        <FormControlError>
                            {/*<FormControlErrorIcon as={AlertCircleIcon}/>*/}
                            <FormControlErrorText>
                                A Family Name Is Required
                            </FormControlErrorText>
                        </FormControlError>
                    </FormControl>
                    {isLoadingFamily ?
                        <Spinner size="large" color={Colors.light.green} />
                        :
                        children.map((child) => (<ViewFamilyChild key={child.name} name={child.name} birthday={child.birthday} />))}

                </VStack>
            </Center>
        </KeyboardAwareScrollView>
    );

}

const styles = StyleSheet.create({
    container: {
        paddingLeft:
            10,
        paddingRight:
            10
    },
    addChildButton: {
        backgroundColor: Colors.light.blue
    },
    createFamilyButton: {
        marginTop: 100,
        backgroundColor: Colors.light.green
    },
    createFamilyButtonError: {
        backgroundColor: Colors.light.errorRed
    },
    selectContent: {
        paddingBottom: 400
    },
    selectItem: {
        fontSize: 100
    },
    image: {
        marginBottom: 50
    },
    errorMessage: {
        color: '#ff0000'
    },
    datePicker: {
        marginTop: 3,
        marginLeft: -15
    }
});

