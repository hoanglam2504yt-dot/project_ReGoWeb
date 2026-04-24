-- Migration: Add product_type column to products table
-- This migration adds support for product types: 'sale' and 'free'

-- Step 1: Add column with default value
ALTER TABLE products 
ADD COLUMN product_type VARCHAR(10) NOT NULL DEFAULT 'sale';

-- Step 2: Add check constraint
ALTER TABLE products 
ADD CONSTRAINT chk_product_type CHECK (product_type IN ('sale', 'free'));

-- Step 3: Create indexes for performance
CREATE INDEX idx_product_type ON products(product_type);
CREATE INDEX idx_product_type_created ON products(product_type, created_at DESC);

-- Rollback script (if needed):
-- ALTER TABLE products DROP CONSTRAINT chk_product_type;
-- DROP INDEX idx_product_type;
-- DROP INDEX idx_product_type_created;
-- ALTER TABLE products DROP COLUMN product_type;
