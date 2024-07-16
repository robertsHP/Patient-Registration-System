CREATE TABLE LRC_ADMIN_user (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash CHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE LRC_ADMIN_role (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    role_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE LRC_ADMIN_user_role_relation (
    id SERIAL PRIMARY KEY,
    user_id INT,
    role_id INT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES LRC_ADMIN_user(id),
    FOREIGN KEY (role_id) REFERENCES LRC_ADMIN_role(id)
);

-- Inserting into LRC_ADMIN_user
INSERT INTO LRC_ADMIN_user (username, email, password_hash) VALUES
('admin', 'admin@example.com', 'e3afed0047b08059d0fada10f400c1e5'),  -- Replace with actual hash
('user1', 'user1@example.com', 'e3afed0047b08059d0fada10f400c1e5'),  -- Replace with actual hash
('user2', 'user2@example.com', 'e3afed0047b08059d0fada10f400c1e5');  -- Replace with actual hash

-- Inserting into LRC_ADMIN_role
INSERT INTO LRC_ADMIN_role (role_name, role_description) VALUES
('Admin', 'Administrator with full access'),
('User', 'Regular user with limited access'),
('Moderator', 'User with moderation privileges');

-- Inserting into LRC_ADMIN_user_role_relation
INSERT INTO LRC_ADMIN_user_role_relation (user_id, role_id) VALUES
(1, 1),  -- Assigning 'Admin' role to 'admin'
(2, 2),  -- Assigning 'User' role to 'user1'
(3, 2),  -- Assigning 'User' role to 'user2'
(3, 3);  -- Assigning 'Moderator' role to 'user2'
