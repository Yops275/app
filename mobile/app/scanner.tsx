import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ProductService } from '../services/product';

export default function ScannerScreen() {
    const router = useRouter();
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
        if (scanned || loading) return;

        setScanned(true);
        setLoading(true);

        try {
            // alert(`Scanned: ${data}`); // Debugging
            const product = await ProductService.getProductByBarcode(data);

            if (product) {
                router.push(`/product/${product.id}`);
            } else {
                alert(`Product not found for barcode: ${data}`);
                // Reset scan after short delay
                setTimeout(() => setScanned(false), 2000);
            }
        } catch (error) {
            alert('Failed to lookup product');
            setScanned(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing={facing}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr", "ean13", "ean8", "upc_e", "code128"],
                }}
            >
                <View style={styles.overlay}>
                    <View style={styles.scanArea} />
                    <Text style={styles.scanText}>Align code within frame</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => router.back()}>
                        <Ionicons name="close-circle" size={48} color="white" />
                    </TouchableOpacity>
                </View>

                {loading && (
                    <View style={styles.loadingOverlay}>
                        <Text style={styles.loadingText}>Searching...</Text>
                    </View>
                )}
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#000',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
        color: 'white'
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        alignSelf: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanArea: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: '#00ff00',
        backgroundColor: 'transparent',
        borderRadius: 16,
    },
    scanText: {
        color: 'white',
        marginTop: 20,
        fontSize: 16,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 8,
        borderRadius: 4,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
