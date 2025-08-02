// Module Présences - Gestion des présences quotidiennes

class Presences {
    constructor() {
        this.pensionnaires = [];
        this.presences = [];
        this.currentDate = new Date().toISOString().split('T')[0];
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
            this.pensionnaires = await window.electronAPI.getPensionnaires();
            this.presences = await window.electronAPI.getPresences(this.currentDate);
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            this.pensionnaires = [];
            this.presences = [];
        }
    }

    generateHTML() {
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
                        <div class="text-2xl font-bold text-primary-600">${this.pensionnaires.length}</div>
                        <div class="text-sm text-gray-600">Total</div>
                    </div>
                    <div class="card text-center">
                        <div class="text-2xl font-bold text-success-600" id="presents-count">0</div>
                        <div class="text-sm text-gray-600">Présents</div>
                    </div>
                    <div class="card text-center">
                        <div class="text-2xl font-bold text-danger-600" id="absents-count">0</div>
                        <div class="text-sm text-gray-600">Absents</div>
                    </div>
                    <div class="card text-center">
                        <div class="text-2xl font-bold text-warning-600" id="excuses-count">0</div>
                        <div class="text-sm text-gray-600">Excusés</div>
                    </div>
                </div>

                <!-- Liste par section -->
                <div id="sections-container">
                    ${this.generateSectionsHTML()}
                </div>
            </div>
        `;
    }

    generateSectionsHTML() {
        const sections = ['Rawda', '1ère section', '2ème section', '3ème section'];
        return sections.map(section => {
            const pensionnairesSection = this.pensionnaires.filter(p => p.section === section);
            if (pensionnairesSection.length === 0) return '';

            return `
                <div class="card">
                    <div class="flex items-center justify-between mb-4">
                        <h4 class="text-lg font-semibold text-gray-900">${section}</h4>
                        <div class="flex space-x-2">
                            <button onclick="presences.markAllSection('${section}', 'Présent')" class="btn btn-sm bg-success-600 text-white">
                                Tous présents
                            </button>
                            <button onclick="presences.markAllSection('${section}', 'Absent')" class="btn btn-sm bg-danger-600 text-white">
                                Tous absents
                            </button>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        ${pensionnairesSection.map(p => this.generatePensionnaireCard(p)).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    generatePensionnaireCard(pensionnaire) {
        const presence = this.presences.find(pr => pr.pensionnaire_id === pensionnaire.id);
        const statut = presence?.statut || '';

        return `
            <div class="border rounded-lg p-4 ${this.getCardClass(statut)}">
                <div class="flex items-center mb-3">
                    <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <span class="text-primary-600 font-semibold text-sm">
                            ${pensionnaire.prenom.charAt(0)}${pensionnaire.nom.charAt(0)}
                        </span>
                    </div>
                    <div>
                        <div class="font-medium text-gray-900">${pensionnaire.prenom} ${pensionnaire.nom}</div>
                        <div class="text-sm text-gray-500">${pensionnaire.type_pensionnaire}</div>
                    </div>
                </div>
                <div class="space-y-2">
                    <div class="flex space-x-2">
                        <label class="flex items-center">
                            <input type="radio" name="presence_${pensionnaire.id}" value="Présent" 
                                   ${statut === 'Présent' ? 'checked' : ''} 
                                   onchange="presences.updatePresence(${pensionnaire.id}, 'Présent')" class="mr-1">
                            <span class="text-sm text-success-600">Présent</span>
                        </label>
                        <label class="flex items-center">
                            <input type="radio" name="presence_${pensionnaire.id}" value="Absent" 
                                   ${statut === 'Absent' ? 'checked' : ''} 
                                   onchange="presences.updatePresence(${pensionnaire.id}, 'Absent')" class="mr-1">
                            <span class="text-sm text-danger-600">Absent</span>
                        </label>
                        <label class="flex items-center">
                            <input type="radio" name="presence_${pensionnaire.id}" value="Excusé" 
                                   ${statut === 'Excusé' ? 'checked' : ''} 
                                   onchange="presences.updatePresence(${pensionnaire.id}, 'Excusé')" class="mr-1">
                            <span class="text-sm text-warning-600">Excusé</span>
                        </label>
                    </div>
                </div>
            </div>
        `;
    }

    getCardClass(statut) {
        switch (statut) {
            case 'Présent': return 'border-success-200 bg-success-50';
            case 'Absent': return 'border-danger-200 bg-danger-50';
            case 'Excusé': return 'border-warning-200 bg-warning-50';
            default: return 'border-gray-200 bg-white';
        }
    }

    initEventListeners() {
        const dateSelector = document.getElementById('date-selector');
        if (dateSelector) {
            dateSelector.addEventListener('change', async (e) => {
                this.currentDate = e.target.value;
                await this.loadData();
                const container = document.getElementById('page-content');
                await this.render(container);
            });
        }
        this.updateStats();
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
        
        this.updateStats();
        this.updateCardAppearance(pensionnaireId, statut);
    }

    updateCardAppearance(pensionnaireId, statut) {
        const card = document.querySelector(`input[name="presence_${pensionnaireId}"]`).closest('.border');
        if (card) {
            card.className = `border rounded-lg p-4 ${this.getCardClass(statut)}`;
        }
    }

    markAllSection(section, statut) {
        const pensionnairesSection = this.pensionnaires.filter(p => p.section === section);
        pensionnairesSection.forEach(p => {
            this.updatePresence(p.id, statut);
            const radio = document.querySelector(`input[name="presence_${p.id}"][value="${statut}"]`);
            if (radio) radio.checked = true;
        });
    }

    updateStats() {
        const presents = this.presences.filter(p => p.statut === 'Présent').length;
        const absents = this.presences.filter(p => p.statut === 'Absent').length;
        const excuses = this.presences.filter(p => p.statut === 'Excusé').length;

        document.getElementById('presents-count').textContent = presents;
        document.getElementById('absents-count').textContent = absents;
        document.getElementById('excuses-count').textContent = excuses;
    }

    async saveAllPresences() {
        try {
            Utils.showLoading();
            
            for (const presence of this.presences) {
                await window.electronAPI.savePresence(presence);
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
window.Presences = new Presences();
