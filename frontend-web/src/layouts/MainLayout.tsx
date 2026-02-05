import { Link, Outlet } from 'react-router-dom';
import { Package, ShoppingCart } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import NotificationTest from '../components/notifications/NotificationTest';

const MainLayout = () => {
    const { isAuthenticated, logout } = useAuthStore();
    const items = useCartStore((state) => state.items);

    return (
        <div className="app-container">
            <header className="main-header">
                <div className="container header-content">
                    <Link to="/" className="logo-link">
                        <Package color="var(--color-primary)" />
                        <span>PackageMatch</span>
                    </Link>

                    <nav className="main-nav">
                        <Link to="/catalog" className="nav-link">Catalog</Link>
                        <Link to="/calculator" className="nav-link">Calculator</Link>
                        <Link to="/customers" className="nav-link">CRM</Link>
                        <Link to="/orders" className="nav-link">Orders</Link>
                        {isAuthenticated ? (
                            <button onClick={() => logout()} className="logout-btn nav-link">
                                Logout
                            </button>
                        ) : (
                            <Link to="/login" className="btn-primary login-btn-small">
                                Login
                            </Link>
                        )}
                        <Link to="/cart" className="cart-icon-wrapper">
                            <ShoppingCart size={20} />
                            {items.length > 0 && (
                                <span className="cart-badge">
                                    {items.length}
                                </span>
                            )}
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="main-content">
                <div className="container">
                    <Outlet />
                </div>
            </main>

            <footer className="main-footer">
                <div className="container">
                    &copy; {new Date().getFullYear()} PackageMatch. All rights reserved.
                    <div className="footer-notification-wrapper">
                        <NotificationTest />
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
