import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Search,
  User,
  Heart,
  Menu,
  X,
  Moon,
  Sun,
  LogOut,
  Package,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import './Header.css';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/shop?featured=true', label: 'Featured' },
  ];

  return (
    <header className="header">
      <div className="header-inner container">
        {/* Logo */}
        <Link to="/" className="logo">
          <span className="logo-icon">AI</span>
          <span className="logo-text">Commerce</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="nav-desktop">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="header-actions">
          <button
            className="action-btn"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          <button
            className="action-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <Link to="/cart" className="action-btn cart-btn" aria-label="Cart">
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="cart-badge">{itemCount > 99 ? '99+' : itemCount}</span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="user-menu">
              <button className="action-btn user-btn">
                <User size={20} />
              </button>
              <div className="user-dropdown">
                <div className="user-info">
                  <strong>{user?.name}</strong>
                  <span>{user?.email}</span>
                </div>
                <Link to="/account" className="dropdown-item">
                  <User size={16} /> My Account
                </Link>
                <Link to="/account/orders" className="dropdown-item">
                  <Package size={16} /> Orders
                </Link>
                <Link to="/account/wishlist" className="dropdown-item">
                  <Heart size={16} /> Wishlist
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="dropdown-item">
                    <Package size={16} /> Admin Panel
                  </Link>
                )}
                <button onClick={logout} className="dropdown-item logout">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              Sign In
            </Link>
          )}

          <button
            className="action-btn mobile-toggle"
            onClick={() => setMobileOpen(true)}
            aria-label="Menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="mobile-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="drawer-header">
                <span className="logo-text">Menu</span>
                <button onClick={() => setMobileOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <nav className="drawer-nav">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="drawer-link"
                  >
                    {link.label}
                  </Link>
                ))}
                {!isAuthenticated && (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="drawer-link">
                      Sign In
                    </Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="drawer-link">
                      Create Account
                    </Link>
                  </>
                )}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="search-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <form onSubmit={handleSearch} className="search-form">
              <Search size={24} />
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="button" onClick={() => setSearchOpen(false)}>
                <X size={24} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
