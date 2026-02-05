import { Request, Response } from 'express';
import pool from '../config/database';

export const getCustomers = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM customers ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getCustomerById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createCustomer = async (req: Request, res: Response) => {
    try {
        const { name, company, email, phone, notes } = req.body;

        const result = await pool.query(
            `INSERT INTO customers (name, company, email, phone, notes) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING *`,
            [name, company, email, phone, notes]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateCustomer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, company, email, phone, notes } = req.body;

        const result = await pool.query(
            `UPDATE customers 
             SET name = $1, company = $2, email = $3, phone = $4, notes = $5, updated_at = CURRENT_TIMESTAMP
             WHERE id = $6
             RETURNING *`,
            [name, company, email, phone, notes, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
