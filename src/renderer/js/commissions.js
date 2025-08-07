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
            this.commissions = window.dataStorage.getAllCommissions();
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
                    <div class="flex items-center space-x-2">
                        <span class="badge badge-info">${commission.membres.length} membre(s)</span>
                        <button onclick="commissions.addMember(${commission.id})" class="btn-sm btn-primary">
                            <i class="fas fa-plus mr-1"></i>Ajouter
                        </button>
                    </div>
                </div>
                
                ${commission.description ? `<p class="text-gray-600 mb-4">${commission.description}</p>` : ''}
                
                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <h5 class="font-medium text-gray-900">Membres:</h5>
                        <div class="flex space-x-2">
                            <button onclick="commissions.exportCommissionToExcel(${commission.id})" class="text-sm text-primary-600 hover:text-primary-800">
                                <i class="fas fa-file-excel mr-1"></i>Excel
                            </button>
                            <button onclick="commissions.exportCommissionToPDF(${commission.id})" class="text-sm text-primary-600 hover:text-primary-800">
                                <i class="fas fa-file-pdf mr-1"></i>PDF
                            </button>
                        </div>
                    </div>
                    ${commission.membres.length > 0 ? `
                        <div class="space-y-2">
                            ${commission.membres.map(membre => `
                                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                                    <div class="flex items-center">
                                        <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                                            <span class="text-primary-600 font-semibold text-sm">
                                                ${(membre.prenom || 'N').charAt(0)}${(membre.nom || 'N').charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <div class="font-medium text-gray-900">${membre.prenom || 'Prénom'} ${membre.nom || 'Nom'}</div>
                                            <div class="text-sm text-gray-500">
                                                ${membre.section || 'Section non définie'}${membre.poste ? ` • ${membre.poste}` : ''}
                                            </div>
                                            ${membre.telephone ? `<div class="text-xs text-gray-400"><i class="fas fa-phone mr-1"></i>${membre.telephone}</div>` : ''}
                                        </div>
                                    </div>
                                    <div class="flex space-x-2">
                                        <button onclick="commissions.viewMember(${commission.id}, ${membre.id})" 
                                                class="text-primary-600 hover:text-primary-800" title="Voir">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button onclick="commissions.editMember(${commission.id}, ${membre.id})" 
                                                class="text-warning-600 hover:text-warning-800" title="Modifier">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button onclick="commissions.deleteMember(${commission.id}, ${membre.id})" 
                                                class="text-danger-600 hover:text-danger-800" title="Supprimer">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="text-center py-8 text-gray-500">
                            <i class="fas fa-users text-3xl mb-2"></i>
                            <p>Aucun membre assigné</p>
                            <button onclick="commissions.addMember(${commission.id})" class="btn-sm btn-primary mt-2">
                                <i class="fas fa-plus mr-1"></i>Ajouter le premier membre
                            </button>
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    addMember(commissionId) {
        console.log('addMember called for commission:', commissionId);
        try {
            const commission = this.commissions.find(c => c.id === commissionId);
            if (!commission) {
                alert('Commission non trouvée');
                return;
            }

            const formContent = `
                <form id="member-form" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="form-label">Prénom *</label>
                            <input type="text" name="prenom" class="form-input" required>
                        </div>
                        
                        <div>
                            <label class="form-label">Nom *</label>
                            <input type="text" name="nom" class="form-input" required>
                        </div>
                        
                        <div>
                            <label class="form-label">Téléphone</label>
                            <input type="tel" name="telephone" class="form-input" placeholder="Ex: +221 77 123 45 67">
                        </div>
                        
                        <div>
                            <label class="form-label">Poste/Fonction</label>
                            <input type="text" name="poste" class="form-input" placeholder="Ex: Président, Secrétaire, Membre...">
                        </div>
                    </div>
                    
                    <div>
                        <label class="form-label">Email (optionnel)</label>
                        <input type="email" name="email" class="form-input" placeholder="exemple@email.com">
                    </div>
                    
                    <div>
                        <label class="form-label">Responsabilités/Notes</label>
                        <textarea name="responsabilites" class="form-input" rows="3" placeholder="Décrivez les responsabilités ou ajoutez des notes..."></textarea>
                    </div>
                    
                    <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <button type="button" onclick="this.closest('.modal').remove()" class="btn-outline">Annuler</button>
                        <button type="submit" class="btn-primary">
                            <i class="fas fa-plus mr-2"></i>Ajouter le Membre
                        </button>
                    </div>
                </form>
            `;

            const modal = Utils.createModal(`Ajouter un Membre - ${commission.nom}`, formContent, 'lg');
            
            if (modal) {
                const form = modal.querySelector('#member-form');
                if (form) {
                    form.addEventListener('submit', (e) => {
                        e.preventDefault();
                        const formData = new FormData(form);
                        const memberData = {
                            prenom: formData.get('prenom'),
                            nom: formData.get('nom'),
                            telephone: formData.get('telephone'),
                            poste: formData.get('poste'),
                            email: formData.get('email'),
                            responsabilites: formData.get('responsabilites'),
                            date_ajout: new Date().toISOString().split('T')[0]
                        };
                        
                        if (memberData.prenom && memberData.nom) {
                            // Sauvegarder dans la base de données
                            try {
                                window.dataStorage.addCommissionMember(commissionId, memberData);
                                Utils.showToast(`Membre ${memberData.prenom} ${memberData.nom} ajouté à ${commission.nom}`, 'success');
                                modal.remove();
                                // Recharger la page pour afficher le nouveau membre
                                this.render(document.getElementById('page-content'));
                            } catch (error) {
                                console.error('Erreur lors de l\'ajout du membre:', error);
                                Utils.showToast('Erreur lors de l\'ajout du membre', 'error');
                            }
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error in addMember:', error);
            alert('Erreur: ' + error.message);
        }
    }

    editMember(commissionId, membreId) {
        const commission = this.commissions.find(c => c.id === commissionId);
        if (!commission) return;
        
        const membre = commission.membres.find(m => m.id === membreId);
        if (!membre) return;
        
        this.showMemberForm(commissionId, membre);
    }

    showMemberForm(commissionId, membre = null) {
        const commission = this.commissions.find(c => c.id === commissionId);
        if (!commission) return;
        
        const isEdit = !!membre;
        const title = isEdit ? 'Modifier le Membre' : `Ajouter un Membre - ${commission.nom}`;
        
        const modal = Utils.createModal(title, this.generateMemberFormHTML(commission, membre), 'lg');
        
        // Ajouter l'ID du membre au formulaire si c'est une édition
        if (isEdit && membre) {
            const form = modal.querySelector('#member-form');
            if (form) {
                form.dataset.membreId = membre.id;
            }
        }
        
        this.initMemberFormEvents(modal, commissionId, isEdit);
    }

    generateMemberFormHTML(commission, membre = null) {
        const m = membre || {};
        
        return `
            <form id="member-form" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="form-label">Prénom *</label>
                        <input type="text" name="prenom" value="${m.prenom || ''}" class="form-input" required>
                    </div>
                    
                    <div>
                        <label class="form-label">Nom *</label>
                        <input type="text" name="nom" value="${m.nom || ''}" class="form-input" required>
                    </div>
                    
                    <div>
                        <label class="form-label">Section</label>
                        <select name="section" class="form-select">
                            <option value="">Sélectionner une section</option>
                            <option value="Rawda" ${m.section === 'Rawda' ? 'selected' : ''}>Rawda</option>
                            <option value="1ère section" ${m.section === '1ère section' ? 'selected' : ''}>1ère section</option>
                            <option value="2ème section" ${m.section === '2ème section' ? 'selected' : ''}>2ème section</option>
                            <option value="3ème section" ${m.section === '3ème section' ? 'selected' : ''}>3ème section</option>
                            <option value="Externe" ${m.section === 'Externe' ? 'selected' : ''}>Externe</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="form-label">Poste/Fonction</label>
                        <input type="text" name="poste" value="${m.poste || ''}" class="form-input" placeholder="Ex: Président, Secrétaire...">
                    </div>
                    
                    <div>
                        <label class="form-label">Téléphone</label>
                        <input type="tel" name="telephone" value="${m.telephone || ''}" class="form-input">
                    </div>
                    
                    <div>
                        <label class="form-label">Email</label>
                        <input type="email" name="email" value="${m.email || ''}" class="form-input">
                    </div>
                </div>
                
                <div>
                    <label class="form-label">Adresse</label>
                    <textarea name="adresse" class="form-input" rows="3">${m.adresse || ''}</textarea>
                </div>
                
                <div>
                    <label class="form-label">Notes/Commentaires</label>
                    <textarea name="notes" class="form-input" rows="2">${m.notes || ''}</textarea>
                </div>
                
                <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button type="button" onclick="this.closest('.modal').remove()" class="btn-outline">Annuler</button>
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-save mr-2"></i>${membre ? 'Modifier' : 'Ajouter'}
                    </button>
                </div>
            </form>
        `;
    }

    initMemberFormEvents(modal, commissionId, isEdit) {
        const form = modal.querySelector('#member-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.saveMember(form, commissionId, isEdit);
        });
    }

    async saveMember(form, commissionId, isEdit) {
        try {
            Utils.showLoading();
            
            const formData = new FormData(form);
            const memberData = {
                prenom: formData.get('prenom'),
                nom: formData.get('nom'),
                section: formData.get('section'),
                poste: formData.get('poste'),
                telephone: formData.get('telephone'),
                email: formData.get('email'),
                adresse: formData.get('adresse'),
                notes: formData.get('notes'),
                date_ajout: isEdit ? undefined : new Date().toISOString()
            };

            if (isEdit) {
                // Récupérer l'ID du membre depuis le formulaire ou le contexte
                const membreId = form.dataset.membreId;
                window.dataStorage.updateCommissionMember(commissionId, parseInt(membreId), memberData);
            } else {
                window.dataStorage.addCommissionMember(commissionId, memberData);
            }
            
            form.closest('.modal').remove();
            await this.loadCommissions();
            await this.render(document.querySelector('.content-area'));
            
            Utils.showToast(
                isEdit ? 'Membre modifié avec succès' : 'Membre ajouté avec succès',
                'success'
            );
            
        } catch (error) {
            Utils.handleError(error, 'lors de la sauvegarde du membre');
        } finally {
            Utils.hideLoading();
        }
    }

    async viewMember(commissionId, membreId) {
        const commission = this.commissions.find(c => c.id === commissionId);
        if (!commission) return;
        
        const membre = commission.membres.find(m => m.id === membreId);
        if (!membre) return;
        
        const modal = Utils.createModal('Fiche Membre', this.generateMemberViewHTML(commission, membre), 'lg');
    }

    generateMemberViewHTML(commission, membre) {
        return `
            <div class="space-y-6">
                <div class="text-center">
                    <div class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="text-primary-600 font-bold text-2xl">
                            ${membre.prenom.charAt(0)}${membre.nom.charAt(0)}
                        </span>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900">${membre.prenom} ${membre.nom}</h3>
                    <p class="text-gray-600">${commission.nom} (${commission.acronyme})</p>
                    ${membre.poste ? `<p class="text-primary-600 font-medium">${membre.poste}</p>` : ''}
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <h4 class="font-semibold text-gray-900">Informations personnelles</h4>
                        ${membre.section ? `<p><strong>Section:</strong> ${membre.section}</p>` : ''}
                        ${membre.telephone ? `<p><strong>Téléphone:</strong> ${membre.telephone}</p>` : ''}
                        ${membre.email ? `<p><strong>Email:</strong> ${membre.email}</p>` : ''}
                        ${membre.adresse ? `<p><strong>Adresse:</strong> ${membre.adresse}</p>` : ''}
                    </div>
                    
                    <div class="space-y-4">
                        <h4 class="font-semibold text-gray-900">Informations commission</h4>
                        <p><strong>Commission:</strong> ${commission.nom}</p>
                        ${membre.date_ajout ? `<p><strong>Membre depuis:</strong> ${Utils.formatDate(membre.date_ajout)}</p>` : ''}
                        ${membre.notes ? `<p><strong>Notes:</strong> ${membre.notes}</p>` : ''}
                    </div>
                </div>
                
                <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button onclick="commissions.editMember(${commission.id}, ${membre.id}); this.closest('.modal').remove();" class="btn-warning">
                        <i class="fas fa-edit mr-2"></i>Modifier
                    </button>
                    <button onclick="this.closest('.modal').remove()" class="btn-outline">Fermer</button>
                </div>
            </div>
        `;
    }

    async deleteMember(commissionId, membreId) {
        const commission = this.commissions.find(c => c.id === commissionId);
        if (!commission) return;
        
        const membre = commission.membres.find(m => m.id === membreId);
        if (!membre) return;
        
        const confirmed = await Utils.confirmDelete(
            `Êtes-vous sûr de vouloir retirer ${membre.prenom} ${membre.nom} de la commission ${commission.nom} ?`
        );
        
        if (confirmed) {
            try {
                Utils.showLoading();
                window.dataStorage.removeCommissionMember(commissionId, membreId);
                await this.loadCommissions();
                await this.render(document.querySelector('.content-area'));
                Utils.showToast('Membre retiré avec succès', 'success');
            } catch (error) {
                Utils.handleError(error, 'lors de la suppression du membre');
            } finally {
                Utils.hideLoading();
            }
        }
    }

    async exportCommissionToExcel(commissionId) {
        try {
            Utils.showLoading();
            
            const commission = this.commissions.find(c => c.id === commissionId);
            if (!commission) return;
            
            const data = commission.membres.map(m => ({
                'Prénom': m.prenom,
                'Nom': m.nom,
                'Section': m.section || '',
                'Poste': m.poste || '',
                'Téléphone': m.telephone || '',
                'Email': m.email || '',
                'Adresse': m.adresse || '',
                'Date ajout': m.date_ajout ? Utils.formatDate(m.date_ajout) : '',
                'Notes': m.notes || ''
            }));

            // Vérifier si l'API Electron est disponible
            if (window.electronAPI && window.electronAPI.exportExcel) {
                // Utiliser l'API Electron pour exporter
                const fileName = `commission_${commission.acronyme}_${new Date().toISOString().split('T')[0]}.xlsx`;
                const result = await window.electronAPI.exportExcel(data, fileName);
                
                if (result.success && !result.canceled) {
                    Utils.showToast(`Export Excel terminé: ${result.filePath}`, 'success');
                } else if (result.canceled) {
                    Utils.showToast('Export annulé', 'info');
                } else {
                    Utils.showToast(`Erreur lors de l'export: ${result.error}`, 'error');
                }
            } else {
                // Fallback: Export CSV
                this.exportCommissionToCSV(data, commission.acronyme);
                Utils.showToast('Export CSV terminé (API Electron non disponible)', 'success');
            }
        } catch (error) {
            Utils.handleError(error, 'lors de l\'export Excel');
        } finally {
            Utils.hideLoading();
        }
    }

    exportCommissionToCSV(data, acronyme) {
        // Convertir les données en CSV avec encodage UTF-8
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
        ].join('\n');

        // Ajouter le BOM UTF-8 pour une meilleure compatibilité
        const BOM = '\uFEFF';
        const csvWithBOM = BOM + csvContent;

        // Créer et télécharger le fichier avec encodage UTF-8
        const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `commission_${acronyme}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    async exportCommissionToPDF(commissionId) {
        try {
            Utils.showLoading();
            
            const commission = this.commissions.find(c => c.id === commissionId);
            if (!commission) return;
            
            // Générer le HTML pour l'impression
            const printHTML = this.generatePrintableCommission(commission);
            
            // Vérifier si l'API Electron est disponible
            if (window.electronAPI && window.electronAPI.exportPDF) {
                // Utiliser l'API Electron pour exporter
                const fileName = `commission_${commission.acronyme}_${new Date().toISOString().split('T')[0]}.pdf`;
                const result = await window.electronAPI.exportPDF(printHTML, fileName);
                
                if (result.success && !result.canceled) {
                    Utils.showToast(`Document HTML créé. Utilisez Ctrl+P pour imprimer en PDF vers: ${result.filePath}`, 'success');
                } else if (result.canceled) {
                    Utils.showToast('Export annulé', 'info');
                } else {
                    Utils.showToast(`Erreur lors de l'export: ${result.error}`, 'error');
                }
            } else {
                // Fallback: Méthode PDF simple via impression navigateur
                this.printToPDF(printHTML, `Commission ${commission.acronyme}`);
                Utils.showToast('Impression PDF ouverte - Sélectionnez "Enregistrer au format PDF"', 'success');
            }
        } catch (error) {
            Utils.handleError(error, 'lors de l\'export PDF');
        } finally {
            Utils.hideLoading();
        }
    }

    printToPDF(htmlContent, title) {
        // Créer une nouvelle fenêtre pour l'impression
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        
        // Écrire le contenu HTML avec styles d'impression
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>${title}</title>
                <style>
                    @media print {
                        body { margin: 0; font-family: Arial, sans-serif; }
                        .no-print { display: none !important; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                        .page-break { page-break-before: always; }
                    }
                    @media screen {
                        body { margin: 20px; font-family: Arial, sans-serif; }
                        .print-button { 
                            position: fixed; top: 10px; right: 10px; 
                            background: #007bff; color: white; border: none; 
                            padding: 10px 20px; border-radius: 5px; cursor: pointer;
                        }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                    }
                </style>
            </head>
            <body>
                <button class="print-button no-print" onclick="window.print()">🖨️ Imprimer / Sauvegarder PDF</button>
                ${htmlContent}
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        
        // Auto-ouvrir la boîte de dialogue d'impression après un court délai
        setTimeout(() => {
            printWindow.print();
        }, 500);
    }
    
    generatePrintableCommission(commission) {
        const today = Utils.formatDate(new Date());
        
        let membresHTML = '';
        commission.membres.forEach((m, index) => {
            membresHTML += `
                <tr class="${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}">
                    <td class="border px-4 py-2">${m.prenom}</td>
                    <td class="border px-4 py-2">${m.nom}</td>
                    <td class="border px-4 py-2">${m.section || ''}</td>
                    <td class="border px-4 py-2">${m.poste || ''}</td>
                    <td class="border px-4 py-2">${m.telephone || ''}</td>
                    <td class="border px-4 py-2">${m.email || ''}</td>
                </tr>
            `;
        });
        
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>${commission.nom} - Daara Re-Creation</title>
                <style>
                    @page { size: A4; margin: 20mm; }
                    body { font-family: Arial, sans-serif; font-size: 12px; line-height: 1.6; }
                    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
                    .description { margin-bottom: 20px; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #333; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #333; padding: 8px; text-align: left; }
                    th { background-color: #f5f5f5; font-weight: bold; }
                    .bg-gray-50 { background-color: #f9f9f9; }
                    .bg-white { background-color: white; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>${commission.nom}</h1>
                    <h2>(${commission.acronyme})</h2>
                    <p>DAARA RE-CREATION - 02 au 23 août 2025</p>
                    <p>Rapport généré le ${today}</p>
                </div>
                
                ${commission.description ? `
                    <div class="description">
                        <h3>Description</h3>
                        <p>${commission.description}</p>
                    </div>
                ` : ''}
                
                <h3>Membres de la Commission</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Prénom</th>
                            <th>Nom</th>
                            <th>Section</th>
                            <th>Poste</th>
                            <th>Téléphone</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${membresHTML}
                    </tbody>
                </table>
                
                <div style="margin-top: 30px; text-align: center; font-size: 10px; color: #666;">
                    Total: ${commission.membres.length} membres
                </div>
            </body>
            </html>
        `;
    }
}

// Créer une instance globale
window.commissions = new Commissions();
