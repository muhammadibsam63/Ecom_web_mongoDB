import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h1
          style={{
            fontSize: '6rem',
            fontWeight: 800,
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1,
          }}
        >
          404
        </h1>
        <h2 style={{ marginBottom: '0.5rem' }}>Page not found</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary btn-lg">
          Go Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
