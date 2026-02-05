import React from 'react';
import type { Customer } from '../../services/customerService';
import { Mail, Phone, Building } from 'lucide-react';

interface CustomerListProps {
    customers: Customer[];
}

const CustomerList: React.FC<CustomerListProps> = ({ customers }) => {
    return (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
            <table className="orders-table">
                <thead className="table-header">
                    <tr>
                        <th className="table-th">Name</th>
                        <th className="table-th">Contact Info</th>
                        <th className="table-th">Company</th>
                        <th className="table-th">Created</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer) => (
                        <tr key={customer.id} className="table-row">
                            <td className="table-td">
                                <div className="customer-name-wrapper">
                                    <div className="font-bold">{customer.name}</div>
                                    <div className="text-muted text-sm">ID: #{customer.id}</div>
                                </div>
                            </td>
                            <td className="table-td">
                                <div className="contact-info-row">
                                    <Mail size={14} color="#94a3b8" />
                                    <span>{customer.email}</span>
                                </div>
                                {customer.phone && (
                                    <div className="contact-info-row text-muted">
                                        <Phone size={14} />
                                        <span>{customer.phone}</span>
                                    </div>
                                )}
                            </td>
                            <td className="table-td">
                                {customer.company ? (
                                    <div className="company-info">
                                        <Building size={16} color="#6366f1" />
                                        <span>{customer.company}</span>
                                    </div>
                                ) : (
                                    <span className="text-muted">-</span>
                                )}
                            </td>
                            <td className="table-td" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                                {new Date(customer.created_at).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {customers.length === 0 && (
                <div className="empty-state">
                    No customers found. Add your first client to get started.
                </div>
            )}
        </div>
    );
};

export default CustomerList;
