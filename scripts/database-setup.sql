-- Create MunchHaven Database
CREATE DATABASE IF NOT EXISTS munchhaven;
USE munchhaven;

-- Categories Table
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    icon VARCHAR(50) DEFAULT 'sparkles',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Menu Items Table
CREATE TABLE menu_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(500),
    category_id INT,
    available BOOLEAN DEFAULT TRUE,
    rating DECIMAL(3,2) DEFAULT 0.00,
    prep_time VARCHAR(20),
    is_popular BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Orders Table
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    room_number VARCHAR(20) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled') DEFAULT 'pending',
    special_requests TEXT,
    whatsapp_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    special_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

-- Admin Users Table
CREATE TABLE admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    full_name VARCHAR(100),
    role ENUM('admin', 'manager', 'staff') DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Reviews Table
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    menu_item_id INT NOT NULL,
    customer_name VARCHAR(100),
    customer_phone VARCHAR(20),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

-- Image Uploads Table
CREATE TABLE image_uploads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    entity_type ENUM('menu_item', 'category') NOT NULL,
    entity_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Default Categories
INSERT INTO categories (name, description, icon) VALUES
('Appetizers', 'Start your meal with our delicious appetizers and small plates', 'sparkles'),
('Main Courses', 'Hearty and satisfying main dishes crafted with premium ingredients', 'chef-hat'),
('Desserts', 'Sweet treats and decadent desserts to end your meal perfectly', 'award'),
('Beverages', 'Refreshing drinks, specialty cocktails, and premium beverages', 'users');

-- Insert Sample Menu Items
INSERT INTO menu_items (name, description, price, category_id, prep_time, is_popular, rating) VALUES
('Truffle Arancini', 'Crispy risotto balls with truffle oil and parmesan cheese, served with marinara sauce', 1800.00, 1, '15 min', TRUE, 4.8),
('Wagyu Beef Tenderloin', 'Premium wagyu beef with roasted seasonal vegetables and red wine jus reduction', 6500.00, 2, '25 min', FALSE, 4.9),
('Chocolate Lava Cake', 'Warm chocolate cake with molten center, vanilla bean ice cream and berry compote', 1400.00, 3, '12 min', TRUE, 4.7),
('Pan-Seared Salmon', 'Atlantic salmon with quinoa pilaf, citrus glaze and microgreens', 3200.00, 2, '20 min', FALSE, 4.6),
('Craft Beer Selection', 'Curated selection from local breweries with detailed tasting notes', 800.00, 4, '2 min', FALSE, 4.5),
('Artisan Cocktails', 'House-crafted cocktails with premium spirits and fresh ingredients', 1500.00, 4, '5 min', FALSE, 4.8);

-- Insert Default Admin User (username: admin, password: munchhaven2024)
INSERT INTO admin_users (username, password_hash, email, full_name) VALUES
('admin', '$2b$10$rQZ8kHp0rQZ8kHp0rQZ8kOQZ8kHp0rQZ8kHp0rQZ8kHp0rQZ8kHp0r', 'admin@munchhaven.co.ke', 'System Administrator');

-- Create indexes for better performance
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_menu_items_available ON menu_items(available);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_reviews_menu_item ON reviews(menu_item_id);
