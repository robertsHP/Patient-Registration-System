CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash CHAR(64) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE user_roles (
    user_id INT,
    role_id INT,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE
);

INSERT INTO users (username, email, password_hash) VALUES
('admin', 'EMAIL', '123'),
('user', 'EMAIL', '123');

INSERT INTO roles (role_name, description) VALUES
('Admin', 'Full access to all systems and resources.'),
('User', 'Standard access with limited permissions.');

INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1),  -- admin as Admin
(2, 2);  -- user as User