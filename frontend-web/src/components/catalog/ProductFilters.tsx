import React from 'react';

interface ProductFiltersProps {
    onFilterChange: (filters: any) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ onFilterChange }) => {
    return (
        <div className="glass-panel filters-panel">
            <h3 className="filters-title">Filters</h3>

            <div className="form-group">
                <label className="form-label">Category</label>
                <select
                    className="form-select"
                    onChange={(e) => onFilterChange({ category: e.target.value })}
                >
                    <option value="">All Categories</option>
                    <option value="Box">Boxes</option>
                    <option value="Mailer">Mailers</option>
                    <option value="Tape">Tapes</option>
                </select>
            </div>

            <div className="form-group">
                <label className="form-label">Price Range</label>
                <div className="form-row">
                    <input
                        type="number"
                        placeholder="Min"
                        className="form-input"
                        onChange={(e) => onFilterChange({ minPrice: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        className="form-input"
                        onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
                    />
                </div>
            </div>

            <button className="btn-primary apply-filters-btn">
                Apply Filters
            </button>
        </div>
    );
};

export default ProductFilters;
