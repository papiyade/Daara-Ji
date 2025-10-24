// Utilitaires généraux pour l'application

class Utils {
    // Formatage des dates
    static formatDate(date, format = 'dd/mm/yyyy') {
        if (!date) return '';
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        
        switch (format) {
            case 'dd/mm/yyyy':
                return `${day}/${month}/${year}`;
            case 'yyyy-mm-dd':
                return `${year}-${month}-${day}`;
            case 'dd MMM yyyy':
                const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
                              'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
                return `${day} ${months[d.getMonth()]} ${year}`;
            default:
                return `${day}/${month}/${year}`;
        }
    }

    // Formatage de l'heure
    static formatTime(date = new Date()) {
        return date.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Validation des données
    static validateRequired(value, fieldName) {
        if (!value || value.toString().trim() === '') {
            throw new Error(`Le champ ${fieldName} est requis`);
        }
        return true;
    }

    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validatePhone(phone) {
        const phoneRegex = /^(\+221|00221)?[0-9]{9}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    // Gestion des toasts/notifications
    static showToast(message, type = 'info', duration = 3000) {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        
        const typeClasses = {
            success: 'bg-success-500 text-white',
            error: 'bg-danger-500 text-white',
            warning: 'bg-warning-500 text-white',
            info: 'bg-primary-500 text-white'
        };

        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        toast.className = `flex items-center p-4 rounded-lg shadow-lg ${typeClasses[type]} animate-slide-in-right`;
        toast.innerHTML = `
            <i class="${icons[type]} mr-3"></i>
            <span>${message}</span>
            <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        toastContainer.appendChild(toast);

        // Auto-remove après la durée spécifiée
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, duration);
    }

    // Gestion du loading
    static showLoading() {
        document.getElementById('loading-overlay').classList.remove('hidden');
        document.getElementById('loading-overlay').classList.add('flex');
    }

    static hideLoading() {
        document.getElementById('loading-overlay').classList.add('hidden');
        document.getElementById('loading-overlay').classList.remove('flex');
    }

    // Confirmation de suppression
    static async confirmDelete(message = 'Êtes-vous sûr de vouloir supprimer cet élément ?') {
        return new Promise((resolve) => {
            const modal = this.createModal('Confirmation de suppression', `
                <div class="text-center">
                    <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-danger-100 mb-4">
                        <i class="fas fa-exclamation-triangle text-danger-600 text-xl"></i>
                    </div>
                    <p class="text-gray-700 mb-6">${message}</p>
                    <div class="flex justify-center space-x-3">
                        <button id="cancel-btn" class="btn-outline">Annuler</button>
                        <button id="confirm-btn" class="btn-danger">Supprimer</button>
                    </div>
                </div>
            `);

            document.getElementById('cancel-btn').onclick = () => {
                modal.remove();
                resolve(false);
            };

            document.getElementById('confirm-btn').onclick = () => {
                modal.remove();
                resolve(true);
            };
        });
    }

    // Création de modales
    static createModal(title, content, size = 'md') {
        // Vérifier que le container existe
        const container = document.getElementById('modal-container');
        if (!container) {
            console.error('Modal container not found!');
            return null;
        }

        const modal = document.createElement('div');
        modal.className = 'modal';
        
        const sizeClasses = {
            sm: 'max-w-md',
            md: 'max-w-lg',
            lg: 'max-w-2xl',
            xl: 'max-w-4xl'
        };

        // Styles inline pour s'assurer que le modal s'affiche
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 9999;
            overflow-y: auto;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
        `;

        modal.innerHTML = `
            <div class="modal-content" style="
                background: white;
                border-radius: 0.5rem;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                width: 100%;
                max-width: ${sizeClasses[size] === 'max-w-md' ? '28rem' : 
                           sizeClasses[size] === 'max-w-lg' ? '32rem' : 
                           sizeClasses[size] === 'max-w-2xl' ? '42rem' : '56rem'};
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
            ">
                <div style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1.5rem;
                    border-bottom: 1px solid #e5e7eb;
                ">
                    <h3 style="
                        font-size: 1.125rem;
                        font-weight: 600;
                        color: #111827;
                        margin: 0;
                    ">${title}</h3>
                    <button class="modal-close-btn" style="
                        color: #9ca3af;
                        background: none;
                        border: none;
                        font-size: 1.25rem;
                        cursor: pointer;
                        padding: 0.25rem;
                    " title="Fermer">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div style="padding: 1.5rem;">
                    ${content}
                </div>
            </div>
        `;

        // Ajouter les événements de fermeture
        const closeBtn = modal.querySelector('.modal-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.remove();
            });
        }

        // Fermer en cliquant sur le backdrop
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Fermer avec Escape
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        container.appendChild(modal);
        
        // Focus sur le modal pour l'accessibilité
        modal.focus();
        
        console.log('Modal created and added to DOM');
        return modal;
    }

