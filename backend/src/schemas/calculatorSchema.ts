import { z } from 'zod';

export const calculatorSchema = z.object({
    body: z.object({
        items: z.array(z.object({
            length: z.number().min(0.1, 'Length must be greater than 0'),
            width: z.number().min(0.1, 'Width must be greater than 0'),
            height: z.number().min(0.1, 'Height must be greater than 0'),
            quantity: z.number().int().min(1, 'Quantity must be at least 1')
        })).min(1, 'At least one item is required')
    })
});
