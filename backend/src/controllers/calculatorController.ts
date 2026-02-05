import { Request, Response } from 'express';
import pool from '../config/database';
import { packItems } from '../utils/binPacker';
import logger from '../utils/logger';

import redisClient from '../config/redis';
import crypto from 'crypto';

interface Item {
    length: number;
    width: number;
    height: number;
    quantity: number;
}

interface Dimensions {
    length: number;
    width: number;
    height: number;
}

const calculateVolume = (dims: Dimensions | Item) => dims.length * dims.width * dims.height;

const generateCacheKey = (items: Item[]): string => {
    // Sort items to ensure same combination yields same key regardless of order
    const sortedItems = [...items].sort((a, b) =>
        (a.length - b.length) || (a.width - b.width) || (a.height - b.height) || (a.quantity - b.quantity)
    );
    const data = JSON.stringify(sortedItems);
    return crypto.createHash('md5').update(data).digest('hex');
};

export const calculatePackaging = async (req: Request, res: Response) => {
    try {
        const items: Item[] = req.body.items;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Invalid items provided' });
        }

        // 1. Check Cache
        const cacheKey = `calc:${generateCacheKey(items)}`;

        try {
            if (!redisClient.isOpen) await redisClient.connect();
            const cachedResult = await redisClient.get(cacheKey);

            if (cachedResult) {
                logger.info('Returning cached calculation result');
                return res.json(JSON.parse(cachedResult));
            }
        } catch (redisError) {
            logger.error('Redis cache error (skipping):', redisError);
            // Fallback to calculation if Redis fails
        }

        // 1. Calculate Total Volume required
        let totalVolume = 0;
        let maxDimension = 0;

        items.forEach(item => {
            totalVolume += calculateVolume(item) * item.quantity;
            maxDimension = Math.max(maxDimension, item.length, item.width, item.height);
        });

        // 2. Fetch available boxes
        const result = await pool.query("SELECT * FROM products WHERE category = 'Box'");
        const boxes = result.rows;

        // 3. Prepare items for packer (Expand quantity to individual items)
        const itemsToPack: any[] = [];
        items.forEach((item, index) => {
            for (let i = 0; i < item.quantity; i++) {
                itemsToPack.push({
                    name: `Item ${index + 1}-${i + 1}`,
                    width: item.length,
                    height: item.width,
                    depth: item.height,
                    weight: 1 // Default weight for now
                });
            }
        });

        // 4. Use 3D Bin Packer
        const packingResult = packItems(boxes, itemsToPack);

        if (packingResult) {
            const recommendedBox = boxes.find(b => b.name === packingResult.binName);

            const responseData = {
                recommendedBox,
                packingResult, // Send full coordinates
                totalVolume, // Keep legacy
                message: 'Optimal box found (3D Verified)'
            };

            // Cache for 24 hours
            try {
                if (redisClient.isOpen) {
                    await redisClient.setEx(cacheKey, 86400, JSON.stringify(responseData));
                }
            } catch (err) {
                logger.error('Redis cache set failed:', err);
            }

            res.json(responseData);
        } else {
            res.json({
                recommendedBox: null,
                message: 'No suitable box found to fit all items.'
            });
        }

    } catch (error) {
        logger.error('Calculator error:', error);
        res.status(500).json({ message: 'Calculation failed' });
    }
};
