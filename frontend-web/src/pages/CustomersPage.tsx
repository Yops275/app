import { useEffect, useState } from 'react';
import type { Customer, CustomerInput } from '../services/customerService';
import { getCustomers, createCustomer } from '../services/customerService';
import CustomerList from '../components/crm/CustomerList';
import AddCustomerForm from '../components/crm/AddCustomerForm';
import { Users, Plus } from 'lucide-react';

const CustomersPage = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await getCustomers();
            setCustomers(data);
        } catch (err) {
            setError('Failed to load customers');
        } finally {
            setLoading(false);
        }
    };

    const handleAddCustomer = async (data: CustomerInput) => {
        setCreating(true);
        try {
            await createCustomer(data);
            await loadData();
            setShowAddForm(false);
        } catch (err) {
            alert('Failed to create customer');
        } finally {
            setCreating(false);
        }
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div>
            <div className="page-header">
                <div className="header-content">
                    <div className="icon-wrapper">
                        <Users size={24} />
                    </div>
                    <div>
                        <h1 className="page-title-text">Customers</h1>
                        <p className="page-description">Manage your client base</p>
                    </div>
                </div>

                <button
                    onClick={() => setShowAddForm(true)}
                    className="btn-primary add-btn"
                >
                    <Plus size={20} /> Add Customer
                </button>
            </div>

            {error && <div className="error-message-block">{error}</div>}

            <CustomerList customers={customers} />

            {showAddForm && (
                <AddCustomerForm
                    onAdd={handleAddCustomer}
                    onCancel={() => setShowAddForm(false)}
                    isLoading={creating}
                />
            )}
        </div>
    );
};

export default CustomersPage;
