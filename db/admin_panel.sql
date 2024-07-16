CREATE TABLE LRC_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash CHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE LRC_roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    role_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE LRC_roles (
    id SERIAL PRIMARY KEY,
    user_id INT,
    role_id INT,
    AssignedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

INSERT INTO LRC_users (username, email, password_hash)
VALUES
('john_doe', 'john@example.com', ''),
('jane_smith', 'jane@example.com', ''),
('alice_jones', 'alice@example.com', '');

INSERT INTO LRC_roles (role_name, role_description)
VALUES
('admin', 'Administrator with full access'),
('user', 'User with permissions to modify content');

INSERT INTO LRC_user_roles (user_id, role_id)
VALUES
(1, 1),
(2, 2),
(3, 3),
(1, 2),
(2, 3);
