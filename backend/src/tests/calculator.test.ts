import { jest } from '@jest/globals';

// Mock Redis BEFORE importing app
jest.mock('../config/redis', () => ({
    __esModule: true,
    default: {
        isOpen: false,
        connect: jest.fn(),
        get: jest.fn(),
        setEx: jest.fn(),
        on: jest.fn(),
        sendCommand: jest.fn(),
    },
    connectRedis: jest.fn(),
}));

jest.mock('rate-limit-redis', () => {
    return {
        __esModule: true,
        default: class RedisStore {
            init() { return Promise.resolve(); }
            increment() { return Promise.resolve({ totalHits: 1, resetTime: new Date() }); }
            decrement() { return Promise.resolve(); }
            resetKey() { return Promise.resolve(); }
        }
    };
});

jest.mock('../config/database', () => ({
    query: jest.fn(),
}));

import request from 'supertest';
import app from '../app';
import pool from '../config/database';

const mockQuery = pool.query as jest.Mock<any>;

describe('Calculator API - Phase 2', () => {
    beforeEach(() => {
        mockQuery.mockClear();
    });

    it('should return 3D packing result', async () => {
        // Mock DB response: A standard box
        const mockBoxes = [
            { id: 1, name: 'Small Box', category: 'Box', dimensions: { length: 10, width: 10, height: 10 } },
            { id: 2, name: 'Large Box', category: 'Box', dimensions: { length: 20, width: 20, height: 20 } }
        ];
        mockQuery.mockResolvedValueOnce({ rows: mockBoxes });

        const items = [
            { length: 5, width: 5, height: 5, quantity: 2 } // Should fit in Small Box
        ];

        const res = await request(app)
            .post('/api/calculator/calculate')
            .send({ items });

        expect(res.statusCode).toEqual(200);
        expect(res.body.recommendedBox).toBeDefined();
        expect(res.body.recommendedBox.name).toEqual('Small Box');
        expect(res.body.packingResult).toBeDefined();
        // Check if we have coordinates
        expect(res.body.packingResult.packedItems).toHaveLength(2);
        expect(res.body.packingResult.packedItems[0]).toHaveProperty('x');
    });

    it('should recommend larger box if small one does not fit', async () => {
        // Mock DB response
        const mockBoxes = [
            { id: 1, name: 'Small Box', category: 'Box', dimensions: { length: 10, width: 10, height: 10 } },
            { id: 2, name: 'Large Box', category: 'Box', dimensions: { length: 50, width: 50, height: 50 } }
        ];
        mockQuery.mockResolvedValueOnce({ rows: mockBoxes });

        // Item larger than Small Box
        const items = [
            { length: 15, width: 15, height: 15, quantity: 1 }
        ];

        const res = await request(app)
            .post('/api/calculator/calculate')
            .send({ items });

        expect(res.statusCode).toEqual(200);
        expect(res.body.recommendedBox.name).toEqual('Large Box');
    });
});
