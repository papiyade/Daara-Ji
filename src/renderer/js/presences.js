// Module Présences - Gestion des présences quotidiennes

class Presences {
    constructor() {
        this.pensionnaires = [];
        this.presences = [];
        this.currentDate = new Date().toISOString().split('T')[0];
        this.currentSection = '';
        this.searchTerm = '';
        this.currentPage = 1;
        this.itemsPerPage = 20;
        this.filteredPensionnaires = [];
    }

    async render(container) {
        try {
            await this.loadData();
            container.innerHTML = this.generateHTML();
            this.initEventListeners();
        } catch (error) {
            Utils.handleError(error, 'lors du chargement des présences');
        }
    }

    async loadData() {
        try {
            this.pensionnaires = window.dataStorage.getAllPensionnaires();
            this.presences = window.dataStorage.getPresencesByDate(this.currentDate);
            this.applyFilters();
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            this.pensionnaires = [];
            this.presences = [];
            this.filteredPensionnaires = [];
        }
    }
    
    applyFilters() {
        let filtered = [...this.pensionnaires];
        
        // Filtrer par section
        if (this.currentSection) {
            filtered = filtered.filter(p => p.section === this.currentSection);
        }
        
        // Filtrer par terme de recherche
        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            filtered = filtered.filter(p => 
                p.prenom.toLowerCase().includes(term) ||
                p.nom.toLowerCase().includes(term)
            );
        }
        
