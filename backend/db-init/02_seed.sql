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
('address_country', 'address_country_be', 'be', 'Belgique'),
('service_category', 'service_category_consult', 'consult', 'Consultation'),
('service_category', 'service_category_bilan', 'bilan', 'Bilan');

-- ============================================
-- ENTITY MAPPING
-- ============================================
INSERT INTO entity_mapping(code, table_name) VALUES
('address_entity_patient', 'patients'),
('address_entity_user', 'users');
