import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js';
import Category from './models/Category.js';
import Collection from './models/Collection.js';
import Product from './models/Product.js';
import Coupon from './models/Coupon.js';
import Settings from './models/Settings.js';

const seedData = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting seed process (safe - will not delete existing data)...\n');

    // 1. Create Admin User (only if doesn't exist)
    let admin = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@aicommerce.com' });
    if (!admin) {
      admin = await User.create({
        name: process.env.ADMIN_NAME || 'Super Admin',
        email: process.env.ADMIN_EMAIL || 'admin@aicommerce.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@123456',
        role: 'admin',
        isEmailVerified: true,
        isActive: true,
      });
      console.log('✅ Admin user created:', admin.email);
    } else {
      console.log('ℹ️  Admin user already exists:', admin.email);
    }

    // 2. Categories
    const categoriesData = [
      { name: 'Electronics', description: 'Latest gadgets and electronics', order: 1 },
      { name: 'Fashion', description: 'Trending fashion apparel', order: 2 },
      { name: 'Home & Living', description: 'Furniture and home decor', order: 3 },
      { name: 'Beauty', description: 'Skincare and cosmetics', order: 4 },
      { name: 'Sports', description: 'Sports and outdoor gear', order: 5 },
      { name: 'Books', description: 'Books and stationery', order: 6 },
    ];

    const categories = {};
    for (const cat of categoriesData) {
      let existing = await Category.findOne({ name: cat.name });
      if (!existing) {
        existing = await Category.create(cat);
        console.log(`✅ Category created: ${cat.name}`);
      }
      categories[cat.name] = existing;
    }

    // 3. Collections
    const collectionsData = [
      { name: 'New Arrivals', description: 'Fresh products just landed', isFeatured: true, order: 1 },
      { name: 'Best Sellers', description: 'Customer favorites', isFeatured: true, order: 2 },
      { name: 'Summer Sale', description: 'Hot deals for summer', isFeatured: true, order: 3 },
      { name: 'Premium Collection', description: 'Luxury curated items', isFeatured: false, order: 4 },
    ];

    const collections = {};
    for (const col of collectionsData) {
      let existing = await Collection.findOne({ name: col.name });
      if (!existing) {
        existing = await Collection.create(col);
        console.log(`✅ Collection created: ${col.name}`);
      }
      collections[col.name] = existing;
    }

    // 4. Sample Products (only if none exist)
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const productsData = [
        {
          name: 'Wireless Noise Cancelling Headphones',
          description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound. Perfect for travel and work.',
          shortDescription: 'Premium ANC headphones with 30h battery',
          price: 12999,
          compareAtPrice: 15999,
          sku: 'WH-ANC-001',
          category: categories['Electronics']._id,
          collections: [collections['New Arrivals']._id, collections['Best Sellers']._id],
          tags: ['headphones', 'wireless', 'anc', 'audio'],
          stock: 45,
          isFeatured: true,
          images: [
            {
              public_id: 'sample/headphones',
              url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
              isPrimary: true,
              order: 0,
            },
          ],
          specifications: [
            { key: 'Battery', value: '30 hours' },
            { key: 'Connectivity', value: 'Bluetooth 5.2' },
            { key: 'Weight', value: '250g' },
          ],
          createdBy: admin._id,
        },
        {
          name: 'Smart Fitness Watch Pro',
          description: 'Advanced fitness tracking with heart rate, SpO2, GPS, and 100+ workout modes. Water resistant up to 50m.',
          shortDescription: 'Advanced fitness watch with GPS',
          price: 18999,
          compareAtPrice: 24999,
          sku: 'SW-FIT-002',
          category: categories['Electronics']._id,
          collections: [collections['Best Sellers']._id, collections['Premium Collection']._id],
          tags: ['smartwatch', 'fitness', 'gps', 'health'],
          stock: 32,
          isFeatured: true,
          images: [
            {
              public_id: 'sample/watch',
              url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
              isPrimary: true,
              order: 0,
            },
          ],
          createdBy: admin._id,
        },
        {
          name: 'Organic Cotton T-Shirt',
          description: 'Soft, breathable 100% organic cotton t-shirt. Available in multiple colors. Ethically sourced and sustainably produced.',
          shortDescription: '100% organic cotton tee',
          price: 1499,
          compareAtPrice: 1999,
          sku: 'TS-ORG-003',
          category: categories['Fashion']._id,
          collections: [collections['New Arrivals']._id, collections['Summer Sale']._id],
          tags: ['tshirt', 'organic', 'cotton', 'casual'],
          stock: 120,
          isFeatured: false,
          images: [
            {
              public_id: 'sample/tshirt',
              url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
              isPrimary: true,
              order: 0,
            },
          ],
          variants: [
            {
              name: 'Size',
              options: [
                { value: 'S', stock: 30 },
                { value: 'M', stock: 40 },
                { value: 'L', stock: 30 },
                { value: 'XL', stock: 20 },
              ],
            },
            {
              name: 'Color',
              options: [
                { value: 'White', stock: 40 },
                { value: 'Black', stock: 40 },
                { value: 'Navy', stock: 40 },
              ],
            },
          ],
          createdBy: admin._id,
        },
        {
          name: 'Minimalist Ceramic Vase',
          description: 'Handcrafted ceramic vase with a modern minimalist design. Perfect for flowers or as a standalone decor piece.',
          shortDescription: 'Handcrafted minimalist vase',
          price: 2499,
          sku: 'HV-CER-004',
          category: categories['Home & Living']._id,
          collections: [collections['Premium Collection']._id],
          tags: ['vase', 'ceramic', 'decor', 'home'],
          stock: 28,
          isFeatured: true,
          images: [
            {
              public_id: 'sample/vase',
              url: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800',
              isPrimary: true,
              order: 0,
            },
          ],
          createdBy: admin._id,
        },
        {
          name: 'Vitamin C Brightening Serum',
          description: 'Powerful 20% Vitamin C serum with hyaluronic acid and vitamin E. Brightens skin, reduces dark spots, and boosts collagen.',
          shortDescription: '20% Vitamin C brightening serum',
          price: 3299,
          compareAtPrice: 3999,
          sku: 'BS-VTC-005',
          category: categories['Beauty']._id,
          collections: [collections['Best Sellers']._id, collections['New Arrivals']._id],
          tags: ['serum', 'vitaminc', 'skincare', 'brightening'],
          stock: 65,
          isFeatured: true,
          images: [
            {
              public_id: 'sample/serum',
              url: 'https://images.unsplash.com/photo-1620916566132-3c9d9f1b0d0e?w=800',
              isPrimary: true,
              order: 0,
            },
          ],
          createdBy: admin._id,
        },
        {
          name: 'Yoga Mat Premium',
          description: 'Extra thick 8mm eco-friendly yoga mat with superior grip. Non-slip surface, lightweight, and comes with carrying strap.',
          shortDescription: 'Extra thick eco-friendly yoga mat',
          price: 3499,
          sku: 'YM-PRE-006',
          category: categories['Sports']._id,
          collections: [collections['Summer Sale']._id],
          tags: ['yoga', 'mat', 'fitness', 'eco'],
          stock: 40,
          isFeatured: false,
          images: [
            {
              public_id: 'sample/yogamat',
              url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
              isPrimary: true,
              order: 0,
            },
          ],
          createdBy: admin._id,
        },
      ];

      for (const p of productsData) {
        await Product.create(p);
        console.log(`✅ Product created: ${p.name}`);
      }
    } else {
      console.log(`ℹ️  ${productCount} products already exist. Skipping product seed.`);
    }

    // 5. Sample Coupons
    const couponCount = await Coupon.countDocuments();
    if (couponCount === 0) {
      await Coupon.create([
        {
          code: 'WELCOME10',
          description: '10% off for new customers',
          discountType: 'percentage',
          discountValue: 10,
          minOrderAmount: 2000,
          maxDiscountAmount: 1500,
          usageLimit: 1000,
          perUserLimit: 1,
          startDate: new Date(),
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          isActive: true,
          createdBy: admin._id,
        },
        {
          code: 'FLAT500',
          description: 'Flat Rs. 500 off on orders above 5000',
          discountType: 'fixed',
          discountValue: 500,
          minOrderAmount: 5000,
          usageLimit: 500,
          perUserLimit: 2,
          startDate: new Date(),
          endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          isActive: true,
          createdBy: admin._id,
        },
      ]);
      console.log('✅ Sample coupons created');
    }

    // 6. Default Settings
    const defaultSettings = [
      { key: 'store_name', value: 'AI Commerce', group: 'general', description: 'Store name' },
      { key: 'store_currency', value: 'PKR', group: 'store', description: 'Default currency' },
      { key: 'store_currency_symbol', value: 'Rs.', group: 'store', description: 'Currency symbol' },
      { key: 'free_shipping_threshold', value: 5000, group: 'shipping', description: 'Free shipping above this amount' },
      { key: 'default_shipping_cost', value: 250, group: 'shipping', description: 'Default shipping cost' },
      { key: 'tax_rate', value: 0, group: 'tax', description: 'Tax rate percentage' },
      { key: 'ai_enabled', value: true, group: 'ai', description: 'Enable AI shopping assistant' },
      { key: 'ai_welcome_message', value: 'Hi! I\'m your AI shopping assistant. How can I help you find the perfect product today?', group: 'ai' },
    ];

    for (const s of defaultSettings) {
      const exists = await Settings.findOne({ key: s.key });
      if (!exists) {
        await Settings.create(s);
      }
    }
    console.log('✅ Default settings ensured');

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📋 Admin Credentials:');
    console.log(`   Email: ${process.env.ADMIN_EMAIL || 'admin@aicommerce.com'}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
    console.log('\n⚠️  Change the admin password after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedData();
