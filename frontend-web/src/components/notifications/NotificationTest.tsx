import { useState, useEffect } from 'react';
import { requestNotificationPermission, onMessageListener } from '../../services/firebase';
import { Bell } from 'lucide-react';
import axios from 'axios';

const NotificationTest = () => {
    const [token, setToken] = useState<string | null>(null);
    const [notification, setNotification] = useState<{ title: string; body: string } | null>(null);

    useEffect(() => {
        // Listen for incoming messages
        onMessageListener().then((payload: any) => {
            setNotification({
                title: payload.notification.title,
                body: payload.notification.body
            });
            // Clear notification after 5 seconds
            setTimeout(() => setNotification(null), 5000);
        });
    }, []);

    const handleEnableNotifications = async () => {
        const fcmToken = await requestNotificationPermission();
        if (fcmToken) {
            setToken(fcmToken);
            alert('Notifications enabled! Token logged to console.');
        }
    };

    const handleSendTest = async () => {
        if (!token) return;
        try {
            await axios.post('http://localhost:4000/api/notifications/send', {
                token,
                title: 'Test Notification',
                body: 'This is a test message from PackageMatch!'
            });
        } catch (error) {
            console.error('Failed to send test notification', error);
        }
    };

    return (
        <>
            <div className="notification-panel">
                <h3 className="notification-header">
                    <Bell size={16} /> Notification System (Demo)
                </h3>

                {!token ? (
                    <button onClick={handleEnableNotifications} className="btn-primary notification-btn">
                        Enable Notifications
                    </button>
                ) : (
                    <div className="notification-active">
                        <span className="status-active">Active</span>
                        <button onClick={handleSendTest} className="btn-small">
                            Trigger Test
                        </button>
                    </div>
                )}
            </div>

            {notification && (
                <div className="notification-toast">
                    <strong className="toast-title">{notification.title}</strong>
                    <p className="toast-body">{notification.body}</p>
                </div>
            )}
        </>
    );
};

export default NotificationTest;
