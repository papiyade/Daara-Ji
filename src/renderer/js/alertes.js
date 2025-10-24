// Module Alertes - Gestion des alertes et notifications

class Alertes {
    constructor() {
        this.alertes = [];
    }

    async render(container) {
        try {
            await this.loadAlertes();
            container.innerHTML = this.generateHTML();
        } catch (error) {
            Utils.handleError(error, 'lors du chargement des alertes');
        }
    }

    async loadAlertes() {
        try {
            // Vérifier et générer de nouvelles alertes pour les absences répétées
            await this.checkAbsencesRepetees();
            
            // Charger les alertes existantes (non résolues)
            this.alertes = window.dataStorage.getUnresolvedAlertes();
            
            // Mettre à jour le badge
            this.updateAlerteBadge();
        } catch (error) {
            console.error('Erreur lors du chargement des alertes:', error);
            this.alertes = [];
        }
    }

    async checkAbsencesRepetees() {
        try {
            const pensionnaires = window.dataStorage.getAllPensionnaires();
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 7); // Dernière semaine
            
            const presences = window.dataStorage.getPresencesByDateRange(
                startDate.toISOString().split('T')[0],
                endDate.toISOString().split('T')[0]
            );
            
            // Analyser les absences par pensionnaire
            const absencesByPensionnaire = {};
            
            presences.forEach(p => {
                if (p.statut === 'Absent') {
                    if (!absencesByPensionnaire[p.pensionnaire_id]) {
                        absencesByPensionnaire[p.pensionnaire_id] = [];
                    }
                    absencesByPensionnaire[p.pensionnaire_id].push(p.date_presence);
                }
            });
            
            // Générer des alertes pour ceux qui ont 3 absences ou plus dans la semaine
            Object.keys(absencesByPensionnaire).forEach(pensionnaireId => {
                const absences = absencesByPensionnaire[pensionnaireId];
                if (absences.length >= 3) {
                    const pensionnaire = pensionnaires.find(p => p.id == pensionnaireId);
                    if (pensionnaire) {
                        // Créer une nouvelle alerte (la méthode createAlert vérifie déjà les doublons)
                        const nouvelleAlerte = {
                            pensionnaire_id: parseInt(pensionnaireId),
                            prenom: pensionnaire.prenom,
                            nom: pensionnaire.nom,
                            section: pensionnaire.section,
                            type: 'absence_repetee',
                            message: `${absences.length} absences cette semaine (${absences.join(', ')})`,
                            date_alerte: new Date().toISOString().split('T')[0],
                            lu: false,
                            priorite: 'haute'
                        };
                        
                        // La méthode createAlert gère automatiquement les doublons
                        const alerteCreee = window.dataStorage.createAlert(nouvelleAlerte);
                        
                        // Si une nouvelle alerte a été créée, l'ajouter à la liste locale
                        if (alerteCreee && !this.alertes.find(a => a.id === alerteCreee.id)) {
                            // Ajouter les propriétés manquantes pour l'affichage
                            alerteCreee.prenom = pensionnaire.prenom;
                            alerteCreee.nom = pensionnaire.nom;
                            alerteCreee.section = pensionnaire.section;
                        }
                    }
                }
            });
            
        } catch (error) {
            console.error('Erreur lors de la vérification des absences:', error);
        }
    }

    generateHTML() {
        // Filtrer les alertes non résolues pour l'affichage
        const alertesActives = this.alertes.filter(a => !a.resolved);
        
        return `
            <div class="space-y-6">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900">Alertes et Notifications</h3>
                        <p class="text-sm text-gray-600">${alertesActives.length} alerte(s) active(s)</p>
                    </div>
                    <button onclick="alertes.refreshAlertes()" class="btn-outline btn-sm">
                        <i class="fas fa-sync-alt mr-2"></i>Actualiser
                    </button>
                </div>

                ${alertesActives.length === 0 ? `
                    <div class="card text-center py-12">
                        <div class="text-success-500 text-6xl mb-4">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h3 class="text-xl text-gray-700 mb-2">Aucune alerte</h3>
                        <p class="text-gray-500">Toutes les alertes ont été résolues</p>
                    </div>
                ` : `
                    <div class="space-y-4">
                        ${alertesActives.map(alerte => this.generateAlerteCard(alerte)).join('')}
                    </div>
                `}
            </div>
        `;
    }

    generateAlerteCard(alerte) {
        // Récupérer les informations du pensionnaire si elles ne sont pas présentes
        let pensionnaire = null;
        if (alerte.pensionnaire_id) {
            pensionnaire = window.dataStorage.getPensionnaireById(alerte.pensionnaire_id);
        }
        
        const prenom = alerte.prenom || (pensionnaire ? pensionnaire.prenom : 'Inconnu');
        const nom = alerte.nom || (pensionnaire ? pensionnaire.nom : '');
        const section = alerte.section || (pensionnaire ? pensionnaire.section : 'Non définie');
        
        return `
            <div class="card border-l-4 border-warning-400">
                <div class="flex items-start justify-between">
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <div class="w-10 h-10 bg-warning-100 rounded-full flex items-center justify-center">
                                <i class="fas fa-exclamation-triangle text-warning-600"></i>
                            </div>
                        </div>
                        <div class="ml-4">
                            <h4 class="text-lg font-medium text-gray-900">
                                ${prenom} ${nom}
                            </h4>
                            <p class="text-gray-600 mb-2">${alerte.message}</p>
                            <div class="flex items-center text-sm text-gray-500">
                                <i class="fas fa-calendar mr-1"></i>
                                ${Utils.formatDate(alerte.date_alerte)}
                                <span class="mx-2">•</span>
                                <span class="badge badge-info">${section}</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="alertes.markAsRead(${alerte.id})" 
                                class="text-primary-600 hover:text-primary-800" title="Marquer comme lu">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="alertes.resolveAlert(${alerte.id})" 
                                class="text-success-600 hover:text-success-800" title="Résoudre">
                            <i class="fas fa-check"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    async markAsRead(alerteId) {
        try {
            window.dataStorage.markAlerteAsRead(alerteId);
            
            // Mettre à jour l'alerte dans la liste locale
            const alerte = this.alertes.find(a => a.id === alerteId);
            if (alerte) {
                alerte.lu = true;
            }
            
            Utils.showToast('Alerte marquée comme lue', 'success');
            
            // Recharger la page pour refléter les changements
            const container = document.getElementById('page-content');
            await this.render(container);
        } catch (error) {
            console.error('Erreur lors du marquage de l\'alerte:', error);
            Utils.showToast('Erreur lors du marquage de l\'alerte', 'error');
        }
    }

    async resolveAlert(alerteId) {
        try {
            window.dataStorage.resolveAlerte(alerteId);
            
            // Retirer l'alerte de la liste locale
            this.alertes = this.alertes.filter(a => a.id !== alerteId);
            
            Utils.showToast('Alerte résolue', 'success');
            
            // Recharger la page pour refléter les changements
            const container = document.getElementById('page-content');
            await this.render(container);
            
            // Mettre à jour le badge d'alertes dans la sidebar
            this.updateAlerteBadge();
        } catch (error) {
            console.error('Erreur lors de la résolution de l\'alerte:', error);
            Utils.showToast('Erreur lors de la résolution de l\'alerte', 'error');
        }
    }

    updateAlerteBadge() {
        const badge = document.getElementById('alertes-badge');
        const alertesActives = this.alertes.filter(a => !a.resolved);
        
        if (badge) {
            if (alertesActives.length > 0) {
                badge.textContent = alertesActives.length;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }
    }

    // Méthode pour actualiser les alertes
    async refreshAlertes() {
        try {
            Utils.showLoading();
            await this.loadAlertes();
            
            // Recharger la page
            const container = document.getElementById('page-content');
            await this.render(container);
            
            Utils.showToast('Alertes actualisées', 'success');
        } catch (error) {
            console.error('Erreur lors de l\'actualisation des alertes:', error);
            Utils.showToast('Erreur lors de l\'actualisation des alertes', 'error');
        } finally {
            Utils.hideLoading();
        }
    }

    // Méthode pour créer une alerte manuelle
    async createManualAlert(type, message, pensionnaireId = null) {
        try {
            const pensionnaire = pensionnaireId ? 
                window.dataStorage.getAllPensionnaires().find(p => p.id === pensionnaireId) : 
                null;
            
            const nouvelleAlerte = {
                pensionnaire_id: pensionnaireId,
                prenom: pensionnaire ? pensionnaire.prenom : '',
                nom: pensionnaire ? pensionnaire.nom : '',
                section: pensionnaire ? pensionnaire.section : '',
                type: type,
                message: message,
                date_alerte: new Date().toISOString().split('T')[0],
                lu: false,
                priorite: 'normale'
            };
            
            const alerteCreee = window.dataStorage.createAlert(nouvelleAlerte);
            
            if (alerteCreee) {
                Utils.showToast('Alerte créée avec succès', 'success');
                
                // Recharger la page
                const container = document.getElementById('page-content');
                await this.render(container);
                
                this.updateAlerteBadge();
            }
        } catch (error) {
            console.error('Erreur lors de la création de l\'alerte:', error);
            Utils.showToast('Erreur lors de la création de l\'alerte', 'error');
        }
    }
}

// Créer une instance globale
window.alertes = new Alertes();
