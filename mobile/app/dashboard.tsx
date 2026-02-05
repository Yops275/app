import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { Text, Card, Button, Avatar, List, FAB, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { OrderService, Order } from '../services/order';
import { AuthService } from '../services/auth';

export default function Dashboard() {
    const router = useRouter();
    const theme = useTheme();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [stats, setStats] = useState({ count: 0, revenue: 0 });

    const loadData = async () => {
        try {
            const data = await OrderService.getAllOrders();
            setOrders(data);

            // Calculate stats
            const revenue = data
                .filter(o => ['paid', 'shipped', 'delivered'].includes(o.status))
                .reduce((sum, o) => sum + Number(o.total_amount), 0);

            setStats({
                count: data.length,
                revenue
            });

        } catch (error) {
            console.error('Failed to load dashboard data', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadData();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return '#10b981';
            case 'shipped': return '#3b82f6';
            case 'delivered': return '#8b5cf6';
            case 'pending': return '#facc15';
            case 'cancelled': return '#ef4444';
            default: return '#94a3b8';
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="white" />
                }
            >
                <View style={styles.welcomeSection}>
                    <Text variant="headlineMedium" style={{ color: 'white', fontWeight: 'bold' }}>Hello, Admin</Text>
                    <Text variant="bodyLarge" style={{ color: '#94a3b8' }}>Here's what's happening today.</Text>
                </View>

                <View style={styles.statsContainer}>
                    <Card style={[styles.statCard, { backgroundColor: '#1e293b' }]}>
                        <Card.Content>
                            <Text variant="titleMedium" style={{ color: '#94a3b8' }}>Total Orders</Text>
                            <Text variant="headlineLarge" style={{ color: '#6366f1', fontWeight: 'bold' }}>
                                {loading ? '-' : stats.count}
                            </Text>
                        </Card.Content>
                    </Card>
                    <Card style={[styles.statCard, { backgroundColor: '#1e293b' }]}>
                        <Card.Content>
                            <Text variant="titleMedium" style={{ color: '#94a3b8' }}>Revenue</Text>
                            <Text variant="headlineLarge" style={{ color: '#10b981', fontWeight: 'bold' }}>
                                {loading ? '-' : `$${stats.revenue.toFixed(0)}`}
                            </Text>
                        </Card.Content>
                    </Card>
                </View>

                <Text variant="titleLarge" style={styles.sectionTitle}>Recent Orders</Text>

                <List.Section style={{ backgroundColor: '#1e293b', borderRadius: 12 }}>
                    {loading ? (
                        <List.Item title="Loading..." left={() => <ActivityIndicator color="white" />} />
                    ) : orders.length === 0 ? (
                        <List.Item title="No orders found" titleStyle={{ color: '#94a3b8' }} />
                    ) : (
                        orders.slice(0, 5).map(order => (
                            <List.Item
                                key={order.id}
                                title={`Order #${order.id}`}
                                description={`${order.customer_name || 'Guest'} • $${Number(order.total_amount).toFixed(2)}`}
                                left={props => <Avatar.Icon {...props} icon="package-variant" style={{ backgroundColor: '#334155' }} />}
                                right={props => (
                                    <Text {...props} style={{ color: getStatusColor(order.status), alignSelf: 'center', fontWeight: 'bold' }}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </Text>
                                )}
                                titleStyle={{ color: 'white' }}
                                descriptionStyle={{ color: '#94a3b8' }}
                            />
                        ))
                    )}
                </List.Section>

                <Button
                    mode="outlined"
                    onPress={async () => {
                        await AuthService.logout();
                        router.replace('/');
                    }}
                    style={{ marginTop: 24, borderColor: '#ef4444' }}
                    textColor="#ef4444"
                >
                    Logout
                </Button>
            </ScrollView>

            <FAB
                icon="barcode-scan"
                label="Scan"
                style={styles.fab}
                onPress={() => router.push('/scanner')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    welcomeSection: {
        marginBottom: 24,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
    statCard: {
        flex: 1,
    },
    sectionTitle: {
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 16,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#6366f1',
    },
});
