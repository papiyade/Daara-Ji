-- Schéma de base de données pour Daara Re-Creation Manager

-- Table des pensionnaires
CREATE TABLE IF NOT EXISTS pensionnaires (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prenom TEXT NOT NULL,
    nom TEXT NOT NULL,
    date_naissance DATE,
    lieu_naissance TEXT,
    adresse TEXT,
    section TEXT NOT NULL CHECK (section IN ('Rawda', '1ère section', '2ème section', '3ème section')),
    type_pensionnaire TEXT NOT NULL CHECK (type_pensionnaire IN ('Membre', 'Sympathisant')),
    prenom_pere TEXT,
    tel_pere TEXT,
    prenom_mere TEXT,
    nom_mere TEXT,
    tel_mere TEXT,
    encadreur TEXT,
    tel_encadreur TEXT,
    est_scolarise BOOLEAN DEFAULT 0,
    langue_scolarisation TEXT CHECK (langue_scolarisation IN ('Arabe', 'Français', NULL)),
    niveau_etudes TEXT,
    ecole_frequentee TEXT,
    a_maladie BOOLEAN DEFAULT 0,
    maladie_description TEXT,
    suit_traitement TEXT,
    participation_somme DECIMAL(10,2),
    date_inscription DATETIME DEFAULT CURRENT_TIMESTAMP,
    actif BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table des présences/absences
CREATE TABLE IF NOT EXISTS presences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pensionnaire_id INTEGER NOT NULL,
    date_presence DATE NOT NULL,
    statut TEXT NOT NULL CHECK (statut IN ('Présent', 'Absent', 'Excusé')),
    remarques TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pensionnaire_id) REFERENCES pensionnaires(id) ON DELETE CASCADE,
    UNIQUE(pensionnaire_id, date_presence)
);

-- Table des commissions
CREATE TABLE IF NOT EXISTS commissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL UNIQUE,
    description TEXT,
    acronyme TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table des membres de commissions
CREATE TABLE IF NOT EXISTS membres_commissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    commission_id INTEGER NOT NULL,
    pensionnaire_id INTEGER NOT NULL,
    poste TEXT,
    date_nomination DATE DEFAULT CURRENT_DATE,
    actif BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (commission_id) REFERENCES commissions(id) ON DELETE CASCADE,
    FOREIGN KEY (pensionnaire_id) REFERENCES pensionnaires(id) ON DELETE CASCADE,
    UNIQUE(commission_id, pensionnaire_id)
);

-- Table des alertes
CREATE TABLE IF NOT EXISTS alertes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pensionnaire_id INTEGER NOT NULL,
    type_alerte TEXT NOT NULL,
    message TEXT NOT NULL,
    date_alerte DATE NOT NULL,
    vue BOOLEAN DEFAULT 0,
    resolue BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pensionnaire_id) REFERENCES pensionnaires(id) ON DELETE CASCADE
);

-- Insertion des commissions par défaut
INSERT OR IGNORE INTO commissions (nom, description, acronyme) VALUES
('Commission de l''Intelligence et de la Perception Spirituelle', 'Commission chargée de l''intelligence et de la perception spirituelle', 'CIPS'),
('Commission Administrative', 'Commission chargée de l''administration générale', 'CA'),
('Commission de Trésor et Capacitation', 'Commission chargée du trésor et de la capacitation', 'CTC'),
('Commission Logistique', 'Commission chargée de la logistique', 'CL'),
('Points Focaux', 'Points focaux du Daara', 'PF');

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_pensionnaires_section ON pensionnaires(section);
CREATE INDEX IF NOT EXISTS idx_pensionnaires_type ON pensionnaires(type_pensionnaire);
CREATE INDEX IF NOT EXISTS idx_presences_date ON presences(date_presence);
CREATE INDEX IF NOT EXISTS idx_presences_pensionnaire ON presences(pensionnaire_id);
CREATE INDEX IF NOT EXISTS idx_alertes_date ON alertes(date_alerte);
CREATE INDEX IF NOT EXISTS idx_alertes_vue ON alertes(vue);

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER IF NOT EXISTS update_pensionnaires_updated_at 
    AFTER UPDATE ON pensionnaires
    BEGIN
        UPDATE pensionnaires SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_commissions_updated_at 
    AFTER UPDATE ON commissions
    BEGIN
        UPDATE commissions SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

