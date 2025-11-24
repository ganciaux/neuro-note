-- ===============================
-- ENUM TYPES VALUES
-- ===============================
INSERT INTO enum_types(type, code, short_code, label) VALUES
('user_role', 'user_role_admin', 'admin', 'Administrator'),
('user_role', 'user_role_staff', 'staff', 'Staff'),
('patient_title', 'patient_title_mr', 'mr', 'Monsieur'),
('patient_title', 'patient_title_mrs', 'mrs', 'Madame'),
('patient_title', 'patient_title_ms', 'ms', 'Mademoiselle'),
('address_entity', 'address_entity_user', 'user', 'Utilisateur'),
('address_entity', 'address_entity_patient', 'patient', 'Patient'),
('address_type', 'address_type_home', 'home', 'Domicile'),
('address_type', 'address_type_work', 'work', 'Travail'),
('address_country', 'address_country_lu', 'lu', 'Luxembourg'),
('address_country', 'address_country_fr', 'fr', 'France'),
('address_country', 'address_country_be', 'be', 'Belgique');

-- ===============================
-- USERS
-- ===============================
INSERT INTO users(email, slug, password_hash, role_code, full_name) VALUES
('admin@example.com', 'admin-0000', 'hash1', 'user_role_admin', 'Admin User');

-- ===============================
-- PATIENTS
-- ===============================
INSERT INTO patients(title_code, first_name, last_name, search_name, slug, birth_date, phone, email) VALUES
('patient_title_mr', 'John', 'Doe', 'johndoe', 'john-doe', '1985-04-12', '+352123456', 'john@example.com');