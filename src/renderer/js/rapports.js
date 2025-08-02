// Module Rapports - Génération de rapports et exports

class Rapports {
    constructor() {
        this.pensionnaires = [];
        this.commissions = [];
    }

    async render(container) {
        try {
            await this.loadData();
            container.innerHTML = this.generateHTML();
        } catch (error) {
            Utils.handleError(error, 'lors du chargement des rapports');
        }
    }

    async loadData() {
        try {
            this.pensionnaires = window.dataStorage.getAllPensionnaires();
            this.commissions = window.dataStorage.getAllCommissions();
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
        }
    }

    generateHTML() {
        return `
            <div class="space-y-6">
                <div>
                    <h3 class="text-lg font-semibold text-gray-900">Rapports et Exports</h3>
                    <p class="text-sm text-gray-600">Générer et exporter les données du Daara</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Export Pensionnaires -->
                    <div class="card text-center">
                        <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-users text-primary-600 text-2xl"></i>
                        </div>
                        <h4 class="text-lg font-semibold text-gray-900 mb-2">Liste des Pensionnaires</h4>
                        <p class="text-gray-600 mb-4">Exporter la liste complète des pensionnaires</p>
                        <div class="space-y-2">
                            <button onclick="rapports.exportPensionnairesExcel()" class="btn-primary w-full">
                                <i class="fas fa-file-excel mr-2"></i>Excel
                            </button>
                            <button onclick="rapports.exportPensionnairesPDF()" class="btn-outline w-full">
                                <i class="fas fa-file-pdf mr-2"></i>PDF
                            </button>
                        </div>
                    </div>

                    <!-- Export Présences -->
                    <div class="card text-center">
                        <div class="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-calendar-check text-success-600 text-2xl"></i>
                        </div>
                        <h4 class="text-lg font-semibold text-gray-900 mb-2">Rapport de Présences</h4>
                        <p class="text-gray-600 mb-4">Statistiques et détails des présences</p>
                        <div class="space-y-2">
                            <button onclick="rapports.exportPresencesExcel()" class="btn-success w-full">
                                <i class="fas fa-file-excel mr-2"></i>Excel
                            </button>
                            <button onclick="rapports.exportPresencesPDF()" class="btn-outline w-full">
                                <i class="fas fa-file-pdf mr-2"></i>PDF
                            </button>
                        </div>
                    </div>

                    <!-- Export Commissions -->
                    <div class="card text-center">
                        <div class="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-user-tie text-warning-600 text-2xl"></i>
                        </div>
                        <h4 class="text-lg font-semibold text-gray-900 mb-2">Commissions</h4>
                        <p class="text-gray-600 mb-4">Liste des commissions et leurs membres</p>
                        <div class="space-y-2">
                            <button onclick="rapports.exportCommissionsExcel()" class="btn-warning w-full">
                                <i class="fas fa-file-excel mr-2"></i>Excel
                            </button>
                            <button onclick="rapports.exportCommissionsPDF()" class="btn-outline w-full">
                                <i class="fas fa-file-pdf mr-2"></i>PDF
                            </button>
                        </div>
                    </div>

                    <!-- Statistiques -->
                    <div class="card text-center">
                        <div class="w-16 h-16 bg-info-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-chart-bar text-info-600 text-2xl"></i>
                        </div>
                        <h4 class="text-lg font-semibold text-gray-900 mb-2">Statistiques</h4>
                        <p class="text-gray-600 mb-4">Rapport statistique complet</p>
                        <div class="space-y-2">
                            <button onclick="rapports.exportStatistiquesExcel()" class="btn-info w-full">
                                <i class="fas fa-file-excel mr-2"></i>Excel
                            </button>
                            <button onclick="rapports.exportStatistiquesPDF()" class="btn-outline w-full">
                                <i class="fas fa-file-pdf mr-2"></i>PDF
                            </button>
                        </div>
                    </div>

                    <!-- Fiches individuelles -->
                    <div class="card text-center">
                        <div class="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-id-card text-secondary-600 text-2xl"></i>
                        </div>
                        <h4 class="text-lg font-semibold text-gray-900 mb-2">Fiches Individuelles</h4>
                        <p class="text-gray-600 mb-4">Fiches détaillées des pensionnaires</p>
                        <div class="space-y-2">
                            <button onclick="rapports.showFichesOptions()" class="btn-secondary w-full">
                                <i class="fas fa-file-pdf mr-2"></i>Générer PDF
                            </button>
                        </div>
                    </div>

                    <!-- Rapport personnalisé -->
                    <div class="card text-center">
                        <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-cogs text-purple-600 text-2xl"></i>
                        </div>
                        <h4 class="text-lg font-semibold text-gray-900 mb-2">Rapport Personnalisé</h4>
                        <p class="text-gray-600 mb-4">Créer un rapport sur mesure</p>
                        <div class="space-y-2">
                            <button onclick="rapports.showCustomReportOptions()" class="btn btn-purple w-full">
                                <i class="fas fa-magic mr-2"></i>Personnaliser
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Statistiques rapides -->
                <div class="card">
                    <h4 class="text-lg font-semibold text-gray-900 mb-4">Aperçu des Données</h4>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-primary-600">${this.pensionnaires.length}</div>
                            <div class="text-sm text-gray-600">Pensionnaires</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-success-600">${this.pensionnaires.filter(p => p.type_pensionnaire === 'Membre').length}</div>
                            <div class="text-sm text-gray-600">Membres</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-warning-600">${this.pensionnaires.filter(p => p.type_pensionnaire === 'Sympathisant').length}</div>
                            <div class="text-sm text-gray-600">Sympathisants</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-info-600">${this.commissions.length}</div>
                            <div class="text-sm text-gray-600">Commissions</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async exportPensionnairesExcel() {
        Utils.showToast('Export Excel des pensionnaires en cours de développement', 'info');
    }

    async exportPensionnairesPDF() {
        Utils.showToast('Export PDF des pensionnaires en cours de développement', 'info');
    }

    async exportPresencesExcel() {
        Utils.showToast('Export Excel des présences en cours de développement', 'info');
    }

    async exportPresencesPDF() {
        Utils.showToast('Export PDF des présences en cours de développement', 'info');
    }

    async exportCommissionsExcel() {
        Utils.showToast('Export Excel des commissions en cours de développement', 'info');
    }

    async exportCommissionsPDF() {
        Utils.showToast('Export PDF des commissions en cours de développement', 'info');
    }

    async exportStatistiquesExcel() {
        Utils.showToast('Export Excel des statistiques en cours de développement', 'info');
    }

    async exportStatistiquesPDF() {
        Utils.showToast('Export PDF des statistiques en cours de développement', 'info');
    }

    showFichesOptions() {
        Utils.showToast('Génération de fiches individuelles en cours de développement', 'info');
    }

    showCustomReportOptions() {
        Utils.showToast('Rapports personnalisés en cours de développement', 'info');
    }
}

// Créer une instance globale
window.Rapports = new Rapports();
