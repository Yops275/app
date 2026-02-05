import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Button, Card, ActivityIndicator, HelperText, Appbar } from 'react-native-paper';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Product, ProductService } from '../../services/product';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ProductDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        try {
            if (typeof id === 'string') {
                const data = await ProductService.getProductById(id);
                setProduct(data);
            }
        } catch (err) {
            setError('Failed to load product details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#6366f1" />
            </View>
        );
    }

    if (error || !product) {
        return (
            <View style={styles.centerContainer}>
                <MaterialCommunityIcons name="alert-circle" size={48} color="#ef4444" />
                <Text variant="titleMedium" style={styles.errorText}>{error || 'Product not found'}</Text>
                <Button mode="contained" onPress={() => router.back()} style={styles.backButton}>
                    Go Back
                </Button>
            </View>
        );
    }

    return (
        <>
            <Stack.Screen options={{ title: 'Product Details', headerBackTitle: 'Back' }} />
            <ScrollView style={styles.container}>
                {product.image_url && (
                    <Image source={{ uri: product.image_url }} style={styles.image} resizeMode="cover" />
                )}

                <View style={styles.content}>
                    <Text variant="headlineMedium" style={styles.title}>{product.name}</Text>
                    <Text variant="titleMedium" style={styles.price}>${product.price ? product.price.toFixed(2) : '0.00'}</Text>

                    <View style={styles.badges}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{product.category}</Text>
                        </View>
                        {product.stock > 0 ? (
                            <View style={[styles.badge, styles.stockBadge]}>
                                <Text style={styles.badgeText}>In Stock: {product.stock}</Text>
                            </View>
                        ) : (
                            <View style={[styles.badge, styles.outOfStockBadge]}>
                                <Text style={styles.badgeText}>Out of Stock</Text>
                            </View>
                        )}
                    </View>

                    <Card style={styles.detailsCard}>
                        <Card.Content>
                            <Text variant="titleMedium" style={styles.sectionTitle}>Description</Text>
                            <Text style={styles.description}>{product.description}</Text>

                            <View style={styles.divider} />

                            <Text variant="titleMedium" style={styles.sectionTitle}>Details</Text>
                            <View style={styles.row}>
                                <Text style={styles.label}>SKU:</Text>
                                <Text style={styles.value}>{product.sku}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Barcode:</Text>
                                <Text style={styles.value}>{product.barcode || 'N/A'}</Text>
                            </View>
                            {product.dimensions && (
                                <View style={styles.row}>
                                    <Text style={styles.label}>Dimensions:</Text>
                                    <Text style={styles.value}>
                                        {product.dimensions.length} x {product.dimensions.width} x {product.dimensions.height} cm
                                    </Text>
                                </View>
                            )}
                        </Card.Content>
                    </Card>

                    <View style={styles.actions}>
                        <Button
                            mode="contained"
                            icon="calculator"
                            onPress={() => alert('Add to calculation - Coming Soon')}
                            style={styles.actionButton}
                        >
                            Add to Calculation
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0f172a',
        padding: 20,
    },
    image: {
        width: '100%',
        height: 250,
        backgroundColor: '#1e293b',
    },
    content: {
        padding: 20,
    },
    title: {
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    price: {
        color: '#10b981',
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: 16,
    },
    badges: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 24,
    },
    badge: {
        backgroundColor: '#334155',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    stockBadge: {
        backgroundColor: '#059669',
    },
    outOfStockBadge: {
        backgroundColor: '#ef4444',
    },
    badgeText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 12,
    },
    detailsCard: {
        backgroundColor: '#1e293b',
        borderRadius: 12,
        marginBottom: 24,
    },
    sectionTitle: {
        color: 'white',
        fontWeight: '600',
        marginBottom: 8,
    },
    description: {
        color: '#94a3b8',
        lineHeight: 22,
        marginBottom: 16,
    },
    divider: {
        height: 1,
        backgroundColor: '#334155',
        marginVertical: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    label: {
        color: '#64748b',
    },
    value: {
        color: 'white',
        fontWeight: '500',
    },
    actions: {
        gap: 12,
        marginBottom: 32,
    },
    actionButton: {
        backgroundColor: '#6366f1',
        paddingVertical: 6,
    },
    errorText: {
        color: 'white',
        marginTop: 16,
        marginBottom: 24,
    },
    backButton: {
        backgroundColor: '#334155',
    }
});
