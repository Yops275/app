import { useState } from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { AuthService } from '../services/auth';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('demo@packagematch.com');
    const [password, setPassword] = useState('password123');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please enter email and password');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await AuthService.login(email, password);
            router.replace('/dashboard');
        } catch (err) {
            console.error(err);
            setError('Login failed. Please check backend connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
                <View style={styles.header}>
                    <Text variant="displaySmall" style={styles.title}>PackageMatch</Text>
                    <Text variant="bodyLarge" style={styles.subtitle}>Mobile Workforce App</Text>
                </View>

                <Surface style={styles.card} elevation={2}>
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        style={styles.input}
                        mode="outlined"
                    />
                    <TextInput
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={styles.input}
                        mode="outlined"
                    />

                    {error ? <Text style={styles.error}>{error}</Text> : null}

                    <Button
                        mode="contained"
                        onPress={handleLogin}
                        loading={loading}
                        style={styles.button}
                        contentStyle={{ paddingVertical: 8 }}
                    >
                        Login
                    </Button>
                </Surface>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
        justifyContent: 'center',
        padding: 20,
    },
    content: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        color: '#fff',
        fontWeight: 'bold',
    },
    subtitle: {
        color: '#94a3b8',
        marginTop: 8,
    },
    card: {
        padding: 24,
        borderRadius: 12,
        backgroundColor: '#1e293b',
    },
    input: {
        marginBottom: 16,
        backgroundColor: '#0f172a',
    },
    button: {
        marginTop: 8,
        backgroundColor: '#6366f1',
    },
    error: {
        color: '#ef4444',
        marginBottom: 16,
        textAlign: 'center',
    }
});
