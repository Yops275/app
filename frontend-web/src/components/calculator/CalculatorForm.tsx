import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export interface ItemInput {
    length: number;
    width: number;
    height: number;
    quantity: number;
}

interface CalculatorFormProps {
    onCalculate: (items: ItemInput[]) => void;
    isLoading: boolean;
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({ onCalculate, isLoading }) => {
    const [items, setItems] = useState<ItemInput[]>([
        { length: 0, width: 0, height: 0, quantity: 1 }
    ]);

    const addItem = () => {
        setItems([...items, { length: 0, width: 0, height: 0, quantity: 1 }]);
    };

    const removeItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const updateItem = (index: number, field: keyof ItemInput, value: number) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCalculate(items);
    };

    return (
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.5rem' }}>Items to Pack</h2>

            {items.map((item, index) => (
                <div key={index} className="input-row">
                    <div className="input-group-flex">
                        <label className="form-label">Length (cm)</label>
                        <input
                            type="number"
                            min="1"
                            value={item.length || ''}
                            onChange={(e) => updateItem(index, 'length', parseFloat(e.target.value))}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="input-group-flex">
                        <label className="form-label">Width (cm)</label>
                        <input
                            type="number"
                            min="1"
                            value={item.width || ''}
                            onChange={(e) => updateItem(index, 'width', parseFloat(e.target.value))}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="input-group-flex">
                        <label className="form-label">Height (cm)</label>
                        <input
                            type="number"
                            min="1"
                            value={item.height || ''}
                            onChange={(e) => updateItem(index, 'height', parseFloat(e.target.value))}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="input-group-fixed">
                        <label className="form-label">Qty</label>
                        <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                            className="form-input"
                            required
                        />
                    </div>
                    {items.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="remove-btn-small"
                        >
                            <Trash2 size={20} />
                        </button>
                    )}
                </div>
            ))}

            <div className="calc-actions">
                <button
                    type="button"
                    onClick={addItem}
                    className="add-item-btn"
                >
                    <Plus size={18} /> Add Item
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary"
                    style={{ flex: 1 }}
                >
                    {isLoading ? 'Calculating...' : 'Calculate Optimal Box'}
                </button>
            </div>
        </form>
    );
};

export default CalculatorForm;