        this.filteredPensionnaires = filtered;
        this.currentPage = 1; // Reset à la première page
    }

    generateHTML() {
        const stats = this.calculateStats();
        
        return `
            <div class="space-y-6">
                <!-- Header -->
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900">Gestion des Présences</h3>
                        <p class="text-sm text-gray-600">Marquer les présences pour le ${Utils.formatDate(this.currentDate)}</p>
                    </div>
                    <div class="mt-4 sm:mt-0 flex space-x-3">
                        <input type="date" id="date-selector" value="${this.currentDate}" class="form-input">
                        <button onclick="presences.saveAllPresences()" class="btn-primary">
                            <i class="fas fa-save mr-2"></i>Sauvegarder
                        </button>
                    </div>
                </div>

                <!-- Statistiques du jour -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div class="card text-center">
                        <div class="text-2xl font-bold text-primary-600">${stats.total}</div>
                        <div class="text-sm text-gray-600">Total pensionnaires</div>
                    </div>
                    <div class="card text-center">
                        <div class="text-2xl font-bold text-success-600">${stats.presents}</div>
                        <div class="text-sm text-gray-600">Présents</div>
                    </div>
                    <div class="card text-center">
                        <div class="text-2xl font-bold text-danger-600">${stats.absents}</div>
                        <div class="text-sm text-gray-600">Absents</div>
                    </div>
                    <div class="card text-center">
                        <div class="text-2xl font-bold text-warning-600">${stats.excuses}</div>
                        <div class="text-sm text-gray-600">Excusés</div>
                    </div>
                </div>

                <!-- Filtres et recherche -->
                <div class="card">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label class="form-label">Rechercher</label>
                            <input type="text" id="search-input" placeholder="Nom ou prénom..." 
                                   value="${this.searchTerm}" class="form-input">
                        </div>
                        <div>
                            <label class="form-label">Section</label>
                            <select id="filter-section" class="form-select">
                                <option value="">Toutes les sections</option>
                                <option value="Rawda" ${this.currentSection === 'Rawda' ? 'selected' : ''}>Rawda</option>
                                <option value="1ère section" ${this.currentSection === '1ère section' ? 'selected' : ''}>1ère section</option>
                                <option value="2ème section" ${this.currentSection === '2ème section' ? 'selected' : ''}>2ème section</option>
                                <option value="3ème section" ${this.currentSection === '3ème section' ? 'selected' : ''}>3ème section</option>
                            </select>
                        </div>
                        <div class="flex items-end">
                            <button onclick="presences.resetFilters()" class="btn-outline w-full">
                                <i class="fas fa-times mr-2"></i>Réinitialiser
                            </button>
                        </div>
                        <div class="flex items-end space-x-2">
                            <button onclick="presences.markAllFiltered('Présent')" class="btn btn-sm bg-success-600 text-white flex-1">
                                Tous présents
                            </button>
                            <button onclick="presences.markAllFiltered('Absent')" class="btn btn-sm bg-danger-600 text-white flex-1">
                                Tous absents
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Liste des pensionnaires -->
                <div class="card">
                    <div class="flex items-center justify-between mb-4">
                        <h4 class="text-lg font-semibold text-gray-900">
                            Pensionnaires (${this.filteredPensionnaires.length})
                        </h4>
                        <div class="text-sm text-gray-500">
                            Page ${this.currentPage} sur ${Math.ceil(this.filteredPensionnaires.length / this.itemsPerPage)}
                        </div>
                    </div>
                    
                    <div id="pensionnaires-list">
                        ${this.renderPensionnairesList()}
                    </div>
                    
                    <div id="pagination-container">
                        ${this.renderPagination()}
                    </div>
                </div>
            </div>
        `;
    }
    
    calculateStats() {
        const total = this.filteredPensionnaires.length;
        const presents = this.presences.filter(p => p.statut === 'Présent').length;
        const absents = this.presences.filter(p => p.statut === 'Absent').length;
        const excuses = this.presences.filter(p => p.statut === 'Excusé').length;
        
        return { total, presents, absents, excuses };
    }
    
    renderPensionnairesList() {
        const paginatedData = Utils.paginate(this.filteredPensionnaires, this.currentPage, this.itemsPerPage);
        
        if (paginatedData.data.length === 0) {
            return `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-users text-4xl mb-2"></i>
                    <p>Aucun pensionnaire trouvé</p>
                </div>
            `;
        }
        
        return `
            <div class="space-y-3">
                ${paginatedData.data.map(pensionnaire => this.generatePensionnaireRow(pensionnaire)).join('')}
            </div>
        `;
    }
    
    generatePensionnaireRow(pensionnaire) {
        const presence = this.presences.find(pr => pr.pensionnaire_id === pensionnaire.id);
        const statut = presence?.statut || '';
        
        return `
            <div class="border rounded-lg p-4 ${this.getRowClass(statut)} hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                            <span class="text-primary-600 font-semibold">
                                ${pensionnaire.prenom.charAt(0)}${pensionnaire.nom.charAt(0)}
                            </span>
                        </div>
                        <div>
                            <div class="font-medium text-gray-900">${pensionnaire.prenom} ${pensionnaire.nom}</div>
                            <div class="text-sm text-gray-500">
                                <span class="badge badge-info">${pensionnaire.section}</span>
                                <span class="ml-2 badge ${pensionnaire.type_pensionnaire === 'Membre' ? 'badge-success' : 'badge-warning'}">
                                    ${pensionnaire.type_pensionnaire}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex items-center space-x-4">
                        <div class="flex space-x-3">
                            <label class="flex items-center cursor-pointer">
                                <input type="radio" name="presence_${pensionnaire.id}" value="Présent" 
                                       ${statut === 'Présent' ? 'checked' : ''} 
                                       onchange="presences.updatePresence(${pensionnaire.id}, 'Présent')" 
                                       class="mr-2 text-success-600">
                                <span class="text-sm font-medium text-success-600">Présent</span>
                            </label>
                            <label class="flex items-center cursor-pointer">
                                <input type="radio" name="presence_${pensionnaire.id}" value="Absent" 
                                       ${statut === 'Absent' ? 'checked' : ''} 
                                       onchange="presences.updatePresence(${pensionnaire.id}, 'Absent')" 
                                       class="mr-2 text-danger-600">
                                <span class="text-sm font-medium text-danger-600">Absent</span>
                            </label>
                            <label class="flex items-center cursor-pointer">
                                <input type="radio" name="presence_${pensionnaire.id}" value="Excusé" 
                                       ${statut === 'Excusé' ? 'checked' : ''} 
                                       onchange="presences.updatePresence(${pensionnaire.id}, 'Excusé')" 
                                       class="mr-2 text-warning-600">
                                <span class="text-sm font-medium text-warning-600">Excusé</span>
                            </label>
                        </div>
                        
                        ${statut ? `
                            <div class="text-xs text-gray-500">
                                <i class="fas fa-check-circle"></i>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }
    
    getRowClass(statut) {
        switch (statut) {
            case 'Présent': return 'border-success-200 bg-success-50';
            case 'Absent': return 'border-danger-200 bg-danger-50';
            case 'Excusé': return 'border-warning-200 bg-warning-50';
            default: return 'border-gray-200 bg-white';
        }
    }
    
    renderPagination() {
        const totalPages = Math.ceil(this.filteredPensionnaires.length / this.itemsPerPage);
        
        if (totalPages <= 1) return '';
        
        const pages = Utils.generatePageNumbers(this.currentPage, totalPages);
        
        return `
            <div class="flex items-center justify-between mt-6 pt-4 border-t">
                <div class="text-sm text-gray-500">
                    Affichage de ${(this.currentPage - 1) * this.itemsPerPage + 1} à 
                    ${Math.min(this.currentPage * this.itemsPerPage, this.filteredPensionnaires.length)} 
                    sur ${this.filteredPensionnaires.length} pensionnaires
                </div>
                <div class="flex space-x-1">
                    <button onclick="presences.goToPage(${this.currentPage - 1})" 
                            ${this.currentPage === 1 ? 'disabled' : ''} 
                            class="px-3 py-1 text-sm border rounded ${this.currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}">
                        Précédent
                    </button>
                    ${pages.map(page => `
                        <button onclick="presences.goToPage(${page})" 
                                class="px-3 py-1 text-sm border rounded ${page === this.currentPage ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-50'}">
                            ${page}
                        </button>
                    `).join('')}
                    <button onclick="presences.goToPage(${this.currentPage + 1})" 
                            ${this.currentPage === totalPages ? 'disabled' : ''} 
                            class="px-3 py-1 text-sm border rounded ${this.currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}">
                        Suivant
                    </button>
                </div>
            </div>
        `;
    }
    
    goToPage(page) {
        const totalPages = Math.ceil(this.filteredPensionnaires.length / this.itemsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderPensionnairesList();
            this.renderPagination();
            
            // Mettre à jour l'affichage
            document.getElementById('pensionnaires-list').innerHTML = this.renderPensionnairesList();
            document.getElementById('pagination-container').innerHTML = this.renderPagination();
        }
    }
    
    resetFilters() {
        this.searchTerm = '';
        this.currentSection = '';
        this.currentPage = 1;
        
        document.getElementById('search-input').value = '';
        document.getElementById('filter-section').value = '';
        
        this.applyFilters();
        this.refreshDisplay();
    }
    
    markAllFiltered(statut) {
        const paginatedData = Utils.paginate(this.filteredPensionnaires, this.currentPage, this.itemsPerPage);
        
        paginatedData.data.forEach(pensionnaire => {
            this.updatePresence(pensionnaire.id, statut);
        });
        
        this.refreshDisplay();
    }
    
    refreshDisplay() {
        document.getElementById('pensionnaires-list').innerHTML = this.renderPensionnairesList();
        document.getElementById('pagination-container').innerHTML = this.renderPagination();
        this.updateStats();
    }
    
    updateStats() {
        const stats = this.calculateStats();
        // Mettre à jour les statistiques dans le DOM si nécessaire
    }

    initEventListeners() {
        // Sélecteur de date
        const dateSelector = document.getElementById('date-selector');
        if (dateSelector) {
            dateSelector.addEventListener('change', async (e) => {
                this.currentDate = e.target.value;
                await this.loadData();
                this.refreshDisplay();
            });
        }
        
        // Recherche
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value;
                this.applyFilters();
                this.refreshDisplay();
            });
        }
        
        // Filtre par section
        const sectionFilter = document.getElementById('filter-section');
        if (sectionFilter) {
            sectionFilter.addEventListener('change', (e) => {
                this.currentSection = e.target.value;
                this.applyFilters();
                this.refreshDisplay();
            });
        }
    }

    updatePresence(pensionnaireId, statut) {
        const existingIndex = this.presences.findIndex(p => p.pensionnaire_id === pensionnaireId);
        
        if (existingIndex >= 0) {
            this.presences[existingIndex].statut = statut;
        } else {
            this.presences.push({
                pensionnaire_id: pensionnaireId,
                date_presence: this.currentDate,
                statut: statut,
                remarques: null
            });
        }
        
        // Mettre à jour l'affichage en temps réel
        this.refreshDisplay();
    }

    async saveAllPresences() {
        try {
            Utils.showLoading();
            
            for (const presence of this.presences) {
                const pensionnaire = this.pensionnaires.find(p => p.id === presence.pensionnaire_id);
                window.dataStorage.markPresence(
                    presence.pensionnaire_id, 
                    this.currentDate, 
                    presence.statut, 
                    pensionnaire ? pensionnaire.section : ''
                );
            }
            
            Utils.showToast('Présences sauvegardées avec succès', 'success');
        } catch (error) {
            Utils.handleError(error, 'lors de la sauvegarde des présences');
        } finally {
            Utils.hideLoading();
        }
    }
}

// Créer une instance globale
window.presences = new Presences();
