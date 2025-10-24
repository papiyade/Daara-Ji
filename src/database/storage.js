/**
 * Gestionnaire de stockage local pour l'application Daara Re-Creation
 * Utilise LocalStorage pour persister les données sans dépendances natives
 */

class DataStorage {
    constructor() {
        this.storageKeys = {
            pensionnaires: 'daara_pensionnaires',
            commissions: 'daara_commissions',
            presences: 'daara_presences',
            alertes: 'daara_alertes',
            settings: 'daara_settings'
        };
        
        // Initialiser les données par défaut
        this.initializeDefaultData();
    }

    /**
     * Initialise les données par défaut si elles n'existent pas
     */
    initializeDefaultData() {
        try {
            // Créer les commissions par défaut si elles n'existent pas
            if (!this.getItem(this.storageKeys.commissions)) {
            const defaultCommissions = [
                {
                    id: 1,
                    nom: 'CIPS',
                    nom_complet: 'Commission de l\'Intelligence et de la Perception Spirituelle',
                    description: 'Responsable de l\'éducation spirituelle et intellectuelle',
                    membres: [],
                    created_at: new Date().toISOString()
                },
                {
                    id: 2,
                    nom: 'CA',
                    nom_complet: 'Commission Administrative',
                    description: 'Gestion administrative du Daara',
                    membres: [],
                    created_at: new Date().toISOString()
                },
                {
                    id: 3,
                    nom: 'CTC',
                    nom_complet: 'Commission de Trésor et Capacitation',
                    description: 'Gestion financière et formation',
                    membres: [],
                    created_at: new Date().toISOString()
                },
                {
                    id: 4,
                    nom: 'Commission Logistique',
                    nom_complet: 'Commission Logistique',
                    description: 'Gestion de la logistique et des ressources',
                    membres: [],
                    created_at: new Date().toISOString()
                },
                {
                    id: 5,
                    nom: 'PF',
                    nom_complet: 'Points Focaux',
                    description: 'Coordination et communication',
                    membres: [],
                    created_at: new Date().toISOString()
                }
            ];
            this.setItem(this.storageKeys.commissions, defaultCommissions);
        }

        // Initialiser les autres collections si elles n'existent pas
        if (!this.getItem(this.storageKeys.pensionnaires)) {
            this.setItem(this.storageKeys.pensionnaires, []);
        }
        if (!this.getItem(this.storageKeys.presences)) {
            this.setItem(this.storageKeys.presences, []);
        }
        if (!this.getItem(this.storageKeys.alertes)) {
            this.setItem(this.storageKeys.alertes, []);
        }
            if (!this.getItem(this.storageKeys.settings)) {
                this.setItem(this.storageKeys.settings, {
                    initialized: true,
                    version: '1.0.0',
                    created_at: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error('Erreur lors de l\'initialisation des données par défaut:', error);
            // Essayer de récupérer en mode dégradé
            this.initializeFallbackData();
        }
    }
    
    /**
     * Initialisation en mode dégradé si localStorage échoue
     */
    initializeFallbackData() {
        try {
            // Vérifier si localStorage est disponible
            if (typeof Storage !== "undefined") {
                localStorage.setItem('test', 'test');
                localStorage.removeItem('test');
            } else {
                console.warn('LocalStorage non disponible, utilisation de la mémoire temporaire');
                // Utiliser un objet en mémoire comme fallback
                this.memoryStorage = {};
            }
        } catch (error) {
            console.warn('LocalStorage non accessible, utilisation de la mémoire temporaire');
            this.memoryStorage = {};
        }
    }

    /**
     * Récupère un élément du localStorage
     */
    getItem(key) {
        try {
            if (this.memoryStorage) {
                return this.memoryStorage[key] || null;
            }
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Erreur lors de la lecture du localStorage:', error);
            return null;
        }
    }

    /**
     * Sauvegarde un élément dans le localStorage
     */
    setItem(key, value) {
        try {
            if (this.memoryStorage) {
                this.memoryStorage[key] = value;
                return true;
            }
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Erreur lors de l\'écriture dans le localStorage:', error);
            return false;
        }
    }

    /**
     * Génère un nouvel ID unique
     */
    generateId(collection) {
        const items = this.getItem(collection) || [];
        return items.length > 0 ? Math.max(...items.map(item => item.id || 0)) + 1 : 1;
    }

    // ==================== PENSIONNAIRES ====================

    /**
     * Récupère tous les pensionnaires
     */
    getAllPensionnaires() {
        return this.getItem(this.storageKeys.pensionnaires) || [];
    }

    /**
     * Récupère un pensionnaire par ID
     */
    getPensionnaireById(id) {
        const pensionnaires = this.getAllPensionnaires();
        return pensionnaires.find(p => p.id === parseInt(id));
    }

    /**
     * Ajoute un nouveau pensionnaire
     */
    addPensionnaire(pensionnaire) {
        const pensionnaires = this.getAllPensionnaires();
        const newPensionnaire = {
            ...pensionnaire,
            id: this.generateId(this.storageKeys.pensionnaires),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        pensionnaires.push(newPensionnaire);
        this.setItem(this.storageKeys.pensionnaires, pensionnaires);
        return newPensionnaire;
    }

    /**
     * Met à jour un pensionnaire
     */
    updatePensionnaire(id, updates) {
        const pensionnaires = this.getAllPensionnaires();
        const index = pensionnaires.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            pensionnaires[index] = {
                ...pensionnaires[index],
                ...updates,
                updated_at: new Date().toISOString()
            };
            this.setItem(this.storageKeys.pensionnaires, pensionnaires);
            return pensionnaires[index];
        }
        return null;
    }

    /**
     * Supprime un pensionnaire
     */
    deletePensionnaire(id) {
        const pensionnaires = this.getAllPensionnaires();
        const filteredPensionnaires = pensionnaires.filter(p => p.id !== parseInt(id));
        this.setItem(this.storageKeys.pensionnaires, filteredPensionnaires);
        return filteredPensionnaires.length < pensionnaires.length;
    }

    /**
     * Recherche des pensionnaires
     */
    searchPensionnaires(query, filters = {}) {
        let pensionnaires = this.getAllPensionnaires();

        // Filtrage par texte
        if (query) {
            const searchTerm = query.toLowerCase();
            pensionnaires = pensionnaires.filter(p => 
                p.prenom?.toLowerCase().includes(searchTerm) ||
                p.nom?.toLowerCase().includes(searchTerm) ||
                p.adresse?.toLowerCase().includes(searchTerm)
            );
        }

        // Filtrage par section
        if (filters.section) {
            pensionnaires = pensionnaires.filter(p => p.section === filters.section);
        }

        // Filtrage par type
        if (filters.type) {
            pensionnaires = pensionnaires.filter(p => p.type === filters.type);
        }

        return pensionnaires;
    }

    // ==================== COMMISSIONS ====================

    /**
     * Récupère toutes les commissions
     */
    getAllCommissions() {
        return this.getItem(this.storageKeys.commissions) || [];
    }

    /**
     * Récupère une commission par ID
     */
    getCommissionById(id) {
        const commissions = this.getAllCommissions();
        return commissions.find(c => c.id === parseInt(id));
    }

    /**
     * Ajoute un membre à une commission
     */
    addMembreCommission(commissionId, membre) {
        const commissions = this.getAllCommissions();
        const commission = commissions.find(c => c.id === parseInt(commissionId));
        if (commission) {
            if (!commission.membres) commission.membres = [];
            const newMembre = {
                id: Date.now(), // ID temporaire basé sur timestamp
                ...membre,
                added_at: new Date().toISOString()
            };
            commission.membres.push(newMembre);
            this.setItem(this.storageKeys.commissions, commissions);
            return newMembre;
        }
        return null;
    }

    /**
     * Supprime un membre d'une commission
     */
    removeMembreCommission(commissionId, membreId) {
        const commissions = this.getAllCommissions();
        const commission = commissions.find(c => c.id === parseInt(commissionId));
        if (commission && commission.membres) {
            commission.membres = commission.membres.filter(m => m.id !== parseInt(membreId));
            this.setItem(this.storageKeys.commissions, commissions);
            return true;
        }
        return false;
    }

    /**
     * Ajoute un membre à une commission (alias pour compatibilité)
     */
    addCommissionMember(commissionId, membre) {
        return this.addMembreCommission(commissionId, membre);
    }

    /**
     * Supprime un membre d'une commission (alias pour compatibilité)
     */
    removeCommissionMember(commissionId, membreId) {
        return this.removeMembreCommission(commissionId, membreId);
    }

    /**
     * Met à jour un membre d'une commission
     */
    updateCommissionMember(commissionId, membreId, memberData) {
        const commissions = this.getAllCommissions();
        const commission = commissions.find(c => c.id === parseInt(commissionId));
        if (commission && commission.membres) {
            const membreIndex = commission.membres.findIndex(m => m.id === parseInt(membreId));
            if (membreIndex !== -1) {
                commission.membres[membreIndex] = {
                    ...commission.membres[membreIndex],
                    ...memberData,
                    updated_at: new Date().toISOString()
                };
                this.setItem(this.storageKeys.commissions, commissions);
                return commission.membres[membreIndex];
            }
        }
        return null;
    }

    // ==================== PRESENCES ====================

    /**
     * Récupère les présences pour une date donnée
     */
    getPresencesByDate(date) {
        const presences = this.getItem(this.storageKeys.presences) || [];
        return presences.filter(p => p.date === date);
    }

    /**
     * Marque la présence d'un pensionnaire
     */
    markPresence(pensionnaireId, date, statut, section) {
        const presences = this.getItem(this.storageKeys.presences) || [];
        
        // Vérifier si une présence existe déjà pour ce pensionnaire à cette date
        const existingIndex = presences.findIndex(p => 
            p.pensionnaire_id === parseInt(pensionnaireId) && p.date === date
        );

        const presenceData = {
            pensionnaire_id: parseInt(pensionnaireId),
            date: date,
            statut: statut,
            section: section,
            marked_at: new Date().toISOString()
        };

        if (existingIndex !== -1) {
            // Mettre à jour la présence existante
            presences[existingIndex] = { ...presences[existingIndex], ...presenceData };
        } else {
            // Créer une nouvelle présence
            presenceData.id = this.generateId(this.storageKeys.presences);
            presences.push(presenceData);
        }

        this.setItem(this.storageKeys.presences, presences);
        
        // Vérifier les alertes d'absence
        this.checkAbsenceAlerts(pensionnaireId);
        
        return presenceData;
    }

    /**
     * Récupère les statistiques de présence
     */
    getPresenceStats(startDate, endDate) {
        const presences = this.getItem(this.storageKeys.presences) || [];
        const filteredPresences = presences.filter(p => 
            p.date >= startDate && p.date <= endDate
        );

        const stats = {
            total: filteredPresences.length,
            presents: filteredPresences.filter(p => p.statut === 'present').length,
            absents: filteredPresences.filter(p => p.statut === 'absent').length,
            excuses: filteredPresences.filter(p => p.statut === 'excuse').length
        };

        return stats;
    }

    // ==================== ALERTES ====================

    /**
     * Vérifie les alertes d'absence pour un pensionnaire
     */
    checkAbsenceAlerts(pensionnaireId) {
        const pensionnaire = this.getPensionnaireById(pensionnaireId);
        if (!pensionnaire) return;

        // Récupérer les présences de la semaine courante
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Lundi
        
        const weekDates = [];
        for (let i = 0; i < 6; i++) { // Lundi à Samedi
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            weekDates.push(date.toISOString().split('T')[0]);
        }

        const presences = this.getItem(this.storageKeys.presences) || [];
        const weekPresences = presences.filter(p => 
            p.pensionnaire_id === parseInt(pensionnaireId) && 
            weekDates.includes(p.date)
        );

        const absences = weekPresences.filter(p => p.statut === 'Absent');

        // Si 3 absences ou plus dans la semaine, créer une alerte
        if (absences.length >= 3) {
            this.createAlert({
                type: 'absence_repetee',
                pensionnaire_id: parseInt(pensionnaireId),
                message: `${pensionnaire.prenom} ${pensionnaire.nom} a été absent ${absences.length} fois cette semaine`,
                severity: 'warning',
                data: {
                    absences_count: absences.length,
                    week_start: weekDates[0],
                    week_end: weekDates[5]
                }
            });
        }
    }

    /**
     * Crée une nouvelle alerte
     */
    createAlert(alertData) {
        const alertes = this.getItem(this.storageKeys.alertes) || [];
        
        // Vérifier si une alerte similaire existe déjà
        const existingAlert = alertes.find(a => 
            a.type === alertData.type && 
            a.pensionnaire_id === alertData.pensionnaire_id &&
            a.resolved === false
        );

        if (!existingAlert) {
            const newAlert = {
                id: this.generateId(this.storageKeys.alertes),
                ...alertData,
                created_at: new Date().toISOString(),
                resolved: false
            };
            alertes.push(newAlert);
            this.setItem(this.storageKeys.alertes, alertes);
            return newAlert;
        }

        return existingAlert;
    }

    /**
     * Récupère toutes les alertes
     */
    getAllAlertes() {
        return this.getItem(this.storageKeys.alertes) || [];
    }

    /**
     * Récupère les alertes non résolues
     */
    getUnresolvedAlertes() {
        const alertes = this.getAllAlertes();
        return alertes.filter(a => !a.resolved);
    }

    /**
     * Marque une alerte comme résolue
     */
    resolveAlert(alertId) {
        const alertes = this.getAllAlertes();
        const alert = alertes.find(a => a.id === parseInt(alertId));
        if (alert) {
            alert.resolved = true;
            alert.resolved_at = new Date().toISOString();
            this.setItem(this.storageKeys.alertes, alertes);
            return alert;
        }
        return null;
    }

    /**
     * Alias pour createAlert (compatibilité)
     */
    addAlerte(alertData) {
        return this.createAlert(alertData);
    }

    /**
     * Alias pour resolveAlert (compatibilité)
     */
    resolveAlerte(alertId) {
        return this.resolveAlert(alertId);
    }

    /**
     * Marque une alerte comme lue
     */
    markAlerteAsRead(alertId) {
        const alertes = this.getAllAlertes();
        const alert = alertes.find(a => a.id === parseInt(alertId));
        if (alert) {
            alert.lu = true;
            alert.read_at = new Date().toISOString();
            this.setItem(this.storageKeys.alertes, alertes);
            return alert;
        }
        return null;
    }

    // ==================== STATISTIQUES ====================

    /**
     * Récupère les statistiques générales
     */
    getGeneralStats() {
        const pensionnaires = this.getAllPensionnaires();
        const commissions = this.getAllCommissions();
        const alertes = this.getUnresolvedAlertes();

        // Statistiques par section
        const sections = ['Rawda', '1ère section', '2ème section', '3ème section'];
        const sectionStats = sections.map(section => ({
            section,
            count: pensionnaires.filter(p => p.section === section).length
        }));

        // Statistiques par type
        const typeStats = [
            { type: 'Membre', count: pensionnaires.filter(p => p.type === 'Membre').length },
            { type: 'Sympathisant', count: pensionnaires.filter(p => p.type === 'Sympathisant').length }
        ];

        return {
            total_pensionnaires: pensionnaires.length,
            total_commissions: commissions.length,
            total_alertes: alertes.length,
            sections: sectionStats,
            types: typeStats
        };
    }

    // ==================== UTILITAIRES ====================

    /**
     * Exporte toutes les données
     */
    exportAllData() {
        return {
            pensionnaires: this.getAllPensionnaires(),
            commissions: this.getAllCommissions(),
            presences: this.getItem(this.storageKeys.presences) || [],
            alertes: this.getAllAlertes(),
            settings: this.getItem(this.storageKeys.settings) || {},
            exported_at: new Date().toISOString()
        };
    }

    /**
     * Importe des données
     */
    importData(data) {
        try {
            if (data.pensionnaires) this.setItem(this.storageKeys.pensionnaires, data.pensionnaires);
            if (data.commissions) this.setItem(this.storageKeys.commissions, data.commissions);
            if (data.presences) this.setItem(this.storageKeys.presences, data.presences);
            if (data.alertes) this.setItem(this.storageKeys.alertes, data.alertes);
            if (data.settings) this.setItem(this.storageKeys.settings, data.settings);
            return true;
        } catch (error) {
            console.error('Erreur lors de l\'importation:', error);
            return false;
        }
    }

    /**
     * Efface toutes les données
     */
    clearAllData() {
        Object.values(this.storageKeys).forEach(key => {
            localStorage.removeItem(key);
        });
        this.initializeDefaultData();
    }
}

// Créer une instance globale
window.dataStorage = new DataStorage();

// Export pour utilisation dans les modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataStorage;
}
