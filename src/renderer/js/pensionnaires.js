// Module Pensionnaires - Gestion CRUD des pensionnaires

class Pensionnaires {
    constructor() {
        this.pensionnaires = [];
        this.filteredPensionnaires = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.searchTerm = '';
        this.filterSection = '';
        this.filterType = '';
        this.sortField = 'nom';
        this.sortDirection = 'asc';
    }

    async render(container) {
        try {
            await this.loadPensionnaires();
            container.innerHTML = this.generateHTML();
            this.initEventListeners();
            this.applyFilters();
        } catch (error) {
            Utils.handleError(error, 'lors du chargement des pensionnaires');
        }
    }

    async loadPensionnaires() {
        try {
            this.pensionnaires = await window.electronAPI.getPensionnaires();
            this.filteredPensionnaires = [...this.pensionnaires];
        } catch (error) {
            console.error('Erreur lors du chargement des pensionnaires:', error);
            this.pensionnaires = [];
            this.filteredPensionnaires = [];
        }
    }

    generateHTML() {
        return `
            <div class="space-y-6">
                <!-- Header avec actions -->
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900">Liste des Pensionnaires</h3>
                        <p class="text-sm text-gray-600">${this.pensionnaires.length} pensionnaire(s) enregistré(s)</p>
                    </div>
                    <div class="mt-4 sm:mt-0 flex space-x-3">
                        <button onclick="pensionnaires.exportToExcel()" class="btn-outline">
                            <i class="fas fa-file-excel mr-2"></i>Excel
                        </button>
                        <button onclick="pensionnaires.exportToPDF()" class="btn-outline">
                            <i class="fas fa-file-pdf mr-2"></i>PDF
                        </button>
                        <button onclick="pensionnaires.showAddForm()" class="btn-primary">
                            <i class="fas fa-plus mr-2"></i>Nouveau Pensionnaire
                        </button>
                    </div>
                </div>

                <!-- Filtres et recherche -->
                <div class="card">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label class="form-label">Rechercher</label>
                            <div class="relative">
                                <input type="text" id="search-input" placeholder="Nom, prénom..." 
                                       class="form-input pl-10">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <i class="fas fa-search text-gray-400"></i>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label class="form-label">Section</label>
                            <select id="filter-section" class="form-select">
                                <option value="">Toutes les sections</option>
                                <option value="Rawda">Rawda</option>
                                <option value="1ère section">1ère section</option>
                                <option value="2ème section">2ème section</option>
                                <option value="3ème section">3ème section</option>
                            </select>
                        </div>
                        <div>
                            <label class="form-label">Type</label>
                            <select id="filter-type" class="form-select">
                                <option value="">Tous les types</option>
                                <option value="Membre">Membre</option>
                                <option value="Sympathisant">Sympathisant</option>
                            </select>
                        </div>
                        <div class="flex items-end">
                            <button onclick="pensionnaires.resetFilters()" class="btn-outline w-full">
                                <i class="fas fa-undo mr-2"></i>Réinitialiser
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Tableau des pensionnaires -->
                <div class="card overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th class="cursor-pointer" onclick="pensionnaires.sort('nom')">
                                        Nom & Prénom
                                        <i class="fas fa-sort ml-1"></i>
                                    </th>
                                    <th class="cursor-pointer" onclick="pensionnaires.sort('section')">
                                        Section
                                        <i class="fas fa-sort ml-1"></i>
                                    </th>
                                    <th class="cursor-pointer" onclick="pensionnaires.sort('type_pensionnaire')">
                                        Type
                                        <i class="fas fa-sort ml-1"></i>
                                    </th>
                                    <th>Contact</th>
                                    <th class="cursor-pointer" onclick="pensionnaires.sort('date_inscription')">
                                        Date d'inscription
                                        <i class="fas fa-sort ml-1"></i>
                                    </th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="pensionnaires-table-body">
                                <!-- Les données seront insérées ici -->
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- Pagination -->
                    <div id="pagination-container" class="px-6 py-4 border-t border-gray-200">
                        <!-- La pagination sera générée ici -->
                    </div>
                </div>
            </div>
        `;
    }

