import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import './CartPage.css';

const CartPage = () => {
  const { items, itemCount, subtotal, updateQuantity, removeFromCart, clearCart } = useCart();

  const formatPrice = (price) => `Rs. ${price.toLocaleString('en-PK')}`;
  const shipping = subtotal >= 5000 ? 0 : 250;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <ShoppingBag size={64} strokeWidth={1} />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet.</p>
            <Link to="/shop" className="btn btn-primary btn-lg">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart ({itemCount} items)</h1>

        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <div key={`${item.productId}-${JSON.stringify(item.variant)}`} className="cart-item">
                <Link to={`/product/${item.slug}`} className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </Link>
                <div className="cart-item-info">
                  <Link to={`/product/${item.slug}`}>
                    <h3>{item.name}</h3>
                  </Link>
                  {item.variant && (
                    <span className="variant">
                      {item.variant.name}: {item.variant.value}
                    </span>
                  )}
                  <span className="price">{formatPrice(item.price)}</span>
                </div>
                <div className="cart-item-qty">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1, item.variant)
                    }
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1, item.variant)
                    }
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="cart-item-total">
                  {formatPrice(item.price * item.quantity)}
                </div>
                <button
                  className="cart-item-remove"
                  onClick={() => removeFromCart(item.productId, item.variant)}
                  aria-label="Remove"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <button className="btn btn-ghost clear-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
            </div>
            {shipping > 0 && (
              <p className="shipping-note">
                Add {formatPrice(5000 - subtotal)} more for free shipping
              </p>
            )}
            <div className="summary-row total">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <Link to="/checkout" className="btn btn-primary btn-lg checkout-btn">
              Proceed to Checkout
            </Link>
            <Link to="/shop" className="btn btn-secondary continue-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
