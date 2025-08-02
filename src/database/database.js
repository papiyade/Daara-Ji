const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

class DaaraDatabase {
    constructor() {
        // Créer le dossier de données s'il n'existe pas
        const dataDir = path.join(__dirname, '../../data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        // Initialiser la base de données
        this.db = new Database(path.join(dataDir, 'daara.db'));
        this.db.pragma('journal_mode = WAL');
        this.db.pragma('foreign_keys = ON');
        
        this.initializeDatabase();
        this.prepareStatements();
    }

    initializeDatabase() {
        // Lire et exécuter le schéma SQL
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        this.db.exec(schema);
    }

    prepareStatements() {
        // Préparer les requêtes fréquemment utilisées
        this.statements = {
            // Pensionnaires
            getPensionnaires: this.db.prepare('SELECT * FROM pensionnaires WHERE actif = 1 ORDER BY nom, prenom'),
            getPensionnaireById: this.db.prepare('SELECT * FROM pensionnaires WHERE id = ?'),
            addPensionnaire: this.db.prepare(`
                INSERT INTO pensionnaires (
                    prenom, nom, date_naissance, lieu_naissance, adresse, section, type_pensionnaire,
                    prenom_pere, tel_pere, prenom_mere, nom_mere, tel_mere, encadreur, tel_encadreur,
                    est_scolarise, langue_scolarisation, niveau_etudes, ecole_frequentee,
                    a_maladie, maladie_description, suit_traitement, participation_somme
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `),
            updatePensionnaire: this.db.prepare(`
                UPDATE pensionnaires SET
                    prenom = ?, nom = ?, date_naissance = ?, lieu_naissance = ?, adresse = ?, 
                    section = ?, type_pensionnaire = ?, prenom_pere = ?, tel_pere = ?, 
                    prenom_mere = ?, nom_mere = ?, tel_mere = ?, encadreur = ?, tel_encadreur = ?,
                    est_scolarise = ?, langue_scolarisation = ?, niveau_etudes = ?, ecole_frequentee = ?,
                    a_maladie = ?, maladie_description = ?, suit_traitement = ?, participation_somme = ?
                WHERE id = ?
            `),
            deletePensionnaire: this.db.prepare('UPDATE pensionnaires SET actif = 0 WHERE id = ?'),

            // Présences
            getPresencesByDate: this.db.prepare(`
                SELECT p.*, pen.prenom, pen.nom, pen.section 
                FROM presences p
                JOIN pensionnaires pen ON p.pensionnaire_id = pen.id
                WHERE p.date_presence = ? AND pen.actif = 1
                ORDER BY pen.section, pen.nom, pen.prenom
            `),
            savePresence: this.db.prepare(`
                INSERT OR REPLACE INTO presences (pensionnaire_id, date_presence, statut, remarques)
                VALUES (?, ?, ?, ?)
            `),

            // Commissions
            getCommissions: this.db.prepare('SELECT * FROM commissions ORDER BY nom'),
            getMembresCommission: this.db.prepare(`
                SELECT mc.*, p.prenom, p.nom, p.section, c.nom as commission_nom
                FROM membres_commissions mc
                JOIN pensionnaires p ON mc.pensionnaire_id = p.id
                JOIN commissions c ON mc.commission_id = c.id
                WHERE mc.commission_id = ? AND mc.actif = 1 AND p.actif = 1
                ORDER BY p.nom, p.prenom
            `),

            // Statistiques
            countPensionnaires: this.db.prepare('SELECT COUNT(*) as total FROM pensionnaires WHERE actif = 1'),
            countBySection: this.db.prepare(`
                SELECT section, COUNT(*) as total 
                FROM pensionnaires 
                WHERE actif = 1 
                GROUP BY section
            `),
            countByType: this.db.prepare(`
                SELECT type_pensionnaire, COUNT(*) as total 
                FROM pensionnaires 
                WHERE actif = 1 
                GROUP BY type_pensionnaire
            `),

            // Alertes
            getActiveAlerts: this.db.prepare(`
                SELECT a.*, p.prenom, p.nom, p.section
                FROM alertes a
                JOIN pensionnaires p ON a.pensionnaire_id = p.id
                WHERE a.resolue = 0 AND p.actif = 1
                ORDER BY a.date_alerte DESC
            `),
            addAlert: this.db.prepare(`
                INSERT INTO alertes (pensionnaire_id, type_alerte, message, date_alerte)
                VALUES (?, ?, ?, ?)
            `)
        };
    }

    // Méthodes pour les pensionnaires
    getPensionnaires() {
        return this.statements.getPensionnaires.all();
    }

    getPensionnaireById(id) {
        return this.statements.getPensionnaireById.get(id);
    }

    addPensionnaire(pensionnaire) {
        const result = this.statements.addPensionnaire.run(
            pensionnaire.prenom, pensionnaire.nom, pensionnaire.date_naissance,
            pensionnaire.lieu_naissance, pensionnaire.adresse, pensionnaire.section,
            pensionnaire.type_pensionnaire, pensionnaire.prenom_pere, pensionnaire.tel_pere,
            pensionnaire.prenom_mere, pensionnaire.nom_mere, pensionnaire.tel_mere,
            pensionnaire.encadreur, pensionnaire.tel_encadreur, pensionnaire.est_scolarise,
            pensionnaire.langue_scolarisation, pensionnaire.niveau_etudes, pensionnaire.ecole_frequentee,
            pensionnaire.a_maladie, pensionnaire.maladie_description, pensionnaire.suit_traitement,
            pensionnaire.participation_somme
        );
        return result.lastInsertRowid;
    }

    updatePensionnaire(id, pensionnaire) {
        return this.statements.updatePensionnaire.run(
            pensionnaire.prenom, pensionnaire.nom, pensionnaire.date_naissance,
            pensionnaire.lieu_naissance, pensionnaire.adresse, pensionnaire.section,
            pensionnaire.type_pensionnaire, pensionnaire.prenom_pere, pensionnaire.tel_pere,
            pensionnaire.prenom_mere, pensionnaire.nom_mere, pensionnaire.tel_mere,
            pensionnaire.encadreur, pensionnaire.tel_encadreur, pensionnaire.est_scolarise,
            pensionnaire.langue_scolarisation, pensionnaire.niveau_etudes, pensionnaire.ecole_frequentee,
            pensionnaire.a_maladie, pensionnaire.maladie_description, pensionnaire.suit_traitement,
            pensionnaire.participation_somme, id
        );
    }

    deletePensionnaire(id) {
        return this.statements.deletePensionnaire.run(id);
    }

    // Méthodes pour les présences
    getPresences(date) {
        return this.statements.getPresencesByDate.all(date);
    }

    savePresence(presence) {
        return this.statements.savePresence.run(
            presence.pensionnaire_id,
            presence.date_presence,
            presence.statut,
            presence.remarques || null
        );
    }

    // Méthodes pour les commissions
    getCommissions() {
        const commissions = this.statements.getCommissions.all();
        return commissions.map(commission => ({
            ...commission,
            membres: this.statements.getMembresCommission.all(commission.id)
        }));
    }

    // Méthodes pour les statistiques du dashboard
    getDashboardStats() {
        const totalPensionnaires = this.statements.countPensionnaires.get().total;
        const parSection = this.statements.countBySection.all();
        const parType = this.statements.countByType.all();
        
        // Statistiques de présence pour aujourd'hui
        const today = new Date().toISOString().split('T')[0];
        const presencesToday = this.getPresences(today);
        const presents = presencesToday.filter(p => p.statut === 'Présent').length;
        const absents = presencesToday.filter(p => p.statut === 'Absent').length;

        return {
            totalPensionnaires,
            parSection,
            parType,
            presencesToday: {
                presents,
                absents,
                total: presents + absents
            }
        };
    }

    // Méthodes pour les alertes
    getAlerts() {
        return this.statements.getActiveAlerts.all();
    }

    checkAbsenceAlerts() {
        // Vérifier les absences répétées (3 fois dans une semaine)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const weekAgoStr = oneWeekAgo.toISOString().split('T')[0];
        const today = new Date().toISOString().split('T')[0];

        const absencesQuery = this.db.prepare(`
            SELECT pensionnaire_id, COUNT(*) as absences, p.prenom, p.nom
            FROM presences pr
            JOIN pensionnaires p ON pr.pensionnaire_id = p.id
            WHERE pr.statut = 'Absent' 
            AND pr.date_presence BETWEEN ? AND ?
            AND p.actif = 1
            GROUP BY pensionnaire_id
            HAVING absences >= 3
        `);

        const pensionnairesAbsents = absencesQuery.all(weekAgoStr, today);

        // Créer des alertes pour les pensionnaires avec trop d'absences
        pensionnairesAbsents.forEach(pensionnaire => {
            const existingAlert = this.db.prepare(`
                SELECT id FROM alertes 
                WHERE pensionnaire_id = ? 
                AND type_alerte = 'absence_repetee' 
                AND date_alerte = ?
                AND resolue = 0
            `).get(pensionnaire.pensionnaire_id, today);

            if (!existingAlert) {
                this.statements.addAlert.run(
                    pensionnaire.pensionnaire_id,
                    'absence_repetee',
                    `${pensionnaire.prenom} ${pensionnaire.nom} a été absent ${pensionnaire.absences} fois cette semaine`,
                    today
                );
            }
        });

        return pensionnairesAbsents;
    }

    // Méthode générique pour les requêtes personnalisées
    query(sql, params = []) {
        try {
            const stmt = this.db.prepare(sql);
            if (sql.trim().toLowerCase().startsWith('select')) {
                return stmt.all(params);
            } else {
                return stmt.run(params);
            }
        } catch (error) {
            console.error('Database query error:', error);
            throw error;
        }
    }

    // Fermer la base de données
    close() {
        if (this.db) {
            this.db.close();
        }
    }
}

module.exports = DaaraDatabase;

