// Module Dashboard - Vue d'ensemble du Daara

class Dashboard {
    constructor() {
        this.stats = null;
        this.charts = {};
    }

    async render(container) {
        try {
            // Charger les statistiques
            await this.loadStats();
            
            // Générer le HTML du dashboard
            container.innerHTML = this.generateHTML();
            
            // Initialiser les graphiques
            await this.initCharts();
            
            // Charger les alertes
            await this.loadAlerts();
            
        } catch (error) {
            Utils.handleError(error, 'lors du chargement du dashboard');
        }
    }

    async loadStats() {
        try {
            // Utiliser le nouveau système de stockage
            this.stats = window.dataStorage.getGeneralStats();
            
            // Ajouter les statistiques de présence du jour
            const today = new Date().toISOString().split('T')[0];
            const presencesToday = window.dataStorage.getPresenceStats(today, today);
            this.stats.presencesToday = presencesToday;
            
        } catch (error) {
            console.error('Erreur lors du chargement des statistiques:', error);
            this.stats = {
                total_pensionnaires: 0,
                sections: [],
                types: [],
                presencesToday: { presents: 0, absents: 0, total: 0 }
            };
        }
    }

    generateHTML() {
        const today = Utils.formatDate(new Date(), 'dd MMM yyyy');
        
        return `
            <div class="space-y-6">
                <!-- Statistiques principales -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="card">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-users text-primary-600 text-xl"></i>
                                </div>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-500">Total Pensionnaires</p>
                                <p class="text-2xl font-bold text-gray-900">${this.stats.total_pensionnaires}</p>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-check-circle text-success-600 text-xl"></i>
                                </div>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-500">Présents Aujourd'hui</p>
                                <p class="text-2xl font-bold text-gray-900">${this.stats.presencesToday.presents}</p>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <div class="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-exclamation-circle text-warning-600 text-xl"></i>
                                </div>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-500">Absents Aujourd'hui</p>
                                <p class="text-2xl font-bold text-gray-900">${this.stats.presencesToday.absents}</p>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <div class="w-12 h-12 bg-info-100 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-percentage text-info-600 text-xl"></i>
                                </div>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-500">Taux de Présence</p>
                                <p class="text-2xl font-bold text-gray-900">${this.calculatePresenceRate()}%</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Graphiques -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Répartition par section -->
                    <div class="card">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-gray-900">Répartition par Section</h3>
                            <div class="text-sm text-gray-500">Total: ${this.stats.total_pensionnaires}</div>
                        </div>
                        <div class="h-64">
                            <canvas id="sectionChart"></canvas>
                        </div>
                    </div>

                    <!-- Répartition par type -->
                    <div class="card">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-gray-900">Membres vs Sympathisants</h3>
                            <div class="text-sm text-gray-500">${today}</div>
                        </div>
                        <div class="h-64">
                            <canvas id="typeChart"></canvas>
                        </div>
                    </div>
                </div>

                <!-- Présences de la semaine -->
                <div class="card">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900">Présences de la Semaine</h3>
                        <button onclick="dashboard.refreshWeeklyPresences()" class="btn-outline btn-sm">
                            <i class="fas fa-sync-alt mr-2"></i>Actualiser
                        </button>
                    </div>
                    <div class="h-64">
                        <canvas id="weeklyChart"></canvas>
                    </div>
                </div>

                <!-- Alertes récentes -->
                <div class="card">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900">Alertes Récentes</h3>
                        <button onclick="navigation.navigateTo('alertes')" class="btn-outline btn-sm">
                            Voir toutes
                        </button>
                    </div>
                    <div id="recent-alerts">
                        <div class="text-center py-4 text-gray-500">
                            <i class="fas fa-spinner fa-spin mr-2"></i>Chargement des alertes...
                        </div>
                    </div>
                </div>

                <!-- Actions rapides -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="card text-center">
                        <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-user-plus text-primary-600 text-2xl"></i>
                        </div>
                        <h4 class="text-lg font-semibold text-gray-900 mb-2">Nouveau Pensionnaire</h4>
                        <p class="text-gray-600 mb-4">Ajouter un nouveau pensionnaire au Daara</p>
                        <button onclick="navigation.navigateTo('pensionnaires')" class="btn-primary w-full">
                            Ajouter
                        </button>
                    </div>

                    <div class="card text-center">
                        <div class="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-calendar-check text-success-600 text-2xl"></i>
                        </div>
                        <h4 class="text-lg font-semibold text-gray-900 mb-2">Marquer Présences</h4>
                        <p class="text-gray-600 mb-4">Enregistrer les présences du jour</p>
                        <button onclick="navigation.navigateTo('presences')" class="btn-success w-full">
                            Présences
                        </button>
                    </div>

                    <div class="card text-center">
                        <div class="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-file-export text-warning-600 text-2xl"></i>
                        </div>
                        <h4 class="text-lg font-semibold text-gray-900 mb-2">Générer Rapport</h4>
                        <p class="text-gray-600 mb-4">Exporter les données en Excel ou PDF</p>
                        <button onclick="navigation.navigateTo('rapports')" class="btn-warning w-full">
                            Rapports
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    async initCharts() {
        // Graphique des sections
        await this.initSectionChart();
        
        // Graphique des types
        await this.initTypeChart();
        
        // Graphique des présences hebdomadaires
        await this.initWeeklyChart();
    }

    async initSectionChart() {
        const ctx = document.getElementById('sectionChart');
        if (!ctx) return;

        const data = this.stats.sections.map(item => item.count);
        const labels = this.stats.sections.map(item => item.section);
        const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

        this.charts.section = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    async initTypeChart() {
        const ctx = document.getElementById('typeChart');
        if (!ctx) return;

        const data = this.stats.types.map(item => item.count);
        const labels = this.stats.types.map(item => item.type);

        this.charts.type = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: ['#10B981', '#6366F1'],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    async initWeeklyChart() {
        const ctx = document.getElementById('weeklyChart');
        if (!ctx) return;

        // Générer les données pour les 7 derniers jours
        const weeklyData = await this.getWeeklyPresenceData();

        this.charts.weekly = new Chart(ctx, {
            type: 'line',
            data: {
                labels: weeklyData.labels,
                datasets: [
                    {
                        label: 'Présents',
                        data: weeklyData.presents,
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Absents',
                        data: weeklyData.absents,
                        borderColor: '#EF4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    async getWeeklyPresenceData() {
        const labels = [];
        const presents = [];
        const absents = [];

        // Générer les 7 derniers jours
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            labels.push(Utils.formatDate(date, 'dd/mm'));
            
            try {
                const presences = window.dataStorage.getPresencesByDate(dateStr);
                const presentCount = presences.filter(p => p.statut === 'present').length;
                const absentCount = presences.filter(p => p.statut === 'absent').length;
                
                presents.push(presentCount);
                absents.push(absentCount);
            } catch (error) {
                presents.push(0);
                absents.push(0);
            }
        }

        return { labels, presents, absents };
    }

    async loadAlerts() {
        try {
            const alerts = window.dataStorage.getUnresolvedAlertes();
            const container = document.getElementById('recent-alerts');
            
            if (alerts.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-8 text-gray-500">
                        <i class="fas fa-check-circle text-4xl mb-2 text-success-500"></i>
                        <p>Aucune alerte active</p>
                    </div>
                `;
            } else {
                const recentAlerts = alerts.slice(0, 5); // Afficher seulement les 5 plus récentes
                container.innerHTML = recentAlerts.map(alert => `
                    <div class="flex items-center p-3 bg-warning-50 border border-warning-200 rounded-lg mb-2">
                        <div class="flex-shrink-0">
                            <i class="fas fa-exclamation-triangle text-warning-600"></i>
                        </div>
                        <div class="ml-3 flex-1">
                            <p class="text-sm font-medium text-warning-800">${alert.message}</p>
                            <p class="text-xs text-warning-600">${Utils.formatDate(alert.date_alerte)}</p>
                        </div>
                    </div>
                `).join('');
            }
            
