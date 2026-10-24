import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="logo">
              <span className="logo-icon">AI</span>
              <span className="logo-text">Commerce</span>
            </Link>
            <p>
              Premium AI-powered shopping experience. Discover products tailored
              just for you with our intelligent assistant.
            </p>
          </div>

          <div className="footer-col">
            <h4>Shop</h4>
            <Link to="/shop">All Products</Link>
            <Link to="/shop?featured=true">Featured</Link>
            <Link to="/shop?sort=-salesCount">Best Sellers</Link>
            <Link to="/shop?sort=-createdAt">New Arrivals</Link>
          </div>

          <div className="footer-col">
            <h4>Account</h4>
            <Link to="/account">My Account</Link>
            <Link to="/account/orders">Orders</Link>
            <Link to="/account/wishlist">Wishlist</Link>
            <Link to="/cart">Cart</Link>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <Link to="/contact">Contact Us</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/shipping">Shipping Info</Link>
            <Link to="/returns">Returns</Link>
          </div>

          <div className="footer-col">
            <h4>Legal</h4>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} AI Commerce. All rights reserved.</p>
          <p>Built with ❤️ using MERN + Gemini AI</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
