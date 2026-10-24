import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';

// Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';

// Pages
import HomePage from './pages/shop/HomePage';
import ShopPage from './pages/shop/ShopPage';
import ProductPage from './pages/shop/ProductPage';
import CartPage from './pages/shop/CartPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected route wrapper
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = '/login';
    return null;
  }

  if (adminOnly && !isAdmin) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Access Denied</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return children;
};

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      {!isAdminRoute && <Header />}
      <main style={{ minHeight: 'calc(100vh - var(--header-height) - 200px)' }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Storefront */}
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />

            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Placeholder for more routes */}
            {/* Account, Admin, Checkout, etc. will be added */}

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
      </main>
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;
