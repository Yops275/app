import { Stack } from 'expo-router';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

const theme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: '#6366f1',
        secondary: '#10b981',
        background: '#0f172a',
        surface: '#1e293b',
    },
};

export default function RootLayout() {
    return (
        <PaperProvider theme={theme}>
            <StatusBar style="light" />
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#0f172a',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    contentStyle: {
                        backgroundColor: '#0f172a',
                    },
                }}
            >
                <Stack.Screen name="index" options={{ title: 'Login', headerShown: false }} />
                <Stack.Screen name="dashboard" options={{ title: 'Dashboard', headerBackVisible: false }} />
            </Stack>
        </PaperProvider>
    );
}
