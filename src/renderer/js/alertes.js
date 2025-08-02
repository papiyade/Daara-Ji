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
            // Charger les alertes existantes
            this.alertes = window.dataStorage.getAllAlertes();
            
            // Vérifier et générer de nouvelles alertes pour les absences répétées
            await this.checkAbsencesRepetees();
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
                        // Vérifier si une alerte similaire n'existe pas déjà
                        const alerteExistante = this.alertes.find(a => 
                            a.pensionnaire_id == pensionnaireId && 
                            a.type === 'absence_repetee' &&
                            !a.resolu
                        );
                        
                        if (!alerteExistante) {
                            const nouvelleAlerte = {
                                id: Date.now() + Math.random(),
                                pensionnaire_id: pensionnaireId,
                                prenom: pensionnaire.prenom,
                                nom: pensionnaire.nom,
                                section: pensionnaire.section,
                                type: 'absence_repetee',
                                message: `${absences.length} absences cette semaine (${absences.join(', ')})`,
                                date_alerte: new Date().toISOString().split('T')[0],
                                lu: false,
                                resolu: false,
                                priorite: 'haute'
                            };
                            
                            window.dataStorage.addAlerte(nouvelleAlerte);
                            this.alertes.push(nouvelleAlerte);
                        }
                    }
                }
            });
            
        } catch (error) {
            console.error('Erreur lors de la vérification des absences:', error);
        }
    }

    generateHTML() {
        return `
            <div class="space-y-6">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900">Alertes et Notifications</h3>
                        <p class="text-sm text-gray-600">${this.alertes.length} alerte(s) active(s)</p>
                    </div>
                </div>

                ${this.alertes.length === 0 ? `
                    <div class="card text-center py-12">
                        <div class="text-success-500 text-6xl mb-4">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h3 class="text-xl text-gray-700 mb-2">Aucune alerte</h3>
                        <p class="text-gray-500">Toutes les alertes ont été résolues</p>
                    </div>
                ` : `
                    <div class="space-y-4">
                        ${this.alertes.map(alerte => this.generateAlerteCard(alerte)).join('')}
                    </div>
                `}
            </div>
        `;
    }

    generateAlerteCard(alerte) {
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
                                ${alerte.prenom} ${alerte.nom}
                            </h4>
                            <p class="text-gray-600 mb-2">${alerte.message}</p>
                            <div class="flex items-center text-sm text-gray-500">
                                <i class="fas fa-calendar mr-1"></i>
                                ${Utils.formatDate(alerte.date_alerte)}
                                <span class="mx-2">•</span>
                                <span class="badge badge-info">${alerte.section}</span>
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
        const alertesActives = this.alertes.filter(a => !a.resolu);
        
        if (badge) {
            if (alertesActives.length > 0) {
                badge.textContent = alertesActives.length;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }
    }

    // Méthode pour créer une alerte manuelle
    async createManualAlert(type, message, pensionnaireId = null) {
        try {
            const pensionnaire = pensionnaireId ? 
                window.dataStorage.getAllPensionnaires().find(p => p.id === pensionnaireId) : 
                null;
            
            const nouvelleAlerte = {
                id: Date.now() + Math.random(),
                pensionnaire_id: pensionnaireId,
                prenom: pensionnaire ? pensionnaire.prenom : '',
                nom: pensionnaire ? pensionnaire.nom : '',
                section: pensionnaire ? pensionnaire.section : '',
                type: type,
                message: message,
                date_alerte: new Date().toISOString().split('T')[0],
                lu: false,
                resolu: false,
                priorite: 'normale'
            };
            
            window.dataStorage.addAlerte(nouvelleAlerte);
            this.alertes.push(nouvelleAlerte);
            
            Utils.showToast('Alerte créée avec succès', 'success');
            
            // Recharger la page
            const container = document.getElementById('page-content');
            await this.render(container);
            
            this.updateAlerteBadge();
        } catch (error) {
            console.error('Erreur lors de la création de l\'alerte:', error);
            Utils.showToast('Erreur lors de la création de l\'alerte', 'error');
        }
    }
}

// Créer une instance globale
window.alertes = new Alertes();
