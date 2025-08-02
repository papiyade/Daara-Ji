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
                    await window.Dashboard.render(contentContainer);
                    break;
                case 'pensionnaires':
                    await window.Pensionnaires.render(contentContainer);
                    break;
                case 'presences':
                    await window.Presences.render(contentContainer);
                    break;
                case 'commissions':
                    await window.Commissions.render(contentContainer);
                    break;
                case 'alertes':
                    await window.Alertes.render(contentContainer);
                    break;
                case 'rapports':
                    await window.Rapports.render(contentContainer);
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
}

// Initialiser la navigation quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    window.navigation = new Navigation();
    
    // Écouter les raccourcis clavier
    document.addEventListener('keydown', (event) => {
        window.navigation.handleKeyboardShortcuts(event);
    });
    
    // Sauvegarder l'état avant de fermer
    window.addEventListener('beforeunload', () => {
        window.navigation.saveNavigationState();
    });
});

