import { Request, Response } from 'express';
import pool from '../config/database';

export const getProducts = async (req: Request, res: Response) => {
    try {
        const { category, minPrice, maxPrice } = req.query;
        let query = 'SELECT * FROM products WHERE 1=1';
        const params: any[] = [];
        let paramIndex = 1;

        if (category) {
            query += ` AND category = $${paramIndex}`;
            params.push(category);
            paramIndex++;
        }

        if (minPrice) {
            query += ` AND price >= $${paramIndex}`;
            params.push(minPrice);
            paramIndex++;
        }

        if (maxPrice) {
            query += ` AND price <= $${paramIndex}`;
            params.push(maxPrice);
            paramIndex++;
        }

        query += ' ORDER BY created_at DESC';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, description, category, material, dimensions, price, stock, image_url } = req.body;

        const result = await pool.query(
            `INSERT INTO products (name, description, category, material, dimensions, price, stock, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
            [name, description, category, material, JSON.stringify(dimensions), price, stock, image_url]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
