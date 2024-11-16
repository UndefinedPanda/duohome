/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const PRIMARY_RED = "#a63d40"

const tintColorLight = PRIMARY_RED;
const tintColorDark = '#fff';

export const Colors = {
    light: {
        text: '#0a0908',
        background: '#fff',
        red: '#a63d40',
        blue: '#37718e',
        errorRed: '#c33c54',
        green: '#5B905B',
        darkGreen: '#3f653f',
        buttonColor: PRIMARY_RED,
        tint: tintColorLight,
        icon: '#687076',
        tabIconDefault: '#0a0908',
        tabIconSelected: tintColorLight
    },
    dark: {
        text: '#ECEDEE',
        background: '#fff',
        tint: tintColorDark,
        icon: '#9BA1A6',
        tabIconDefault: '#9BA1A6',
        tabIconSelected: tintColorDark,
        black: '#0A0908'
    }
};
