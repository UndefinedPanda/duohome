import {FlatList, KeyboardAvoidingView, StyleSheet, View} from "react-native"
import {Card} from "@/components/ui/card"
import {Heading} from "@/components/ui/heading"
import {ThemedText} from "@/components/ThemedText"
import {supabase} from "@/lib/Supabase"
import {useEffect, useState} from "react"
import {VStack} from "@/components/ui/vstack"
import {useStorageState} from "@/app/UseStorageState"
import {Input, InputField} from "@/components/ui/input"
import GreenButton from "@/components/custom/buttons/GreenButton";


export default function MessagesScreen() {

    const [[isLoading, session], setSession] = useStorageState('session')

    const [messages, setMessages] = useState<any[]>();
    const [content, setContent] = useState<string>();

    useEffect(() => {
        const channel = supabase
            .channel('messages')
            .on('postgres_changes', {event: '*', schema: 'public', table: 'messages'}, (payload) => {
                console.log(messages)
                setMessages((prevMessages) => [...(prevMessages || []), payload.new]);
            })
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, []);

    const sendMessage = async () => {

    }

    return (
        <KeyboardAvoidingView style={styles.container}>
            <FlatList
                style={styles.messages}
                data={messages}
                keyExtractor={(item) => item ? item.id : ''}
                renderItem={({item}) => <Card size="md" variant="elevated" className="m-3">
                    <Heading size="md" className="mb-1">
                        From User
                    </Heading>
                    <ThemedText>{item ? item.content : ''}</ThemedText>
                </Card>}
            />
            <VStack style={styles.bottomView}>
                <Input
                    style={styles.inputField}
                    variant="outline"
                    size="md"
                    isDisabled={false}
                    isInvalid={false}
                    isReadOnly={false}
                >
                    <InputField onBlur={(e: any) => {
                        e.target.focus()
                    }} autoFocus placeholder="Enter Text here..." value={content}
                                onChangeText={setContent}/>
                </Input>
                <GreenButton text="Send" onPress={sendMessage}/>
            </VStack>
            <View style={{flex: 1}}/>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        flex: 1,
        justifyContent: 'space-between',
    },
    messages: {
        height: 10,
        backgroundColor: "#dcdcdc",
        margin: 5,
    },
    card: {
        shadowColor: '#151515',
        shadowOpacity: 0.15,
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 2
    },
    bottomView: {
        marginBottom: 20,
        marginLeft: 15,
        bottom: 0,
        width: '90%',
        height: 50, // Adjust the height as needed
    },
    inputField: {
        marginBottom: 10,
    }
})

