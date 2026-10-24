import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productsAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, Star, Heart, Truck, Shield, ArrowLeft } from 'lucide-react';
import './ProductPage.css';

const ProductPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await productsAPI.getOne(slug);
        setProduct(data.product);
        setSelectedImage(0);
        // Fetch related
        const relatedRes = await productsAPI.getRelated(data.product._id);
        setRelated(relatedRes.data.products);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const formatPrice = (price) => `Rs. ${price?.toLocaleString('en-PK')}`;

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <div className="skeleton" style={{ height: 400, borderRadius: 16 }} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2>Product not found</h2>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: 16 }}>
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="product-page">
      <div className="container">
        <Link to="/shop" className="back-link">
          <ArrowLeft size={18} /> Back to Shop
        </Link>

        <div className="product-detail">
          {/* Gallery */}
          <div className="product-gallery">
            <div className="main-image">
              <img
                src={product.images?.[selectedImage]?.url || product.images?.[0]?.url}
                alt={product.name}
              />
            </div>
            {product.images?.length > 1 && (
              <div className="thumbnails">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className={`thumb ${selectedImage === i ? 'active' : ''}`}
                    onClick={() => setSelectedImage(i)}
                  >
                    <img src={img.url} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-detail-info">
            <h1>{product.name}</h1>
            <div className="product-meta">
              <div className="product-rating">
                <Star size={16} fill="currentColor" />
                <span>{product.rating?.average?.toFixed(1) || '0.0'}</span>
                <span className="rating-count">
                  ({product.rating?.count || 0} reviews)
                </span>
              </div>
              {product.sku && <span className="sku">SKU: {product.sku}</span>}
            </div>

            <div className="product-price-block">
              <span className="current">{formatPrice(product.price)}</span>
              {product.compareAtPrice > product.price && (
                <>
                  <span className="compare">{formatPrice(product.compareAtPrice)}</span>
                  <span className="save">
                    Save {product.discountPercentage}%
                  </span>
                </>
              )}
            </div>

            <p className="short-desc">
              {product.shortDescription || product.description?.slice(0, 200)}
            </p>

            <div className="stock-status">
              {product.stock > 0 ? (
                <span className="in-stock">In Stock ({product.stock} available)</span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>

            <div className="quantity-row">
              <label>Quantity</label>
              <div className="qty-controls">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            <div className="action-row">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => addToCart(product, quantity)}
                disabled={product.stock === 0}
              >
                <ShoppingBag size={20} /> Add to Cart
              </button>
              <button className="btn btn-secondary btn-lg" aria-label="Wishlist">
                <Heart size={20} />
              </button>
            </div>

            <div className="trust-badges">
              <div>
                <Truck size={18} /> Free shipping over Rs. 5,000
              </div>
              <div>
                <Shield size={18} /> Secure checkout
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="product-description">
          <h2>Description</h2>
          <p>{product.description}</p>
          {product.specifications?.length > 0 && (
            <>
              <h3>Specifications</h3>
              <table className="specs-table">
                <tbody>
                  {product.specifications.map((spec, i) => (
                    <tr key={i}>
                      <td>{spec.key}</td>
                      <td>{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="related-section">
            <h2>You may also like</h2>
            <div className="related-grid">
              {related.map((p) => (
                <Link key={p._id} to={`/product/${p.slug}`} className="related-card">
                  <img src={p.images?.[0]?.url} alt={p.name} />
                  <h4>{p.name}</h4>
                  <span>{formatPrice(p.price)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
