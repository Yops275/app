import { Package, Box, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
    const { t } = useTranslation();

    return (
        <div>
            <section className="hero-section">
                <h1 className="hero-title">
                    {t('hero.title')} <span className="highlight-text">{t('hero.highlight')}</span>
                </h1>
                <p className="hero-description">{t('hero.description')}</p>
                <div className="hero-actions">
                    <Link to="/catalog" className="btn-primary hero-btn">
                        {t('hero.browseCatalog')}
                    </Link>
                    <Link to="/calculator" className="glass-panel hero-secondary-btn">
                        {t('hero.tryCalculator')}
                    </Link>
                </div>
            </section>

            <section className="features-grid">
                <div className="glass-panel feature-card">
                    <Box size={40} color="var(--color-secondary)" className="feature-icon" />
                    <h3 className="feature-title">{t('features.calculator.title')}</h3>
                    <p className="feature-desc">{t('features.calculator.desc')}</p>
                </div>
                <div className="glass-panel feature-card">
                    <Package size={40} color="var(--color-primary)" className="feature-icon" />
                    <h3 className="feature-title">{t('features.ar.title')}</h3>
                    <p className="feature-desc">{t('features.ar.desc')}</p>
                </div>
                <div className="glass-panel feature-card">
                    <BarChart3 size={40} color="#10b981" className="feature-icon" />
                    <h3 className="feature-title">{t('features.analytics.title')}</h3>
                    <p className="feature-desc">{t('features.analytics.desc')}</p>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
