import { Request, Response, Router } from 'express';
import { sendNotification } from '../services/notificationService';

const router = Router();

router.post('/send', async (req: Request, res: Response) => {
    const { token, title, body } = req.body;

    if (!token || !title || !body) {
        return res.status(400).json({ message: 'Missing token, title, or body' });
    }

    const success = await sendNotification(token, title, body);

    if (success) {
        res.json({ message: 'Notification sent successfully' });
    } else {
        res.status(500).json({ message: 'Failed to send notification' });
    }
});

export default router;
