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
            this.alertes = window.dataStorage.getAllAlertes();
        } catch (error) {
            console.error('Erreur lors du chargement des alertes:', error);
            this.alertes = [];
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
        // TODO: Implémenter le marquage comme lu
        Utils.showToast('Alerte marquée comme lue', 'success');
    }

    async resolveAlert(alerteId) {
        // TODO: Implémenter la résolution d'alerte
        Utils.showToast('Alerte résolue', 'success');
        await this.loadAlertes();
        const container = document.getElementById('page-content');
        await this.render(container);
    }
}

// Créer une instance globale
window.Alertes = new Alertes();
