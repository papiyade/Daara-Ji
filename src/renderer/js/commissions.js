// Module Commissions - Gestion des commissions du Daara

class Commissions {
    constructor() {
        this.commissions = [];
    }

    async render(container) {
        try {
            await this.loadCommissions();
            container.innerHTML = this.generateHTML();
        } catch (error) {
            Utils.handleError(error, 'lors du chargement des commissions');
        }
    }

    async loadCommissions() {
        try {
            this.commissions = await window.electronAPI.getCommissions();
        } catch (error) {
            console.error('Erreur lors du chargement des commissions:', error);
            this.commissions = [];
        }
    }

    generateHTML() {
        return `
            <div class="space-y-6">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900">Commissions du Daara</h3>
                        <p class="text-sm text-gray-600">Gestion des commissions et de leurs membres</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    ${this.commissions.map(commission => this.generateCommissionCard(commission)).join('')}
                </div>
            </div>
        `;
    }

    generateCommissionCard(commission) {
        return `
            <div class="card">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h4 class="text-lg font-semibold text-gray-900">${commission.nom}</h4>
                        <p class="text-sm text-gray-600">${commission.acronyme}</p>
                    </div>
                    <span class="badge badge-info">${commission.membres.length} membre(s)</span>
                </div>
                
                ${commission.description ? `<p class="text-gray-600 mb-4">${commission.description}</p>` : ''}
                
                <div class="space-y-2">
                    <h5 class="font-medium text-gray-900">Membres:</h5>
                    ${commission.membres.length > 0 ? `
                        <div class="space-y-2">
                            ${commission.membres.map(membre => `
                                <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <div class="flex items-center">
                                        <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                                            <span class="text-primary-600 font-semibold text-xs">
                                                ${membre.prenom.charAt(0)}${membre.nom.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <div class="font-medium text-gray-900">${membre.prenom} ${membre.nom}</div>
                                            <div class="text-xs text-gray-500">${membre.section}</div>
                                        </div>
                                    </div>
                                    ${membre.poste ? `<span class="text-xs text-gray-600">${membre.poste}</span>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <p class="text-gray-500 text-sm">Aucun membre assigné</p>
                    `}
                </div>
            </div>
        `;
    }
}

// Créer une instance globale
window.Commissions = new Commissions();
