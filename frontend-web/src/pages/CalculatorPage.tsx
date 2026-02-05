import { useState } from 'react';
import CalculatorForm from '../components/calculator/CalculatorForm';
import type { ItemInput } from '../components/calculator/CalculatorForm';
import { calculatePackaging } from '../services/calculatorService';
import type { CalculationResult } from '../services/calculatorService';
import ProductCard from '../components/catalog/ProductCard';
import BoxVisualizer from '../components/calculator/BoxVisualizer';

const CalculatorPage = () => {
    const [result, setResult] = useState<CalculationResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCalculate = async (items: ItemInput[]) => {
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const data = await calculatePackaging(items);
            setResult(data);
        } catch (err) {
            setError('Calculation failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="calculator-page">
            <h1 className="page-title">Packaging Calculator</h1>

            <CalculatorForm onCalculate={handleCalculate} isLoading={loading} />

            {error && (
                <div className="error-banner">
                    {error}
                </div>
            )}

            {result && (
                <div className="result-section">
                    <h2 className="result-title">Result</h2>

                    {result.recommendedBox ? (
                        <div>
                            <p className="result-description">
                                We found an optimal box for your items based on total volume and dimensions.
                            </p>
                            <div className="result-card-container">
                                <ProductCard product={result.recommendedBox} />
                            </div>

                            {result.recommendedBox.dimensions && (
                                <div className="visualizer-card">
                                    <h3 className="visualizer-title">3D Preview</h3>
                                    <BoxVisualizer
                                        length={result.recommendedBox.dimensions.length}
                                        width={result.recommendedBox.dimensions.width}
                                        height={result.recommendedBox.dimensions.height}
                                        packedItems={result.packingResult?.packedItems}
                                    />
                                    <p className="visualizer-hint">
                                        Interactive 3D View: Rotate and Zoom
                                    </p>
                                </div>
                            )}

                            <div className="volume-stat">
                                Total Item Volume: {(result.totalVolume / 1000).toFixed(2)} L
                            </div>
                        </div>
                    ) : (
                        <div className="glass-panel empty-state">
                            {result.message}
                            <br />
                            Try splitting the order or checking stock.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CalculatorPage;
