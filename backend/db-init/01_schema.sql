-- Création d'une table utilisateur
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Création d'une table notes
CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insérer quelques valeurs par défaut
INSERT INTO users (name, email) VALUES
('Alice', 'alice@test.com'),
('Bob', 'bob@test.com');

INSERT INTO notes (user_id, title, content) VALUES
(1, 'Première note', 'Contenu de la première note'),
(2, 'Deuxième note', 'Contenu de la deuxième note');
