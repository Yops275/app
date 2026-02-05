import request from 'supertest';
import app from '../app';
import pool from '../config/database';

// Mock the database pool
jest.mock('../config/database', () => ({
    query: jest.fn(),
}));

const mockQuery = pool.query as jest.Mock;

describe('Product API', () => {
    beforeEach(() => {
        mockQuery.mockClear();
    });

    describe('GET /api/products', () => {
        it('should return a list of products', async () => {
            const mockProducts = [
                { id: 1, name: 'Box A', price: 10.99 },
                { id: 2, name: 'Box B', price: 15.50 }
            ];

            // Mock the database response
            mockQuery.mockResolvedValueOnce({ rows: mockProducts });

            const res = await request(app).get('/api/products');

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBe(2);
            expect(res.body[0].name).toBe('Box A');
        });

        it('should handle server errors', async () => {
            mockQuery.mockRejectedValueOnce(new Error('DB Error'));

            const res = await request(app).get('/api/products');

            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', 'Server error');
        });
    });
});