            // Mettre à jour le badge d'alertes dans la navigation
            if (window.navigation) {
                window.navigation.updateAlertsBadge(alerts.length);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des alertes:', error);
            document.getElementById('recent-alerts').innerHTML = `
                <div class="text-center py-4 text-danger-500">
                    <i class="fas fa-exclamation-circle mr-2"></i>Erreur lors du chargement des alertes
                </div>
            `;
        }
    }

    calculatePresenceRate() {
        const { presents, total } = this.stats.presencesToday;
        if (total === 0) return 0;
        return Math.round((presents / total) * 100);
    }

    async refreshWeeklyPresences() {
        try {
            Utils.showLoading();
            
            // Détruire le graphique existant
            if (this.charts.weekly) {
                this.charts.weekly.destroy();
            }
            
            // Recréer le graphique
            await this.initWeeklyChart();
            
            Utils.showToast('Graphique des présences mis à jour', 'success');
        } catch (error) {
            Utils.handleError(error, 'lors de la mise à jour du graphique');
        } finally {
            Utils.hideLoading();
        }
    }

    async refresh() {
        try {
            Utils.showLoading();
            
            // Recharger les statistiques
            await this.loadStats();
            
            // Détruire les graphiques existants
            Object.values(this.charts).forEach(chart => {
                if (chart) chart.destroy();
            });
            this.charts = {};
            
            // Re-rendre le dashboard
            const container = document.getElementById('page-content');
            await this.render(container);
            
            Utils.showToast('Dashboard mis à jour', 'success');
        } catch (error) {
            Utils.handleError(error, 'lors de la mise à jour du dashboard');
        } finally {
            Utils.hideLoading();
        }
    }

    // Méthode pour nettoyer les ressources
    destroy() {
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.charts = {};
    }
}

// Créer une instance globale
window.dashboard = new Dashboard();
