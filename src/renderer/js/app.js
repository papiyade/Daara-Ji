// Application principale - Point d'entrée

class App {
    constructor() {
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;

        try {
            // Initialiser l'application
            console.log('Initialisation de l\'application Daara Re-Creation Manager...');
            
            // Vérifier la disponibilité des APIs Electron (non bloquant)
            if (!window.electronAPI) {
                console.warn('APIs Electron non disponibles - Mode développement');
            }

            // Marquer comme initialisé
            this.initialized = true;
            
            console.log('Application initialisée avec succès');
            
        } catch (error) {
            console.error('Erreur lors de l\'initialisation:', error);
            // Ne pas afficher l'erreur à l'utilisateur au démarrage
            // Utils.showToast('Erreur lors de l\'initialisation de l\'application', 'error');
        }
    }

    // Méthode pour nettoyer les ressources avant fermeture
    cleanup() {
        // Nettoyer les graphiques du dashboard
        if (window.dashboard) {
            window.dashboard.destroy();
        }
        
        console.log('Nettoyage des ressources terminé');
    }
}

// Initialiser l'application quand le DOM est prêt
document.addEventListener('DOMContentLoaded', async () => {
    window.app = new App();
    await window.app.init();
});

// Nettoyer avant fermeture
window.addEventListener('beforeunload', () => {
    if (window.app) {
        window.app.cleanup();
    }
});
