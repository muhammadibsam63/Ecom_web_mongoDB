import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productsAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, Star, Filter, X } from 'lucide-react';
import './ShopPage.css';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { addToCart } = useCart();

  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || '-createdAt';
  const featured = searchParams.get('featured') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 12,
          sort,
          ...(search && { search }),
          ...(featured && { featured }),
          ...(minPrice && { minPrice }),
          ...(maxPrice && { maxPrice }),
        };
        const { data } = await productsAPI.getAll(params);
        setProducts(data.products);
        setTotal(data.total);
        setPages(data.pages);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, search, sort, featured, minPrice, maxPrice]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== 'page') params.set('page', '1');
    setSearchParams(params);
  };

  const formatPrice = (price) =>
    `Rs. ${price.toLocaleString('en-PK')}`;

  return (
    <div className="shop-page">
      <div className="container">
        <div className="shop-header">
          <div>
            <h1>Shop</h1>
            <p>{total} products found</p>
          </div>
          <div className="shop-controls">
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="form-input sort-select"
            >
              <option value="-createdAt">Newest</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-rating.average">Top Rated</option>
              <option value="-salesCount">Best Selling</option>
            </select>
            <button
              className="btn btn-secondary btn-sm filter-toggle"
              onClick={() => setFiltersOpen(true)}
            >
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>

        <div className="shop-layout">
          {/* Sidebar Filters (Desktop) */}
          <aside className="filters-sidebar">
            <h3>Filters</h3>
            <div className="filter-group">
              <label className="form-label">Price Range</label>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => updateParam('minPrice', e.target.value)}
                  className="form-input"
                />
                <span>–</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => updateParam('maxPrice', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
            <div className="filter-group">
              <label className="form-label">
                <input
                  type="checkbox"
                  checked={featured === 'true'}
                  onChange={(e) =>
                    updateParam('featured', e.target.checked ? 'true' : '')
                  }
                />{' '}
                Featured Only
              </label>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="products-area">
            {loading ? (
              <div className="products-grid">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="product-card skeleton-card">
                    <div className="skeleton product-img-skeleton" />
                    <div className="skeleton" style={{ height: 20, width: '80%', margin: '12px 0 8px' }} />
                    <div className="skeleton" style={{ height: 16, width: '40%' }} />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search query.</p>
                <Link to="/shop" className="btn btn-primary">
                  Clear Filters
                </Link>
              </div>
            ) : (
              <div className="products-grid">
                {products.map((product, i) => (
                  <motion.div
                    key={product._id}
                    className="product-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link to={`/product/${product.slug}`} className="product-image">
                      <img
                        src={product.images?.[0]?.url || '/placeholder.png'}
                        alt={product.name}
                        loading="lazy"
                      />
                      {product.discountPercentage > 0 && (
                        <span className="discount-badge">
                          -{product.discountPercentage}%
                        </span>
                      )}
                    </Link>
                    <div className="product-info">
                      <Link to={`/product/${product.slug}`}>
                        <h3>{product.name}</h3>
                      </Link>
                      <div className="product-rating">
                        <Star size={14} fill="currentColor" />
                        <span>{product.rating?.average?.toFixed(1) || '0.0'}</span>
                        <span className="rating-count">
                          ({product.rating?.count || 0})
                        </span>
                      </div>
                      <div className="product-price">
                        <span className="current">{formatPrice(product.price)}</span>
                        {product.compareAtPrice > product.price && (
                          <span className="compare">
                            {formatPrice(product.compareAtPrice)}
                          </span>
                        )}
                      </div>
                      <button
                        className="btn btn-primary btn-sm add-btn"
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                      >
                        <ShoppingBag size={16} />
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={page <= 1}
                  onClick={() => updateParam('page', String(page - 1))}
                >
                  Previous
                </button>
                <span>
                  Page {page} of {pages}
                </span>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={page >= pages}
                  onClick={() => updateParam('page', String(page + 1))}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {filtersOpen && (
        <div className="filters-mobile">
          <div className="filters-mobile-overlay" onClick={() => setFiltersOpen(false)} />
          <div className="filters-mobile-panel">
            <div className="filters-mobile-header">
              <h3>Filters</h3>
              <button onClick={() => setFiltersOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="filter-group">
              <label className="form-label">Price Range</label>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => updateParam('minPrice', e.target.value)}
                  className="form-input"
                />
                <span>–</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => updateParam('maxPrice', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 16 }}
              onClick={() => setFiltersOpen(false)}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
