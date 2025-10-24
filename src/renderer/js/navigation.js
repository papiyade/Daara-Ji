// Gestion de la navigation entre les pages

class Navigation {
    constructor() {
        this.currentPage = 'dashboard';
        this.pages = {
            dashboard: {
                title: 'Dashboard',
                subtitle: 'Vue d\'ensemble du Daara',
                module: 'Dashboard'
            },
            pensionnaires: {
                title: 'Pensionnaires',
                subtitle: 'Gestion des pensionnaires du Daara',
                module: 'Pensionnaires'
            },
            presences: {
                title: 'Présences',
                subtitle: 'Gestion des présences quotidiennes',
                module: 'Presences'
            },
            commissions: {
                title: 'Commissions',
                subtitle: 'Gestion des commissions du Daara',
                module: 'Commissions'
            },
            alertes: {
                title: 'Alertes',
                subtitle: 'Alertes et notifications',
                module: 'Alertes'
            },
            rapports: {
                title: 'Rapports',
                subtitle: 'Génération de rapports et exports',
                module: 'Rapports'
            }
        };
        
        this.init();
    }

    init() {
        // Écouter les clics sur les éléments de navigation
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                if (page) {
                    this.navigateTo(page);
                }
            });
        });

        // Charger la page par défaut
        this.navigateTo(this.currentPage);
        
        // Mettre à jour l'heure toutes les secondes
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 1000);
    }

    navigateTo(page) {
        if (!this.pages[page]) {
            console.error(`Page ${page} non trouvée`);
            return;
        }

        // Mettre à jour l'état actuel
        this.currentPage = page;

        // Mettre à jour l'interface
        this.updateSidebar(page);
        this.updateHeader(page);
        this.loadPageContent(page);
    }

    updateSidebar(activePage) {
        // Retirer la classe active de tous les éléments
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.classList.remove('active');
        });

        // Ajouter la classe active à l'élément sélectionné
        const activeItem = document.querySelector(`[data-page="${activePage}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    updateHeader(page) {
        const pageInfo = this.pages[page];
        document.getElementById('page-title').textContent = pageInfo.title;
        document.getElementById('page-subtitle').textContent = pageInfo.subtitle;
    }

    async loadPageContent(page) {
        const contentContainer = document.getElementById('page-content');
        
        try {
            Utils.showLoading();
            
            // Charger le contenu de la page
            switch (page) {
                case 'dashboard':
                    if (window.dashboard && window.dashboard.render) {
                        await window.dashboard.render(contentContainer);
                    } else {
                        this.renderDashboardFallback(contentContainer);
                    }
                    break;
                case 'pensionnaires':
                    if (window.pensionnaires && window.pensionnaires.render) {
                        await window.pensionnaires.render(contentContainer);
                    } else {
                        this.renderPensionnairesFallback(contentContainer);
                    }
                    break;
                case 'presences':
                    if (window.presences && window.presences.render) {
                        await window.presences.render(contentContainer);
                    } else {
                        this.renderPresencesFallback(contentContainer);
                    }
                    break;
                case 'commissions':
                    if (window.commissions && window.commissions.render) {
                        await window.commissions.render(contentContainer);
                    } else {
                        this.renderCommissionsFallback(contentContainer);
                    }
                    break;
                case 'alertes':
                    if (window.alertes && window.alertes.render) {
                        await window.alertes.render(contentContainer);
                    } else {
                        this.renderAlertesFallback(contentContainer);
                    }
                    break;
                case 'rapports':
                    if (window.rapports && window.rapports.render) {
                        await window.rapports.render(contentContainer);
                    } else {
                        this.renderRapportsFallback(contentContainer);
                    }
                    break;
                default:
                    contentContainer.innerHTML = '<div class="text-center py-12"><h3 class="text-xl text-gray-500">Page en construction</h3></div>';
            }
        } catch (error) {
            console.error(`Erreur lors du chargement de la page ${page}:`, error);
            contentContainer.innerHTML = `
                <div class="text-center py-12">
                    <div class="text-danger-500 text-6xl mb-4">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h3 class="text-xl text-gray-700 mb-2">Erreur de chargement</h3>
                    <p class="text-gray-500">Impossible de charger la page ${page}</p>
                    <button onclick="navigation.navigateTo('${page}')" class="btn-primary mt-4">
                        <i class="fas fa-redo mr-2"></i>Réessayer
                    </button>
                </div>
            `;
        } finally {
            Utils.hideLoading();
        }
    }

    updateDateTime() {
        const now = new Date();
        
        // Mettre à jour la date
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            dateElement.textContent = Utils.formatDate(now, 'dd MMM yyyy');
        }
        
        // Mettre à jour l'heure
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            timeElement.textContent = Utils.formatTime(now);
        }
    }

    // Méthode pour obtenir la page courante
    getCurrentPage() {
        return this.currentPage;
    }

    // Méthode pour vérifier si une page existe
    pageExists(page) {
        return this.pages.hasOwnProperty(page);
    }

    // Méthode pour obtenir les informations d'une page
    getPageInfo(page) {
        return this.pages[page] || null;
    }

    // Méthode pour ajouter une nouvelle page (pour les extensions futures)
    addPage(key, pageInfo) {
        this.pages[key] = pageInfo;
    }

    // Méthode pour supprimer une page
    removePage(key) {
        if (this.pages[key]) {
            delete this.pages[key];
            
            // Si c'est la page courante, naviguer vers le dashboard
            if (this.currentPage === key) {
                this.navigateTo('dashboard');
            }
        }
    }

    // Méthode pour mettre à jour le badge d'alertes
    updateAlertsBadge(count) {
        const badge = document.getElementById('alertes-badge');
        if (badge) {
            if (count > 0) {
                badge.textContent = count;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }
    }

    // Méthode pour gérer les raccourcis clavier
    handleKeyboardShortcuts(event) {
        // Alt + 1-6 pour naviguer rapidement
        if (event.altKey && !event.ctrlKey && !event.shiftKey) {
            const shortcuts = {
                '1': 'dashboard',
                '2': 'pensionnaires',
                '3': 'presences',
                '4': 'commissions',
                '5': 'alertes',
                '6': 'rapports'
            };
            
            const page = shortcuts[event.key];
            if (page) {
                event.preventDefault();
                this.navigateTo(page);
            }
        }
    }

    // Méthode pour sauvegarder l'état de navigation
    saveNavigationState() {
        Utils.saveToLocalStorage('currentPage', this.currentPage);
    }

    // Méthode pour restaurer l'état de navigation
    restoreNavigationState() {
        const savedPage = Utils.loadFromLocalStorage('currentPage', 'dashboard');
        if (this.pageExists(savedPage)) {
            this.navigateTo(savedPage);
        }
    }

    // Méthodes de fallback pour les pages
    renderDashboardFallback(container) {
        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center">
                        <div class="p-2 bg-primary-100 rounded-lg">
                            <i class="fas fa-users text-primary-600 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600">Total Pensionnaires</p>
                            <p class="text-2xl font-semibold text-gray-900">0</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center">
                        <div class="p-2 bg-success-100 rounded-lg">
                            <i class="fas fa-check text-success-600 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600">Présents Aujourd'hui</p>
                            <p class="text-2xl font-semibold text-gray-900">0</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center">
                        <div class="p-2 bg-warning-100 rounded-lg">
                            <i class="fas fa-exclamation-triangle text-warning-600 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600">Absents</p>
                            <p class="text-2xl font-semibold text-gray-900">0</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center">
                        <div class="p-2 bg-info-100 rounded-lg">
                            <i class="fas fa-sitemap text-info-600 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600">Commissions</p>
                            <p class="text-2xl font-semibold text-gray-900">5</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="text-center py-8">
                <p class="text-gray-500">Dashboard en mode basique - Module Dashboard non chargé</p>
            </div>
        `;
    }

    renderPensionnairesFallback(container) {
        container.innerHTML = `
            <div class="bg-white rounded-lg shadow">
                <div class="px-6 py-4 border-b border-gray-200">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-medium text-gray-900">Gestion des Pensionnaires</h3>
                        <button onclick="pensionnaires.showAddForm()" class="btn-primary">
                            <i class="fas fa-plus mr-2"></i>Nouveau Pensionnaire
                        </button>
                    </div>
                </div>
                <div class="p-6">
                    <div class="text-center py-12">
                        <div class="text-gray-400 text-6xl mb-4">
                            <i class="fas fa-users"></i>
                        </div>
                        <h3 class="text-xl text-gray-700 mb-2">Aucun pensionnaire</h3>
                        <p class="text-gray-500 mb-4">Commencez par ajouter votre premier pensionnaire</p>
                        <button onclick="pensionnaires.showAddForm()" class="btn-primary">
                            <i class="fas fa-plus mr-2"></i>Ajouter un Pensionnaire
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderCommissionsFallback(container) {
        const commissionsData = [
            { id: 'cips', nom: 'CIPS', description: 'Commission de l\'Intelligence et de la Perception Spirituelle', membres: [] },
            { id: 'ca', nom: 'CA', description: 'Commission Administrative', membres: [] },
            { id: 'ctc', nom: 'CTC', description: 'Commission de Trésor et Capacitation', membres: [] },
            { id: 'logistique', nom: 'Commission Logistique', description: 'Gestion logistique du Daara', membres: [] },
            { id: 'pf', nom: 'Points Focaux', description: 'Points Focaux du Daara', membres: [] }
        ];

        let commissionsHTML = commissionsData.map(commission => `
            <div class="bg-white rounded-lg shadow mb-6">
                <div class="px-6 py-4 border-b border-gray-200">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-lg font-medium text-gray-900">${commission.nom}</h3>
                            <p class="text-sm text-gray-600">${commission.description}</p>
                        </div>
                        <button onclick="commissions.addMember('${commission.id}')" class="btn-primary">
                            <i class="fas fa-plus mr-2"></i>Ajouter
                        </button>
                    </div>
                </div>
                <div class="p-6">
                    <div class="text-center py-8">
                        <div class="text-gray-400 text-4xl mb-4">
                            <i class="fas fa-users"></i>
                        </div>
                        <p class="text-gray-500">Aucun membre dans cette commission</p>
                        <button onclick="commissions.addMember('${commission.id}')" class="btn-secondary mt-3">
                            <i class="fas fa-plus mr-2"></i>Ajouter un membre
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-2">Commissions du Daara</h2>
                <p class="text-gray-600">Gérez les différentes commissions et leurs membres</p>
            </div>
            ${commissionsHTML}
        `;
    }

    renderPresencesFallback(container) {
        container.innerHTML = `
            <div class="bg-white rounded-lg shadow">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-medium text-gray-900">Gestion des Présences</h3>
                </div>
                <div class="p-6">
                    <div class="text-center py-12">
                        <div class="text-gray-400 text-6xl mb-4">
                            <i class="fas fa-calendar-check"></i>
                        </div>
                        <h3 class="text-xl text-gray-700 mb-2">Module Présences</h3>
                        <p class="text-gray-500">Cette fonctionnalité sera bientôt disponible</p>
                    </div>
                </div>
            </div>
        `;
    }

    renderAlertesFallback(container) {
        container.innerHTML = `
            <div class="bg-white rounded-lg shadow">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-medium text-gray-900">Alertes et Notifications</h3>
                </div>
                <div class="p-6">
                    <div class="text-center py-12">
                        <div class="text-gray-400 text-6xl mb-4">
                            <i class="fas fa-bell"></i>
                        </div>
                        <h3 class="text-xl text-gray-700 mb-2">Aucune alerte</h3>
                        <p class="text-gray-500">Toutes les notifications apparaîtront ici</p>
                    </div>
                </div>
            </div>
        `;
    }

    renderRapportsFallback(container) {
        container.innerHTML = `
            <div class="bg-white rounded-lg shadow">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-medium text-gray-900">Rapports et Exports</h3>
                </div>
                <div class="p-6">
                    <div class="text-center py-12">
                        <div class="text-gray-400 text-6xl mb-4">
                            <i class="fas fa-file-alt"></i>
                        </div>
                        <h3 class="text-xl text-gray-700 mb-2">Module Rapports</h3>
                        <p class="text-gray-500">Génération de rapports bientôt disponible</p>
                    </div>
                </div>
            </div>
        `;
    }
}

// Initialiser la navigation quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    // Attendre un peu pour que tous les modules soient chargés
    setTimeout(() => {
        window.navigation = new Navigation();
        
        // Écouter les raccourcis clavier
        document.addEventListener('keydown', (event) => {
            window.navigation.handleKeyboardShortcuts(event);
        });
        
        // Sauvegarder l'état avant de fermer
        window.addEventListener('beforeunload', () => {
            window.navigation.saveNavigationState();
        });
        
        console.log('Navigation initialized. Available modules:', {
            dashboard: !!window.dashboard,
            pensionnaires: !!window.pensionnaires,
            presences: !!window.presences,
            commissions: !!window.commissions,
            alertes: !!window.alertes,
            rapports: !!window.rapports
        });
    }, 100);
});
