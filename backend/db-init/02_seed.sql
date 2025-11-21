-- ===============================
-- ENUM TYPES VALUES
-- ===============================
INSERT INTO enum_types(type, code, short_code, label) VALUES
('user_role', 'user_role_admin', 'admin', 'Administrator'),
('user_role', 'user_role_staff', 'staff', 'Staff'),
('patient_title', 'patient_title_mr', 'mr', 'Monsieur'),
('patient_title', 'patient_title_mrs', 'mrs', 'Madame'),
('patient_title', 'patient_title_ms', 'ms', 'Mademoiselle');

-- ===============================
-- USERS
-- ===============================
INSERT INTO users(email, slug, password_hash, role_code, full_name) VALUES
('admin@example.com', 'admin-0000', 'hash1', 'user_role_admin', 'Admin User');

-- ===============================
-- PATIENTS
-- ===============================
INSERT INTO patients(title_code, first_name, last_name, search_last_name, birth_date, phone, email) VALUES
('patient_title_mr', 'John', 'Doe', 'DOE', '1985-04-12', '+352123456', 'john@example.com');