    initEventListeners() {
        // Recherche en temps réel
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce((e) => {
                this.searchTerm = e.target.value;
                this.currentPage = 1;
                this.applyFilters();
            }, 300));
        }

        // Filtres
        const filterSection = document.getElementById('filter-section');
        if (filterSection) {
            filterSection.addEventListener('change', (e) => {
                this.filterSection = e.target.value;
                this.currentPage = 1;
                this.applyFilters();
            });
        }

        const filterType = document.getElementById('filter-type');
        if (filterType) {
            filterType.addEventListener('change', (e) => {
                this.filterType = e.target.value;
                this.currentPage = 1;
                this.applyFilters();
            });
        }
    }

    applyFilters() {
        let filtered = [...this.pensionnaires];

        // Recherche textuelle
        if (this.searchTerm) {
            filtered = Utils.filterArray(filtered, this.searchTerm, ['nom', 'prenom', 'adresse']);
        }

        // Filtre par section
        if (this.filterSection) {
            filtered = filtered.filter(p => p.section === this.filterSection);
        }

        // Filtre par type
        if (this.filterType) {
            filtered = filtered.filter(p => p.type_pensionnaire === this.filterType);
        }

        // Tri
        filtered = Utils.sortArray(filtered, this.sortField, this.sortDirection);

        this.filteredPensionnaires = filtered;
        this.renderTable();
        this.renderPagination();
    }

    renderTable() {
        const tbody = document.getElementById('pensionnaires-table-body');
        if (!tbody) return;

        const paginatedData = Utils.paginate(this.filteredPensionnaires, this.currentPage, this.itemsPerPage);
        
        if (paginatedData.data.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-8 text-gray-500">
                        <i class="fas fa-users text-4xl mb-2"></i>
                        <p>Aucun pensionnaire trouvé</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = paginatedData.data.map(pensionnaire => `
            <tr class="hover:bg-gray-50">
                <td>
                    <div class="flex items-center">
                        <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                            <span class="text-primary-600 font-semibold text-sm">
                                ${pensionnaire.prenom.charAt(0)}${pensionnaire.nom.charAt(0)}
                            </span>
                        </div>
                        <div>
                            <div class="font-medium text-gray-900">${pensionnaire.prenom} ${pensionnaire.nom}</div>
                            <div class="text-sm text-gray-500">${Utils.calculateAge(pensionnaire.date_naissance) || 'N/A'} ans</div>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="badge badge-info">${pensionnaire.section}</span>
                </td>
                <td>
                    <span class="badge ${pensionnaire.type_pensionnaire === 'Membre' ? 'badge-success' : 'badge-warning'}">
                        ${pensionnaire.type_pensionnaire}
                    </span>
                </td>
                <td>
                    <div class="text-sm">
                        ${pensionnaire.tel_pere ? `<div><i class="fas fa-phone text-gray-400 mr-1"></i>${pensionnaire.tel_pere}</div>` : ''}
                        ${pensionnaire.adresse ? `<div class="text-gray-500">${pensionnaire.adresse.substring(0, 30)}${pensionnaire.adresse.length > 30 ? '...' : ''}</div>` : ''}
                    </div>
                </td>
                <td class="text-sm text-gray-500">
                    ${Utils.formatDate(pensionnaire.date_inscription)}
                </td>
                <td>
                    <div class="flex space-x-2">
                        <button onclick="pensionnaires.viewPensionnaire(${pensionnaire.id})" 
                                class="text-primary-600 hover:text-primary-800" title="Voir">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="pensionnaires.editPensionnaire(${pensionnaire.id})" 
                                class="text-warning-600 hover:text-warning-800" title="Modifier">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="pensionnaires.deletePensionnaire(${pensionnaire.id})" 
                                class="text-danger-600 hover:text-danger-800" title="Supprimer">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    renderPagination() {
        const container = document.getElementById('pagination-container');
        if (!container) return;

        const paginatedData = Utils.paginate(this.filteredPensionnaires, this.currentPage, this.itemsPerPage);
        
        if (paginatedData.totalPages <= 1) {
            container.innerHTML = `
                <div class="text-sm text-gray-500">
                    ${paginatedData.totalItems} résultat(s)
                </div>
            `;
            return;
        }

        const pages = [];
        for (let i = 1; i <= paginatedData.totalPages; i++) {
            pages.push(i);
        }

        container.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="text-sm text-gray-500">
                    Affichage de ${((this.currentPage - 1) * this.itemsPerPage) + 1} à 
                    ${Math.min(this.currentPage * this.itemsPerPage, paginatedData.totalItems)} 
                    sur ${paginatedData.totalItems} résultats
                </div>
                <div class="flex space-x-1">
                    <button onclick="pensionnaires.goToPage(${this.currentPage - 1})" 
                            ${this.currentPage === 1 ? 'disabled' : ''} 
                            class="px-3 py-1 text-sm border rounded ${this.currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}">
                        Précédent
                    </button>
                    ${pages.map(page => `
                        <button onclick="pensionnaires.goToPage(${page})" 
                                class="px-3 py-1 text-sm border rounded ${page === this.currentPage ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-50'}">
                            ${page}
                        </button>
                    `).join('')}
                    <button onclick="pensionnaires.goToPage(${this.currentPage + 1})" 
                            ${this.currentPage === paginatedData.totalPages ? 'disabled' : ''} 
                            class="px-3 py-1 text-sm border rounded ${this.currentPage === paginatedData.totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}">
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
            this.renderTable();
            this.renderPagination();
        }
    }

    sort(field) {
        if (this.sortField === field) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortField = field;
            this.sortDirection = 'asc';
        }
        this.applyFilters();
    }

    resetFilters() {
        this.searchTerm = '';
        this.filterSection = '';
        this.filterType = '';
        this.currentPage = 1;
        
        document.getElementById('search-input').value = '';
        document.getElementById('filter-section').value = '';
        document.getElementById('filter-type').value = '';
        
        this.applyFilters();
    }

    initFormEvents(modal, isEdit, pensionnaireId) {
        const form = modal.querySelector('#pensionnaire-form');
        
        // Gestion des champs conditionnels
        const scolariseRadios = form.querySelectorAll('input[name="est_scolarise"]');
        const scolarisationDetails = form.querySelector('#scolarisation-details');
        
        scolariseRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                scolarisationDetails.style.display = e.target.value === '1' ? 'grid' : 'none';
            });
        });
        
        const maladieRadios = form.querySelectorAll('input[name="a_maladie"]');
        const maladieDetails = form.querySelector('#maladie-details');
        
        maladieRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                maladieDetails.style.display = e.target.value === '1' ? 'block' : 'none';
            });
        });
        
        // Soumission du formulaire
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.savePensionnaire(form, isEdit, pensionnaireId, modal);
        });
    }

    async savePensionnaire(form, isEdit, pensionnaireId, modal) {
        try {
            Utils.showLoading();
            
            const formData = new FormData(form);
            const pensionnaire = {};
            
            // Convertir FormData en objet
            for (let [key, value] of formData.entries()) {
                if (key === 'est_scolarise' || key === 'a_maladie') {
                    pensionnaire[key] = value === '1';
                } else if (key === 'participation_somme') {
                    pensionnaire[key] = value ? parseFloat(value) : null;
                } else {
                    pensionnaire[key] = value || null;
                }
            }
            
            let result;
            if (isEdit) {
                result = await window.electronAPI.updatePensionnaire(pensionnaireId, pensionnaire);
            } else {
                result = await window.electronAPI.addPensionnaire(pensionnaire);
            }
            
            modal.remove();
            await this.loadPensionnaires();
            this.applyFilters();
            
            Utils.showToast(
                isEdit ? 'Pensionnaire modifié avec succès' : 'Pensionnaire ajouté avec succès',
                'success'
            );
            
        } catch (error) {
            Utils.handleError(error, 'lors de la sauvegarde du pensionnaire');
        } finally {
            Utils.hideLoading();
        }
    }

    async viewPensionnaire(id) {
        const pensionnaire = this.pensionnaires.find(p => p.id === id);
        if (!pensionnaire) return;
        
        const modal = Utils.createModal('Fiche Pensionnaire', this.generateViewHTML(pensionnaire), 'lg');
    }

    generateViewHTML(p) {
        return `
            <div class="space-y-6">
                <div class="text-center">
                    <div class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="text-primary-600 font-bold text-2xl">
                            ${p.prenom.charAt(0)}${p.nom.charAt(0)}
                        </span>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900">${p.prenom} ${p.nom}</h3>
                    <p class="text-gray-600">${p.section} - ${p.type_pensionnaire}</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <h4 class="font-semibold text-gray-900">Informations personnelles</h4>
                        ${p.date_naissance ? `<p><strong>Date de naissance:</strong> ${Utils.formatDate(p.date_naissance)}</p>` : ''}
                        ${p.lieu_naissance ? `<p><strong>Lieu de naissance:</strong> ${p.lieu_naissance}</p>` : ''}
                        ${p.adresse ? `<p><strong>Adresse:</strong> ${p.adresse}</p>` : ''}
                    </div>
                    
                    <div class="space-y-4">
                        <h4 class="font-semibold text-gray-900">Contacts</h4>
                        ${p.prenom_pere ? `<p><strong>Père:</strong> ${p.prenom_pere} ${p.tel_pere ? `(${p.tel_pere})` : ''}</p>` : ''}
                        ${p.prenom_mere ? `<p><strong>Mère:</strong> ${p.prenom_mere} ${p.nom_mere || ''} ${p.tel_mere ? `(${p.tel_mere})` : ''}</p>` : ''}
                        ${p.encadreur ? `<p><strong>Encadreur:</strong> ${p.encadreur} ${p.tel_encadreur ? `(${p.tel_encadreur})` : ''}</p>` : ''}
                    </div>
                </div>
                
                <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button onclick="pensionnaires.editPensionnaire(${p.id}); this.closest('.modal').remove();" class="btn-warning">
                        <i class="fas fa-edit mr-2"></i>Modifier
                    </button>
                    <button onclick="this.closest('.modal').remove()" class="btn-outline">Fermer</button>
                </div>
            </div>
        `;
    }

    async deletePensionnaire(id) {
        const pensionnaire = this.pensionnaires.find(p => p.id === id);
        if (!pensionnaire) return;
        
        const confirmed = await Utils.confirmDelete(
            `Êtes-vous sûr de vouloir supprimer ${pensionnaire.prenom} ${pensionnaire.nom} ?`
        );
        
        if (confirmed) {
            try {
                Utils.showLoading();
                await window.electronAPI.deletePensionnaire(id);
                await this.loadPensionnaires();
                this.applyFilters();
                Utils.showToast('Pensionnaire supprimé avec succès', 'success');
            } catch (error) {
                Utils.handleError(error, 'lors de la suppression du pensionnaire');
            } finally {
                Utils.hideLoading();
            }
        }
    }

    async exportToExcel() {
        // TODO: Implémenter l'export Excel
        Utils.showToast('Export Excel en cours de développement', 'info');
    }

    async exportToPDF() {
        // TODO: Implémenter l'export PDF
        Utils.showToast('Export PDF en cours de développement', 'info');
    }
}

// Créer une instance globale
window.Pensionnaires = new Pensionnaires();
