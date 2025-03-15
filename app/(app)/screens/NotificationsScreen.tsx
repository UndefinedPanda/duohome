import { Alert, StyleSheet } from "react-native"
import { ThemedView } from "@/components/ThemedView"
import { Card } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"
import { ThemedText } from "@/components/ThemedText"
import { supabase } from "@/lib/Supabase"
import { useEffect, useState } from "react"
import { ButtonGroup } from "@/components/ui/button"
import BlueButton from "@/components/custom/buttons/BlueButton"
import { HStack } from "@/components/ui/hstack"
import { VStack } from "@/components/ui/vstack"
import { Grid, GridItem } from "@/components/ui/grid"
import RedButton from "@/components/custom/buttons/RedButton"
import { FamilyInvite, UserSession } from "@/types"
import { useStorageState } from "@/app/UseStorageState"


export default function NotificationsScreen() {

    const [familyInvites, setFamilyInvites] = useState<FamilyInvite[]>([])
    const [[isLoading, session], setSession] = useStorageState('session')

    useEffect(() => {
        checkFamilyInvites().then((data) => setFamilyInvites(data ? data : []))
    }, [])


    const checkFamilyInvites = async () => {
        const userEmail = (await supabase.auth.getUser()).data.user?.email

        const {
            data,
            error
        } = await supabase.from('family_invite').select('*, families (name)').eq('invited_parent_email', userEmail).eq('accepted', false).eq('declined', false).limit(1)

        if (error) {
            console.error(error.message)
            return
        }

        if (!data) return
        return data
    }

    const handleDeclineInvite = async () => {
        const userEmail = (await supabase.auth.getUser()).data.user?.email

        const {
            data,
            error
        } = await supabase.from('family_invite').update({ declined: true }).eq('invited_parent_email', userEmail).select()

        if (error) {
            console.log(error.message)
            Alert.alert('There was an error declining this invite. Please try again')
            return
        }
        if (!data) return

        Alert.alert('You have declined this invite')
        setFamilyInvites([])
    }

    const handleAcceptInvite = async () => {
        const userEmail = (await supabase.auth.getUser()).data.user?.email
        const userId = (await supabase.auth.getUser()).data.user?.id

        const {
            data,
            error
        } = await supabase.from('family_invite').update({ accepted: true }).eq('invited_parent_email', userEmail).select()

        if (error) {
            console.log(error.message)
            Alert.alert('There was an error accepting this invite. Please try again')
            return
        }
        if (!data) return

        const deletedFamilyParent = await supabase.from('family_parent').delete().eq('parent_id', userId)

        if (deletedFamilyParent.error) {
            console.error(deletedFamilyParent.error);
            Alert.alert('There was an error. Please try again.')
            return
        }

        const addedParent = await supabase.from('family_parent').insert([{
            family_id: data[0].family_id,
            parent_id: data[0].invited_parent,
            coparent: true,
        }]).select();

        if (addedParent.error) {
            console.error(addedParent.error.message)
            Alert.alert('There was an error adding this user to the family. Please try again.')
            return
        }
        const oldSession: UserSession = JSON.parse(session ? session : '')

        const newSession = {
            userId: oldSession.userId,
            firstName: oldSession.firstName,
            familyId: data[0]?.family_id
        }
        setSession(JSON.stringify(newSession))

        Alert.alert('You have accepted this invite')
        setFamilyInvites([])
    }

    return (
        <ThemedView style={styles.container}>
            {familyInvites.length > 0 ? (
                <Card style={styles.card} size="md" variant="elevated" className="m-3">
                    <Heading size="xl" className="mb-1">
                        New Family Invite
                    </Heading>
                    <ThemedText>You've been invited to join
                        the {familyInvites[0].families?.name ? familyInvites[0].families.name : ''}</ThemedText>
                    <Grid
                        className="gap-5"
                        _extra={{
                            className: "grid-cols-12"
                        }}>
                        <GridItem _extra={{
                            className: "col-span-6"
                        }}>
                            <ButtonGroup className='my-3 mt-3'>
                                <BlueButton text='Accept' onPress={handleAcceptInvite} />
                            </ButtonGroup>
                        </GridItem>
                        <GridItem _extra={{
                            className: "col-span-6"
                        }}>
                            <ButtonGroup className='my-3 mt-3'>
                                <RedButton text='Decline' onPress={handleDeclineInvite} />
                            </ButtonGroup>
                        </GridItem>
                    </Grid>
                </Card>
            ) : ''}
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    card: {
        shadowColor: '#151515',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 2
    }
})

