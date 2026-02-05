import { Link, Outlet } from 'react-router-dom';
import { Package, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import NotificationTest from '../components/notifications/NotificationTest';

const MainLayout = () => {
    const { t } = useTranslation();
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
                        <Link to="/catalog" className="nav-link">{t('nav.catalog')}</Link>
                        <Link to="/calculator" className="nav-link">{t('nav.calculator')}</Link>
                        <Link to="/customers" className="nav-link">{t('nav.crm')}</Link>
                        <Link to="/orders" className="nav-link">{t('nav.orders')}</Link>
                        {isAuthenticated ? (
                            <button onClick={() => logout()} className="logout-btn nav-link">
                                {t('nav.logout')}
                            </button>
                        ) : (
                            <Link to="/login" className="btn-primary login-btn-small">
                                {t('nav.login')}
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
                    &copy; {new Date().getFullYear()} PackageMatch. {t('footer.rights')}
                    <div className="footer-notification-wrapper">
                        <NotificationTest />
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
