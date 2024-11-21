import React from 'react'
import { Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native'
import { Colors } from '@/constants/Colors'

export default function Button(props: any) {
    const {onPress, text} = props
    return (
        <TouchableOpacity style={ styles.button } onPress={ onPress }>
            <Text style={ styles.text }>{ text }</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: Colors.light.green
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white'
    }
})
