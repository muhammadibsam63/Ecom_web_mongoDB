import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles, Truck, Shield, Headphones } from 'lucide-react';
import './HomePage.css';

gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-title span', {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
      });

      gsap.from('.hero-subtitle', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.4,
        ease: 'power2.out',
      });

      gsap.from('.hero-cta', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.6,
        ease: 'power2.out',
      });

      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: Sparkles,
      title: 'AI Shopping Assistant',
      description: 'Get personalized recommendations powered by Gemini AI',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Free shipping on orders above Rs. 5,000',
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Multiple payment options with buyer protection',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Dedicated customer support whenever you need help',
    },
  ];

  return (
    <div ref={heroRef}>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container hero-content">
          <h1 className="hero-title">
            <span>Discover</span>
            <span>Premium</span>
            <span>Shopping</span>
            <span className="accent">with AI</span>
          </h1>
          <p className="hero-subtitle">
            Experience the future of e-commerce. Personalized recommendations,
            intelligent search, and a curated selection of premium products.
          </p>
          <div className="hero-cta">
            <Link to="/shop" className="btn btn-primary btn-lg">
              Shop Now <ArrowRight size={20} />
            </Link>
            <Link to="/shop?featured=true" className="btn btn-secondary btn-lg">
              Explore Featured
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features" ref={featuresRef}>
        <div className="container">
          <div className="features-grid">
            {features.map((feature, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">
                  <feature.icon size={24} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            className="cta-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Ready to experience AI-powered shopping?</h2>
            <p>
              Browse our collection and let our intelligent assistant help you
              find exactly what you're looking for.
            </p>
            <Link to="/shop" className="btn btn-primary btn-lg">
              Start Shopping
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
