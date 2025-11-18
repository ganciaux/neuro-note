-- ===============================
-- ENUM TYPES VALUES
-- ===============================
INSERT INTO enum_types(type, code, short_code, label) VALUES
('user_role', 'user_role_admin', 'admin', 'Administrator'),
('user_role', 'user_role_staff', 'staff', 'Staff');

-- ===============================
-- USERS
-- ===============================
INSERT INTO users(email, password_hash, role_code, full_name) VALUES
('admin@example.com', 'hash1', 'user_role_admin', 'Admin User');