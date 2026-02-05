import axios from 'axios';
import type { Product } from './productService';
import type { ItemInput } from '../components/calculator/CalculatorForm';
import { API_URL } from './config';


export interface PackedItem {
    name: string;
    width: number;
    height: number;
    depth: number;
    weight: number;
    x: number;
    y: number;
    z: number;
}

export interface PackingResult {
    binName: string;
    metrics: any;
    packedItems: PackedItem[];
}

export interface CalculationResult {
    recommendedBox: Product | null;
    totalVolume: number;
    candidatesCount: number;
    message: string;
    packingResult?: PackingResult;
}

export const calculatePackaging = async (items: ItemInput[]) => {
    const response = await axios.post<CalculationResult>(`${API_URL}/calculator/calculate`, { items });
    return response.data;
};
