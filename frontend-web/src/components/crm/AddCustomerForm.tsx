import React, { useState } from 'react';
import type { CustomerInput } from '../../services/customerService';
import { X } from 'lucide-react';

interface AddCustomerFormProps {
    onAdd: (customer: CustomerInput) => void;
    onCancel: () => void;
    isLoading: boolean;
}

const AddCustomerForm: React.FC<AddCustomerFormProps> = ({ onAdd, onCancel, isLoading }) => {
    const [formData, setFormData] = useState<CustomerInput>({
        name: '',
        company: '',
        email: '',
        phone: '',
        notes: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="glass-panel modal-content">
                <button
                    onClick={onCancel}
                    className="modal-close"
                >
                    <X size={24} />
                </button>

                <h2 className="modal-title">Add New Customer</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name *</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-row">
                        <div className="input-group-flex">
                            <label className="form-label">Company</label>
                            <input
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>
                        <div className="input-group-flex">
                            <label className="form-label">Phone</label>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="form-label">Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={3}
                            className="form-input textarea-resize"
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="btn-cancel"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary"
                        >
                            {isLoading ? 'Saving...' : 'Save Customer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCustomerForm;
