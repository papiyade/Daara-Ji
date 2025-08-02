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
            this.pensionnaires = window.dataStorage.getAllPensionnaires();
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
                result = window.dataStorage.updatePensionnaire(pensionnaireId, pensionnaire);
            } else {
                result = window.dataStorage.addPensionnaire(pensionnaire);
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
                window.dataStorage.deletePensionnaire(id);
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

    showAddForm() {
        this.showForm();
    }

    editPensionnaire(id) {
        const pensionnaire = this.pensionnaires.find(p => p.id === id);
        if (pensionnaire) {
            this.showForm(pensionnaire);
        }
    }

    showForm(pensionnaire = null) {
        const isEdit = !!pensionnaire;
        const title = isEdit ? 'Modifier le Pensionnaire' : 'Nouveau Pensionnaire';
        
        const modal = Utils.createModal(title, this.generateFormHTML(pensionnaire), 'xl');
        
        // Initialiser les événements du formulaire
        this.initFormEvents(modal, isEdit);
    }

    generateFormHTML(pensionnaire = null) {
        const p = pensionnaire || {};
        
        return `
            <form id="pensionnaire-form" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Informations personnelles -->
                    <div class="space-y-4">
                        <h4 class="font-semibold text-gray-900 border-b pb-2">Informations personnelles</h4>
                        
                        <div>
                            <label class="form-label">Prénom *</label>
                            <input type="text" name="prenom" value="${p.prenom || ''}" class="form-input" required>
                        </div>
                        
                        <div>
                            <label class="form-label">Nom *</label>
                            <input type="text" name="nom" value="${p.nom || ''}" class="form-input" required>
                        </div>
                        
                        <div>
                            <label class="form-label">Date de naissance</label>
                            <input type="date" name="date_naissance" value="${p.date_naissance || ''}" class="form-input">
                        </div>
                        
                        <div>
                            <label class="form-label">Lieu de naissance</label>
                            <input type="text" name="lieu_naissance" value="${p.lieu_naissance || ''}" class="form-input">
                        </div>
                        
                        <div>
                            <label class="form-label">Adresse</label>
                            <textarea name="adresse" class="form-input" rows="3">${p.adresse || ''}</textarea>
                        </div>
                        
                        <div>
                            <label class="form-label">Section de base *</label>
                            <select name="section" class="form-select" required>
                                <option value="">Sélectionner une section</option>
                                <option value="Rawda" ${p.section === 'Rawda' ? 'selected' : ''}>Rawda</option>
                                <option value="1ère section" ${p.section === '1ère section' ? 'selected' : ''}>1ère section</option>
                                <option value="2ème section" ${p.section === '2ème section' ? 'selected' : ''}>2ème section</option>
                                <option value="3ème section" ${p.section === '3ème section' ? 'selected' : ''}>3ème section</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="form-label">Type de pensionnaire *</label>
                            <select name="type_pensionnaire" class="form-select" required>
                                <option value="">Sélectionner un type</option>
                                <option value="Membre" ${p.type_pensionnaire === 'Membre' ? 'selected' : ''}>Membre</option>
                                <option value="Sympathisant" ${p.type_pensionnaire === 'Sympathisant' ? 'selected' : ''}>Sympathisant</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- Contacts famille -->
                    <div class="space-y-4">
                        <h4 class="font-semibold text-gray-900 border-b pb-2">Contacts famille</h4>
                        
                        <div>
                            <label class="form-label">Prénom du père</label>
                            <input type="text" name="prenom_pere" value="${p.prenom_pere || ''}" class="form-input">
                        </div>
                        
                        <div>
                            <label class="form-label">Téléphone du père</label>
                            <input type="tel" name="tel_pere" value="${p.tel_pere || ''}" class="form-input">
                        </div>
                        
                        <div>
                            <label class="form-label">Prénom de la mère</label>
                            <input type="text" name="prenom_mere" value="${p.prenom_mere || ''}" class="form-input">
                        </div>
                        
                        <div>
                            <label class="form-label">Nom de la mère</label>
                            <input type="text" name="nom_mere" value="${p.nom_mere || ''}" class="form-input">
                        </div>
                        
                        <div>
                            <label class="form-label">Téléphone de la mère</label>
                            <input type="tel" name="tel_mere" value="${p.tel_mere || ''}" class="form-input">
                        </div>
                        
                        <div>
                            <label class="form-label">Encadreur</label>
                            <input type="text" name="encadreur" value="${p.encadreur || ''}" class="form-input">
                        </div>
                        
                        <div>
                            <label class="form-label">Téléphone encadreur</label>
                            <input type="tel" name="tel_encadreur" value="${p.tel_encadreur || ''}" class="form-input">
                        </div>
                    </div>
                </div>
                
                <!-- Scolarité et santé -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <h4 class="font-semibold text-gray-900 border-b pb-2">Scolarité</h4>
                        
                        <div>
                            <label class="form-label">Le pensionnaire est-il scolarisé ?</label>
                            <div class="flex space-x-4">
                                <label class="flex items-center">
                                    <input type="radio" name="scolarise" value="OUI" ${p.scolarise === 'OUI' ? 'checked' : ''} class="mr-2">
                                    OUI
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="scolarise" value="NON" ${p.scolarise === 'NON' ? 'checked' : ''} class="mr-2">
                                    NON
                                </label>
                            </div>
                        </div>
                        
                        <div>
                            <label class="form-label">Langue d'enseignement</label>
                            <select name="langue_enseignement" class="form-select">
                                <option value="">Sélectionner</option>
                                <option value="Arabe" ${p.langue_enseignement === 'Arabe' ? 'selected' : ''}>Arabe</option>
                                <option value="Français" ${p.langue_enseignement === 'Français' ? 'selected' : ''}>Français</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="form-label">Niveau d'études</label>
                            <input type="text" name="niveau_etudes" value="${p.niveau_etudes || ''}" class="form-input">
                        </div>
                        
                        <div>
                            <label class="form-label">École fréquentée</label>
                            <input type="text" name="ecole_frequentee" value="${p.ecole_frequentee || ''}" class="form-input">
                        </div>
                    </div>
                    
                    <div class="space-y-4">
                        <h4 class="font-semibold text-gray-900 border-b pb-2">Santé et participation</h4>
                        
                        <div>
                            <label class="form-label">Le pensionnaire souffre-t-il d'une maladie ?</label>
                            <div class="flex space-x-4">
                                <label class="flex items-center">
                                    <input type="radio" name="maladie" value="OUI" ${p.maladie === 'OUI' ? 'checked' : ''} class="mr-2">
                                    OUI
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="maladie" value="NON" ${p.maladie === 'NON' ? 'checked' : ''} class="mr-2">
                                    NON
                                </label>
                            </div>
                        </div>
                        
                        <div>
                            <label class="form-label">Si oui, laquelle ?</label>
                            <textarea name="type_maladie" class="form-input" rows="2">${p.type_maladie || ''}</textarea>
                        </div>
                        
                        <div>
                            <label class="form-label">Suit-il un traitement ?</label>
                            <textarea name="traitement" class="form-input" rows="2">${p.traitement || ''}</textarea>
                        </div>
                        
                        <div>
                            <label class="form-label">Participation (somme)</label>
                            <input type="number" name="participation" value="${p.participation || ''}" class="form-input" min="0">
                        </div>
                    </div>
                </div>
                
                <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button type="button" onclick="this.closest('.modal').remove()" class="btn-outline">Annuler</button>
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-save mr-2"></i>${pensionnaire ? 'Modifier' : 'Ajouter'}
                    </button>
                </div>
            </form>
        `;
    }

    initFormEvents(modal, isEdit) {
        const form = modal.querySelector('#pensionnaire-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.savePensionnaire(form, isEdit);
        });
    }

    async exportToExcel() {
        try {
            Utils.showLoading();
            
            const data = this.filteredPensionnaires.map(p => ({
                'Prénom': p.prenom,
                'Nom': p.nom,
                'Section': p.section,
                'Type': p.type_pensionnaire,
                'Date naissance': p.date_naissance ? Utils.formatDate(p.date_naissance) : '',
                'Lieu naissance': p.lieu_naissance || '',
                'Adresse': p.adresse || '',
                'Père': p.prenom_pere || '',
                'Tél. Père': p.tel_pere || '',
                'Mère': p.prenom_mere ? `${p.prenom_mere} ${p.nom_mere || ''}`.trim() : '',
                'Tél. Mère': p.tel_mere || '',
                'Encadreur': p.encadreur || '',
                'Tél. Encadreur': p.tel_encadreur || '',
                'Scolarisé': p.scolarise || '',
                'Langue': p.langue_enseignement || '',
                'Niveau': p.niveau_etudes || '',
                'École': p.ecole_frequentee || '',
                'Maladie': p.maladie || '',
                'Type maladie': p.type_maladie || '',
                'Traitement': p.traitement || '',
                'Participation': p.participation || '',
                'Date inscription': p.date_inscription ? Utils.formatDate(p.date_inscription) : ''
            }));

            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Pensionnaires");
            
            const filename = `pensionnaires_${new Date().toISOString().split('T')[0]}.xlsx`;
            XLSX.writeFile(wb, filename);
            
            Utils.showToast('Export Excel réussi', 'success');
        } catch (error) {
            Utils.handleError(error, 'lors de l\'export Excel');
        } finally {
            Utils.hideLoading();
        }
    }

    async exportToPDF() {
        try {
            Utils.showLoading();
            
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Titre
            doc.setFontSize(16);
            doc.text('Liste des Pensionnaires - Daara Re-Creation', 20, 20);
            doc.setFontSize(10);
            doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 20, 30);
            
            // Préparer les données pour le tableau
            const headers = [['Prénom', 'Nom', 'Section', 'Type', 'Téléphone', 'Date inscription']];
            const data = this.filteredPensionnaires.map(p => [
                p.prenom,
                p.nom,
                p.section,
                p.type_pensionnaire,
                p.tel_pere || p.tel_mere || '',
                p.date_inscription ? Utils.formatDate(p.date_inscription) : ''
            ]);
            
            // Créer le tableau
            doc.autoTable({
                head: headers,
                body: data,
                startY: 40,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [41, 128, 185] }
            });
            
            const filename = `pensionnaires_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(filename);
            
            Utils.showToast('Export PDF réussi', 'success');
        } catch (error) {
            Utils.handleError(error, 'lors de l\'export PDF');
        } finally {
            Utils.hideLoading();
        }
    }
}

// Créer une instance globale
window.pensionnaires = new Pensionnaires();
