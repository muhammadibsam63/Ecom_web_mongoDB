import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Note: we'll use a simple id generator if uuid not installed
import toast from 'react-hot-toast';

// Simple guest ID generator (avoid extra dependency)
const generateGuestId = () => {
  let id = localStorage.getItem('guestId');
  if (!id) {
    id = 'guest_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('guestId', id);
  }
  return id;
};

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart from localStorage on mount (guest cart)
  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('cart');
      }
    }
    generateGuestId();
  }, []);

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((product, quantity = 1, variant = null) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === product._id &&
          JSON.stringify(item.variant) === JSON.stringify(variant)
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        toast.success('Cart updated');
        return updated;
      }

      toast.success('Added to cart');
      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          image: product.images?.[0]?.url || '',
          quantity,
          variant,
          stock: product.stock,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((productId, variant = null) => {
    setItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.productId === productId &&
            JSON.stringify(item.variant) === JSON.stringify(variant)
          )
      )
    );
    toast.success('Removed from cart');
  }, []);

  const updateQuantity = useCallback((productId, quantity, variant = null) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId &&
        JSON.stringify(item.variant) === JSON.stringify(variant)
          ? { ...item, quantity }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem('cart');
  }, []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        itemCount,
        subtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