    // Fonction de test pour les modals
    static testModal() {
        console.log('Testing modal...');
        const testContent = `
            <div>
                <h4>Test Modal</h4>
                <p>Si vous voyez ce modal, la fonction createModal fonctionne !</p>
                <button onclick="alert('Bouton cliqué!')" style="
                    background: #3b82f6;
                    color: white;
                    padding: 0.5rem 1rem;
                    border: none;
                    border-radius: 0.25rem;
                    cursor: pointer;
                ">Test Bouton</button>
            </div>
        `;
        return this.createModal('Test Modal', testContent, 'md');
    }

    // Génération d'ID unique
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Formatage des nombres
    static formatNumber(number, decimals = 0) {
        return new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(number);
    }

    // Formatage de la monnaie
    static formatCurrency(amount) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF'
        }).format(amount);
    }

    // Calcul de l'âge
    static calculateAge(birthDate) {
        if (!birthDate) return null;
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    }

    // Debounce pour les recherches
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Tri des tableaux
    static sortArray(array, key, direction = 'asc') {
        return array.sort((a, b) => {
            let aVal = a[key];
            let bVal = b[key];
            
            // Gestion des valeurs nulles
            if (aVal === null || aVal === undefined) aVal = '';
            if (bVal === null || bVal === undefined) bVal = '';
            
            // Conversion en string pour la comparaison
            aVal = aVal.toString().toLowerCase();
            bVal = bVal.toString().toLowerCase();
            
            if (direction === 'asc') {
                return aVal.localeCompare(bVal);
            } else {
                return bVal.localeCompare(aVal);
            }
        });
    }

    // Filtrage des tableaux
    static filterArray(array, searchTerm, fields) {
        if (!searchTerm) return array;
        
        const term = searchTerm.toLowerCase();
        return array.filter(item => {
            return fields.some(field => {
                const value = item[field];
                return value && value.toString().toLowerCase().includes(term);
            });
        });
    }

    // Pagination
    static paginate(array, page, itemsPerPage) {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        return {
            data: array.slice(startIndex, endIndex),
            totalPages: Math.ceil(array.length / itemsPerPage),
            currentPage: page,
            totalItems: array.length
        };
    }

    // Sauvegarde locale
    static saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            return false;
        }
    }

    static loadFromLocalStorage(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('Erreur lors du chargement:', error);
            return defaultValue;
        }
    }

    // Gestion des erreurs
    static handleError(error, context = '') {
        console.error(`Erreur ${context}:`, error);
        
        let message = 'Une erreur inattendue s\'est produite';
        if (error.message) {
            message = error.message;
        }
        
        this.showToast(message, 'error');
    }

    // Validation des formulaires
    static validateForm(formData, rules) {
        const errors = {};
        
        for (const [field, rule] of Object.entries(rules)) {
            const value = formData[field];
            
            if (rule.required && (!value || value.toString().trim() === '')) {
                errors[field] = `Le champ ${rule.label || field} est requis`;
                continue;
            }
            
            if (value && rule.minLength && value.toString().length < rule.minLength) {
                errors[field] = `${rule.label || field} doit contenir au moins ${rule.minLength} caractères`;
                continue;
            }
            
            if (value && rule.maxLength && value.toString().length > rule.maxLength) {
                errors[field] = `${rule.label || field} ne peut pas dépasser ${rule.maxLength} caractères`;
                continue;
            }
            
            if (value && rule.pattern && !rule.pattern.test(value)) {
                errors[field] = rule.message || `Format invalide pour ${rule.label || field}`;
                continue;
            }
            
            if (value && rule.custom && !rule.custom(value)) {
                errors[field] = rule.message || `Valeur invalide pour ${rule.label || field}`;
            }
        }
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
}

// Export pour utilisation globale
window.Utils = Utils;
