import request from 'supertest';
import app from '../app';

// Mock the database pool to prevent connection attempts
jest.mock('../config/database', () => ({
    query: jest.fn(),
    on: jest.fn(),
}));

describe('Health Check Endpoint', () => {
    it('should return 200 and status ok', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'ok');
        expect(res.body).toHaveProperty('timestamp');
    });
});
