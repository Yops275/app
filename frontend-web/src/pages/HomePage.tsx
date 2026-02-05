import { Package, Box, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div>
            <section className="hero-section">
                <h1 className="hero-title">
                    Smart Packaging <span className="highlight-text">Solutions</span>
                </h1>
                <p className="hero-description">
                    AI-powered packaging selection, 3D visualization, and seamless ordering for your business.
                </p>
                <div className="hero-actions">
                    <Link to="/catalog" className="btn-primary hero-btn">
                        Browse Catalog
                    </Link>
                    <Link to="/calculator" className="glass-panel hero-secondary-btn">
                        Try Calculator
                    </Link>
                </div>
            </section>

            <section className="features-grid">
                <div className="glass-panel feature-card">
                    <Box size={40} color="var(--color-secondary)" className="feature-icon" />
                    <h3 className="feature-title">AI Calculator</h3>
                    <p className="feature-desc">Find the perfect box size for your products instantly with our algorithm.</p>
                </div>
                <div className="glass-panel feature-card">
                    <Package size={40} color="var(--color-primary)" className="feature-icon" />
                    <h3 className="feature-title">AR Visualization</h3>
                    <p className="feature-desc">View packaging in your space before you buy using Augmented Reality.</p>
                </div>
                <div className="glass-panel feature-card">
                    <BarChart3 size={40} color="#10b981" className="feature-icon" />
                    <h3 className="feature-title">Smart Analytics</h3>
                    <p className="feature-desc">Track orders and optimize your packaging supply chain.</p>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
