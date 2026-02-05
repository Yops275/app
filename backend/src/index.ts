import app from './app';
import dotenv from 'dotenv';
import { connectRedis } from './config/redis';

dotenv.config();

const PORT = process.env.PORT || 4000;

connectRedis();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
