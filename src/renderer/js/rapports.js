// Module Rapports - Génération de rapports et exports

class Rapports {
    constructor() {
        this.pensionnaires = [];
        this.commissions = [];
    }

    async render(container) {
        try {
            await this.loadData();
            container.innerHTML = this.generateHTML();
        } catch (error) {
            Utils.handleError(error, 'lors du chargement des rapports');
        }
    }

    async loadData() {
        try {
            this.pensionnaires = window.dataStorage.getAllPensionnaires();
            this.commissions = window.dataStorage.getAllCommissions();
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
        }
    }

    generateHTML() {
        return `
            <div class="space-y-6">
                <div>
                    <h3 class="text-lg font-semibold text-gray-900">Rapports et Exports</h3>
                    <p class="text-sm text-gray-600">Générer et exporter les données du Daara</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Export Pensionnaires -->
                    <div class="card text-center">
                        <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-users text-primary-600 text-2xl"></i>
                        </div>
                        <h4 class="text-lg font-semibold text-gray-900 mb-2">Liste des Pensionnaires</h4>
                        <p class="text-gray-600 mb-4">Exporter la liste complète des pensionnaires</p>
                        <div class="space-y-2">
                            <button onclick="rapports.exportPensionnairesExcel()" class="btn-primary w-full">
                                <i class="fas fa-file-excel mr-2"></i>Excel
                            </button>
                            <button onclick="rapports.exportPensionnairesPDF()" class="btn-outline w-full">
                                <i class="fas fa-file-pdf mr-2"></i>PDF
                            </button>
                        </div>
                    </div>

                    <!-- Export Présences -->
                    <div class="card text-center">
                        <div class="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-calendar-check text-success-600 text-2xl"></i>
                        </div>
                        <h4 class="text-lg font-semibold text-gray-900 mb-2">Rapport de Présences</h4>
                        <p class="text-gray-600 mb-4">Statistiques et détails des présences</p>
                        <div class="space-y-2">
                            <button onclick="rapports.exportPresencesExcel()" class="btn-success w-full">
                                <i class="fas fa-file-excel mr-2"></i>Excel
                            </button>
                            <button onclick="rapports.exportPresencesPDF()" class="btn-outline w-full">
                                <i class="fas fa-file-pdf mr-2"></i>PDF
                            </button>
                        </div>
                    </div>

                    <!-- Export Commissions -->
                    <div class="card text-center">
                        <div class="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-user-tie text-warning-600 text-2xl"></i>
                        </div>
                        <h4 class="text-lg font-semibold text-gray-900 mb-2">Commissions</h4>
                        <p class="text-gray-600 mb-4">Liste des commissions et leurs membres</p>
                        <div class="space-y-2">
                            <button onclick="rapports.exportCommissionsExcel()" class="btn-warning w-full">
                                <i class="fas fa-file-excel mr-2"></i>Excel
                            </button>
                            <button onclick="rapports.exportCommissionsPDF()" class="btn-outline w-full">
                                <i class="fas fa-file-pdf mr-2"></i>PDF
                            </button>
                        </div>
                    </div>

                    <!-- Statistiques -->
                    <div class="card text-center">
                        <div class="w-16 h-16 bg-info-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-chart-bar text-info-600 text-2xl"></i>
                        </div>
                        <h4 class="text-lg font-semibold text-gray-900 mb-2">Statistiques</h4>
                        <p class="text-gray-600 mb-4">Rapport statistique complet</p>
                        <div class="space-y-2">
                            <button onclick="rapports.exportStatistiquesExcel()" class="btn-info w-full">
                                <i class="fas fa-file-excel mr-2"></i>Excel
                            </button>
                            <button onclick="rapports.exportStatistiquesPDF()" class="btn-outline w-full">
                                <i class="fas fa-file-pdf mr-2"></i>PDF
                            </button>
                        </div>
                    </div>

                    <!-- Fiches individuelles -->
                    <div class="card text-center">
                        <div class="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-id-card text-secondary-600 text-2xl"></i>
                        </div>
                        <h4 class="text-lg font-semibold text-gray-900 mb-2">Fiches Individuelles</h4>
                        <p class="text-gray-600 mb-4">Fiches détaillées des pensionnaires</p>
                        <div class="space-y-2">
                            <button onclick="rapports.showFichesOptions()" class="btn-secondary w-full">
                                <i class="fas fa-file-pdf mr-2"></i>Générer PDF
                            </button>
                        </div>
                    </div>

                    <!-- Rapport personnalisé -->
                    <div class="card text-center">
                        <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-cogs text-purple-600 text-2xl"></i>
                        </div>
                        <h4 class="text-lg font-semibold text-gray-900 mb-2">Rapport Personnalisé</h4>
                        <p class="text-gray-600 mb-4">Créer un rapport sur mesure</p>
                        <div class="space-y-2">
                            <button onclick="rapports.showCustomReportOptions()" class="btn btn-purple w-full">
                                <i class="fas fa-magic mr-2"></i>Personnaliser
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Statistiques rapides -->
                <div class="card">
                    <h4 class="text-lg font-semibold text-gray-900 mb-4">Aperçu des Données</h4>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-primary-600">${this.pensionnaires.length}</div>
                            <div class="text-sm text-gray-600">Pensionnaires</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-success-600">${this.pensionnaires.filter(p => p.type_pensionnaire === 'Membre').length}</div>
                            <div class="text-sm text-gray-600">Membres</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-warning-600">${this.pensionnaires.filter(p => p.type_pensionnaire === 'Sympathisant').length}</div>
                            <div class="text-sm text-gray-600">Sympathisants</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-info-600">${this.commissions.length}</div>
                            <div class="text-sm text-gray-600">Commissions</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async exportPensionnairesExcel() {
        try {
            Utils.showLoading();
            
            // Préparer les données pour l'export
            const data = this.pensionnaires.map(p => ({
                'Prénom': p.prenom || '',
                'Nom': p.nom || '',
                'Date de naissance': p.date_naissance || '',
                'Lieu de naissance': p.lieu_naissance || '',
                'Adresse': p.adresse || '',
                'Section': p.section || '',
                'Type': p.type_pensionnaire || '',
                'Prénom du père': p.prenom_pere || '',
                'Tél. père': p.tel_pere || '',
                'Prénom de la mère': p.prenom_mere || '',
                'Nom de la mère': p.nom_mere || '',
                'Tél. mère': p.tel_mere || '',
                'Encadreur': p.encadreur || '',
                'Tél. encadreur': p.tel_encadreur || '',
                'Scolarisé': p.scolarise || '',
                'Langue d\'enseignement': p.langue_enseignement || '',
                'Niveau d\'études': p.niveau_etudes || '',
                'École fréquentée': p.ecole_frequentee || '',
                'Maladie': p.maladie || '',
                'Type de maladie': p.type_maladie || '',
                'Traitement': p.traitement || '',
                'Participation': p.participation || ''
            }));

            // Créer le fichier Excel
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Pensionnaires');

            // Télécharger le fichier
            const fileName = `Pensionnaires_Daara_${new Date().toISOString().split('T')[0]}.xlsx`;
            XLSX.writeFile(wb, fileName);

            Utils.showToast('Export Excel des pensionnaires terminé', 'success');
        } catch (error) {
            console.error('Erreur lors de l\'export Excel:', error);
            Utils.showToast('Erreur lors de l\'export Excel', 'error');
        } finally {
            Utils.hideLoading();
        }
    }

    async exportPensionnairesPDF() {
        try {
            Utils.showLoading();
            
            // Utiliser l'API Electron pour ouvrir un dialogue de sauvegarde
            const result = await window.electronAPI.showSaveDialog({
                title: 'Sauvegarder la liste des pensionnaires',
                defaultPath: `Pensionnaires_Daara_${new Date().toISOString().split('T')[0]}.pdf`,
                filters: [
                    { name: 'PDF Files', extensions: ['pdf'] },
                    { name: 'All Files', extensions: ['*'] }
                ]
            });
            
            if (!result.canceled && result.filePath) {
                // Générer le HTML pour l'impression
                const printHTML = this.generatePrintablePensionnaires();
                
                // Créer une nouvelle fenêtre pour l'impression
                const printWindow = window.open('', '_blank');
                printWindow.document.write(printHTML);
                printWindow.document.close();
                
                // Attendre que le contenu soit chargé puis imprimer
                printWindow.onload = function() {
                    printWindow.print();
                    // Ne pas fermer automatiquement pour permettre à l'utilisateur de sauvegarder
                };
                
                Utils.showToast(`Document préparé pour sauvegarde vers: ${result.filePath}`, 'success');
            } else {
                Utils.showToast('Sauvegarde annulée', 'info');
            }
            
            Utils.hideLoading();
            
        } catch (error) {
            Utils.hideLoading();
            // Fallback vers l'impression normale si l'API Electron n'est pas disponible
            this.fallbackPrintPensionnaires();
        }
    }
    
    fallbackPrintPensionnaires() {
        try {
            // Créer une nouvelle fenêtre pour l'impression
            const printWindow = window.open('', '_blank');
            
            // Générer le HTML pour l'impression
            const printHTML = this.generatePrintablePensionnaires();
            
            printWindow.document.write(printHTML);
            printWindow.document.close();
            
            // Attendre que le contenu soit chargé puis imprimer
            printWindow.onload = function() {
                printWindow.print();
            };
            
            Utils.showToast('Document préparé pour impression', 'success');
            
        } catch (error) {
            Utils.handleError(error, 'lors de la préparation de l\'impression');
        }
    }
    
    generatePrintablePensionnaires() {
        const today = Utils.formatDate(new Date());
        const sections = ['Rawda', '1ère section', '2ème section', '3ème section'];
        
        let sectionsHTML = '';
        
        sections.forEach(section => {
            const pensionnairesSection = this.pensionnaires.filter(p => p.section === section);
            if (pensionnairesSection.length === 0) return;
            
            sectionsHTML += `
                <div class="section-break">
                    <h2 class="section-title">${section.toUpperCase()}</h2>
                    <table class="pensionnaires-table">
                        <thead>
                            <tr>
                                <th>N°</th>
                                <th>Nom & Prénom</th>
                                <th>Type</th>
                                <th>Contact</th>
                                <th>Date Inscription</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pensionnairesSection.map((p, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${p.prenom} ${p.nom}</td>
                                    <td>${p.type_pensionnaire}</td>
                                    <td>${p.tel_pere || p.tel_mere || 'N/A'}</td>
                                    <td>${p.date_inscription ? Utils.formatDate(p.date_inscription) : 'N/A'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        });
        
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Liste des Pensionnaires - Daara Re-Creation</title>
                <style>
                    @page {
                        margin: 2cm;
                        size: A4;
                    }
                    
                    body {
                        font-family: Arial, sans-serif;
                        font-size: 12px;
                        line-height: 1.4;
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }
                    
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        border-bottom: 2px solid #333;
                        padding-bottom: 15px;
                    }
                    
                    .header h1 {
                        font-size: 18px;
                        font-weight: bold;
                        margin: 0 0 10px 0;
                    }
                    
                    .header p {
                        margin: 5px 0;
                        font-size: 11px;
                    }
                    
                    .section-break {
                        page-break-inside: avoid;
                        margin-bottom: 25px;
                    }
                    
                    .section-title {
                        font-size: 14px;
                        font-weight: bold;
                        margin: 20px 0 10px 0;
                        padding: 8px;
                        background-color: #f5f5f5;
                        border-left: 4px solid #333;
                    }
                    
                    .pensionnaires-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    
                    .pensionnaires-table th,
                    .pensionnaires-table td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                    }
                    
                    .pensionnaires-table th {
                        background-color: #f8f9fa;
                        font-weight: bold;
                        font-size: 11px;
                    }
                    
                    .pensionnaires-table td {
                        font-size: 10px;
                    }
                    
                    .stats {
                        margin-top: 30px;
                        padding: 15px;
                        background-color: #f8f9fa;
                        border: 1px solid #ddd;
                    }
                    
                    .stats h3 {
                        margin: 0 0 10px 0;
                        font-size: 13px;
                    }
                    
                    .stats-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 10px;
                    }
                    
                    .stat-item {
                        font-size: 11px;
                    }
                    
                    @media print {
                        .section-break {
                            page-break-inside: avoid;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>LISTE DES PENSIONNAIRES</h1>
                    <h2>DAARA RE-CREATION (02-23 AOÛT 2025)</h2>
                    <p>Document généré le ${today}</p>
                    <p>Total pensionnaires: ${this.pensionnaires.length}</p>
                </div>
                
                ${sectionsHTML}
                
                <div class="stats">
                    <h3>STATISTIQUES GÉNÉRALES</h3>
                    <div class="stats-grid">
                        <div class="stat-item">Total pensionnaires: ${this.pensionnaires.length}</div>
                        <div class="stat-item">Membres: ${this.pensionnaires.filter(p => p.type_pensionnaire === 'Membre').length}</div>
                        <div class="stat-item">Sympathisants: ${this.pensionnaires.filter(p => p.type_pensionnaire === 'Sympathisant').length}</div>
                        <div class="stat-item">Sections: ${sections.length}</div>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    async exportPresencesExcel() {
        try {
            Utils.showLoading();
            
            // Obtenir les données de présences pour les 30 derniers jours
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 30);
            
            const presences = window.dataStorage.getPresencesByDateRange(
                startDate.toISOString().split('T')[0],
                endDate.toISOString().split('T')[0]
            );
            
            // Préparer les données pour l'export
            const data = presences.map(p => {
                const pensionnaire = this.pensionnaires.find(pen => pen.id === p.pensionnaire_id);
                return {
                    'Date': p.date_presence,
                    'Prénom': pensionnaire ? pensionnaire.prenom : 'Inconnu',
                    'Nom': pensionnaire ? pensionnaire.nom : 'Inconnu',
                    'Section': pensionnaire ? pensionnaire.section : '',
                    'Type': pensionnaire ? pensionnaire.type_pensionnaire : '',
                    'Statut': p.statut,
                    'Remarques': p.remarques || ''
                };
            });

            // Créer le fichier Excel
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Présences');

            // Ajouter une feuille de statistiques
            const stats = this.calculatePresenceStats(presences);
            const statsData = [
                { 'Statistique': 'Total présences', 'Valeur': stats.totalPresences },
                { 'Statistique': 'Présents', 'Valeur': stats.presents },
                { 'Statistique': 'Absents', 'Valeur': stats.absents },
                { 'Statistique': 'Excusés', 'Valeur': stats.excuses },
                { 'Statistique': 'Taux de présence', 'Valeur': `${stats.tauxPresence}%` }
            ];
            const wsStats = XLSX.utils.json_to_sheet(statsData);
            XLSX.utils.book_append_sheet(wb, wsStats, 'Statistiques');

            // Télécharger le fichier
            const fileName = `Presences_Daara_${new Date().toISOString().split('T')[0]}.xlsx`;
            XLSX.writeFile(wb, fileName);

            Utils.showToast('Export Excel des présences terminé', 'success');
        } catch (error) {
            console.error('Erreur lors de l\'export Excel:', error);
            Utils.showToast('Erreur lors de l\'export Excel', 'error');
        } finally {
            Utils.hideLoading();
        }
    }

    calculatePresenceStats(presences) {
        const totalPresences = presences.length;
        const presents = presences.filter(p => p.statut === 'Présent').length;
        const absents = presences.filter(p => p.statut === 'Absent').length;
        const excuses = presences.filter(p => p.statut === 'Excusé').length;
        const tauxPresence = totalPresences > 0 ? Math.round((presents / totalPresences) * 100) : 0;
        
        return { totalPresences, presents, absents, excuses, tauxPresence };
    }

    async exportPresencesPDF() {
        try {
            Utils.showLoading();
            
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Configuration
            const pageWidth = doc.internal.pageSize.width;
            const margin = 20;
            let yPosition = 30;
            
            // Titre
            doc.setFontSize(18);
            doc.setFont(undefined, 'bold');
            doc.text('RAPPORT DE PRÉSENCES - DAARA RE-CREATION', pageWidth / 2, yPosition, { align: 'center' });
            
            yPosition += 10;
            doc.setFontSize(12);
            doc.setFont(undefined, 'normal');
            doc.text(`Généré le ${Utils.formatDate(new Date())}`, pageWidth / 2, yPosition, { align: 'center' });
            
            yPosition += 20;
            
            // Obtenir les données de présences pour les 7 derniers jours
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);
            
            const presences = window.dataStorage.getPresencesByDateRange(
                startDate.toISOString().split('T')[0],
                endDate.toISOString().split('T')[0]
            );
            
            // Statistiques générales
            const stats = this.calculatePresenceStats(presences);
            
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('STATISTIQUES (7 derniers jours)', margin, yPosition);
            yPosition += 10;
            
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text(`Total des enregistrements: ${stats.totalPresences}`, margin, yPosition);
            yPosition += 6;
            doc.text(`Présents: ${stats.presents}`, margin, yPosition);
            yPosition += 6;
            doc.text(`Absents: ${stats.absents}`, margin, yPosition);
            yPosition += 6;
            doc.text(`Excusés: ${stats.excuses}`, margin, yPosition);
            yPosition += 6;
            doc.text(`Taux de présence: ${stats.tauxPresence}%`, margin, yPosition);
            yPosition += 15;
            
            // Grouper par date
            const presencesByDate = {};
            presences.forEach(p => {
                if (!presencesByDate[p.date_presence]) {
                    presencesByDate[p.date_presence] = [];
                }
                presencesByDate[p.date_presence].push(p);
            });
            
            // Afficher par date
            Object.keys(presencesByDate).sort().forEach(date => {
                if (yPosition > 250) {
                    doc.addPage();
                    yPosition = 30;
                }
                
                doc.setFontSize(12);
                doc.setFont(undefined, 'bold');
                doc.text(`${Utils.formatDate(new Date(date))}`, margin, yPosition);
                yPosition += 8;
                
                const dayPresences = presencesByDate[date];
                const dayStats = this.calculatePresenceStats(dayPresences);
                
                doc.setFontSize(9);
                doc.setFont(undefined, 'normal');
                doc.text(`Présents: ${dayStats.presents} | Absents: ${dayStats.absents} | Excusés: ${dayStats.excuses}`, margin + 5, yPosition);
                yPosition += 8;
                
                // Lister les absents du jour
                const absentsJour = dayPresences.filter(p => p.statut === 'Absent');
                if (absentsJour.length > 0) {
                    doc.setFont(undefined, 'bold');
                    doc.text('Absents:', margin + 5, yPosition);
                    yPosition += 5;
                    
                    doc.setFont(undefined, 'normal');
                    absentsJour.forEach(p => {
                        const pensionnaire = this.pensionnaires.find(pen => pen.id === p.pensionnaire_id);
                        if (pensionnaire) {
                            doc.text(`• ${pensionnaire.prenom} ${pensionnaire.nom} (${pensionnaire.section})`, margin + 10, yPosition);
                            yPosition += 4;
                        }
                    });
                }
                
                yPosition += 5;
            });
            
            // Sauvegarder
            const fileName = `Presences_Daara_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);
            
            Utils.showToast('Export PDF des présences terminé', 'success');
        } catch (error) {
            console.error('Erreur lors de l\'export PDF:', error);
            Utils.showToast('Erreur lors de l\'export PDF', 'error');
        } finally {
            Utils.hideLoading();
        }
    }

    async exportCommissionsExcel() {
        try {
            Utils.showLoading();
            
            // Préparer les données pour l'export
            const data = [];
            
            this.commissions.forEach(commission => {
                if (commission.membres && commission.membres.length > 0) {
                    commission.membres.forEach(membre => {
                        data.push({
                            'Commission': commission.nom,
                            'Description': commission.description,
                            'Prénom': membre.prenom || '',
                            'Nom': membre.nom || '',
                            'Téléphone': membre.telephone || '',
                            'Email': membre.email || '',
                            'Poste/Fonction': membre.poste || '',
                            'Responsabilités': membre.responsabilites || '',
                            'Date d\'ajout': membre.date_ajout || ''
                        });
                    });
                } else {
                    // Commission sans membres
                    data.push({
                        'Commission': commission.nom,
                        'Description': commission.description,
                        'Prénom': '',
                        'Nom': '',
                        'Téléphone': '',
                        'Email': '',
                        'Poste/Fonction': '',
                        'Responsabilités': '',
                        'Date d\'ajout': ''
                    });
                }
            });

            // Créer le fichier Excel
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Commissions');

            // Télécharger le fichier
            const fileName = `Commissions_Daara_${new Date().toISOString().split('T')[0]}.xlsx`;
            XLSX.writeFile(wb, fileName);

            Utils.showToast('Export Excel des commissions terminé', 'success');
        } catch (error) {
            console.error('Erreur lors de l\'export Excel:', error);
            Utils.showToast('Erreur lors de l\'export Excel', 'error');
        } finally {
            Utils.hideLoading();
        }
    }

    async exportCommissionsPDF() {
        try {
            Utils.showLoading();
            
            // Utiliser l'API Electron pour ouvrir un dialogue de sauvegarde
            const result = await window.electronAPI.showSaveDialog({
                title: 'Sauvegarder la liste des commissions',
                defaultPath: `Commissions_Daara_${new Date().toISOString().split('T')[0]}.pdf`,
                filters: [
                    { name: 'PDF Files', extensions: ['pdf'] },
                    { name: 'All Files', extensions: ['*'] }
                ]
            });
            
            if (!result.canceled && result.filePath) {
                // Générer le HTML pour l'impression
                const printHTML = this.generatePrintableCommissions();
                
                // Créer une nouvelle fenêtre pour l'impression
                const printWindow = window.open('', '_blank');
                printWindow.document.write(printHTML);
                printWindow.document.close();
                
                // Attendre que le contenu soit chargé puis imprimer
                printWindow.onload = function() {
                    printWindow.print();
                };
                
                Utils.showToast(`Document préparé pour sauvegarde vers: ${result.filePath}`, 'success');
            } else {
                Utils.showToast('Sauvegarde annulée', 'info');
            }
            
            Utils.hideLoading();
            
        } catch (error) {
            Utils.hideLoading();
            // Fallback vers l'impression normale si l'API Electron n'est pas disponible
            this.fallbackPrintCommissions();
        }
    }
    
    fallbackPrintCommissions() {
        try {
            // Créer une nouvelle fenêtre pour l'impression
            const printWindow = window.open('', '_blank');
            
            // Générer le HTML pour l'impression
            const printHTML = this.generatePrintableCommissions();
            
            printWindow.document.write(printHTML);
            printWindow.document.close();
            
            // Attendre que le contenu soit chargé puis imprimer
            printWindow.onload = function() {
                printWindow.print();
            };
            
            Utils.showToast('Document préparé pour impression', 'success');
            
        } catch (error) {
            Utils.handleError(error, 'lors de la préparation de l\'impression');
        }
    }
    
    generatePrintableCommissions() {
        const today = Utils.formatDate(new Date());
        
        let commissionsHTML = '';
        
        this.commissions.forEach((commission, index) => {
            commissionsHTML += `
                <div class="commission-section">
                    <h2 class="commission-title">${index + 1}. ${commission.nom}</h2>
                    <p class="commission-description">${commission.description}</p>
                    
                    ${commission.membres && commission.membres.length > 0 ? `
                        <div class="membres-section">
                            <h3>Membres de la commission (${commission.membres.length})</h3>
                            <table class="membres-table">
                                <thead>
                                    <tr>
                                        <th>N°</th>
                                        <th>Nom & Prénom</th>
                                        <th>Téléphone</th>
                                        <th>Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${commission.membres.map((membre, membreIndex) => `
                                        <tr>
                                            <td>${membreIndex + 1}</td>
                                            <td>${membre.prenom} ${membre.nom}</td>
                                            <td>${membre.telephone || 'N/A'}</td>
                                            <td>${membre.email || 'N/A'}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    ` : '<p class="no-membres">Aucun membre assigné à cette commission</p>'}
                </div>
            `;
        });
        
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Commissions - Daara Re-Creation</title>
                <style>
                    @page {
                        margin: 2cm;
                        size: A4;
                    }
                    
                    body {
                        font-family: Arial, sans-serif;
                        font-size: 12px;
                        line-height: 1.4;
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }
                    
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        border-bottom: 2px solid #333;
                        padding-bottom: 15px;
                    }
                    
                    .header h1 {
                        font-size: 18px;
                        font-weight: bold;
                        margin: 0 0 10px 0;
                    }
                    
                    .header p {
                        margin: 5px 0;
                        font-size: 11px;
                    }
                    
                    .commission-section {
                        page-break-inside: avoid;
                        margin-bottom: 30px;
                        border: 1px solid #ddd;
                        padding: 15px;
                    }
                    
                    .commission-title {
                        font-size: 14px;
                        font-weight: bold;
                        margin: 0 0 10px 0;
                        color: #2563eb;
                        border-bottom: 1px solid #e5e7eb;
                        padding-bottom: 5px;
                    }
                    
                    .commission-description {
                        font-size: 11px;
                        font-style: italic;
                        margin: 0 0 15px 0;
                        color: #666;
                    }
                    
                    .membres-section h3 {
                        font-size: 12px;
                        font-weight: bold;
                        margin: 15px 0 10px 0;
                    }
                    
                    .membres-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 15px;
                    }
                    
                    .membres-table th,
                    .membres-table td {
                        border: 1px solid #ddd;
                        padding: 6px;
                        text-align: left;
                    }
                    
                    .membres-table th {
                        background-color: #f8f9fa;
                        font-weight: bold;
                        font-size: 10px;
                    }
                    
                    .membres-table td {
                        font-size: 10px;
                    }
                    
                    .no-membres {
                        font-style: italic;
                        color: #666;
                        font-size: 11px;
                    }
                    
                    .stats {
                        margin-top: 30px;
                        padding: 15px;
                        background-color: #f8f9fa;
                        border: 1px solid #ddd;
                    }
                    
                    .stats h3 {
                        margin: 0 0 10px 0;
                        font-size: 13px;
                    }
                    
                    .stats-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 10px;
                    }
                    
                    .stat-item {
                        font-size: 11px;
                    }
                    
                    @media print {
                        .commission-section {
                            page-break-inside: avoid;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>COMMISSIONS DU DAARA RE-CREATION</h1>
                    <h2>(02-23 AOÛT 2025)</h2>
                    <p>Document généré le ${today}</p>
                    <p>Total commissions: ${this.commissions.length}</p>
                </div>
                
                ${commissionsHTML}
                
                <div class="stats">
                    <h3>STATISTIQUES GÉNÉRALES</h3>
                    <div class="stats-grid">
                        <div class="stat-item">Total commissions: ${this.commissions.length}</div>
                        <div class="stat-item">Total membres: ${this.commissions.reduce((total, c) => total + (c.membres ? c.membres.length : 0), 0)}</div>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    async exportStatistiquesExcel() {
        Utils.showToast('Export Excel des statistiques en cours de développement', 'info');
    }

    async exportStatistiquesPDF() {
        try {
            Utils.showLoading();
            
            // Utiliser l'API Electron pour ouvrir un dialogue de sauvegarde
            const result = await window.electronAPI.showSaveDialog({
                title: 'Sauvegarder les statistiques',
                defaultPath: `Statistiques_Daara_${new Date().toISOString().split('T')[0]}.pdf`,
                filters: [
                    { name: 'PDF Files', extensions: ['pdf'] },
                    { name: 'All Files', extensions: ['*'] }
                ]
            });
            
            if (!result.canceled && result.filePath) {
                // Générer le HTML pour l'impression
                const printHTML = this.generatePrintableStatistiques();
                
                // Créer une nouvelle fenêtre pour l'impression
                const printWindow = window.open('', '_blank');
                printWindow.document.write(printHTML);
                printWindow.document.close();
                
                // Attendre que le contenu soit chargé puis imprimer
                printWindow.onload = function() {
                    printWindow.print();
                };
                
                Utils.showToast(`Document préparé pour sauvegarde vers: ${result.filePath}`, 'success');
            } else {
                Utils.showToast('Sauvegarde annulée', 'info');
            }
            
            Utils.hideLoading();
            
        } catch (error) {
            Utils.hideLoading();
            this.fallbackPrintStatistiques();
        }
    }

    showFichesOptions() {
        // Créer un modal pour sélectionner les pensionnaires
        const modalHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="fichesModal">
                <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
                    <h3 class="text-lg font-semibold mb-4">Sélectionner les pensionnaires</h3>
                    <div class="space-y-2 mb-4">
                        <label class="flex items-center">
                            <input type="checkbox" id="selectAll" class="mr-2">
                            <span class="font-medium">Sélectionner tout</span>
                        </label>
                    </div>
                    <div class="space-y-2 max-h-48 overflow-y-auto" id="pensionnairesList">
                        ${this.pensionnaires.map(p => `
                            <label class="flex items-center">
                                <input type="checkbox" name="pensionnaire" value="${p.id}" class="mr-2">
                                <span>${p.prenom} ${p.nom} (${p.section})</span>
                            </label>
                        `).join('')}
                    </div>
                    <div class="flex justify-end space-x-2 mt-4">
                        <button onclick="document.getElementById('fichesModal').remove()" class="btn-outline">
                            Annuler
                        </button>
                        <button onclick="rapports.generateSelectedFiches()" class="btn-primary">
                            Générer PDF
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Gérer la sélection "tout"
        document.getElementById('selectAll').addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('input[name="pensionnaire"]');
            checkboxes.forEach(cb => cb.checked = this.checked);
        });
    }

    showCustomReportOptions() {
        Utils.showToast('Rapports personnalisés en cours de développement', 'info');
    }
    
    async generateSelectedFiches() {
        const selectedIds = Array.from(document.querySelectorAll('input[name="pensionnaire"]:checked'))
            .map(cb => parseInt(cb.value));
        
        if (selectedIds.length === 0) {
            Utils.showToast('Veuillez sélectionner au moins un pensionnaire', 'warning');
            return;
        }
        
        document.getElementById('fichesModal').remove();
        
        try {
            Utils.showLoading();
            
            const result = await window.electronAPI.showSaveDialog({
                title: 'Sauvegarder les fiches individuelles',
                defaultPath: `Fiches_Pensionnaires_${new Date().toISOString().split('T')[0]}.pdf`,
                filters: [
                    { name: 'PDF Files', extensions: ['pdf'] },
                    { name: 'All Files', extensions: ['*'] }
                ]
            });
            
            if (!result.canceled && result.filePath) {
                const selectedPensionnaires = this.pensionnaires.filter(p => selectedIds.includes(p.id));
                const printHTML = this.generatePrintableFiches(selectedPensionnaires);
                
                const printWindow = window.open('', '_blank');
                printWindow.document.write(printHTML);
                printWindow.document.close();
                
                printWindow.onload = function() {
                    printWindow.print();
                };
                
                Utils.showToast(`Fiches préparées pour sauvegarde vers: ${result.filePath}`, 'success');
            } else {
                Utils.showToast('Sauvegarde annulée', 'info');
            }
            
            Utils.hideLoading();
            
        } catch (error) {
            Utils.hideLoading();
            Utils.handleError(error, 'lors de la génération des fiches');
        }
    }
    
    generatePrintableFiches(pensionnaires) {
        const today = Utils.formatDate(new Date());
        
        let fichesHTML = '';
        
        pensionnaires.forEach((p, index) => {
            if (index > 0) fichesHTML += '<div class="page-break"></div>';
            
            fichesHTML += `
                <div class="fiche-container">
                    <div class="fiche-header">
                        <h2>FICHE D'INSCRIPTION</h2>
                        <h3>DAARA RE-CREATION</h3>
                        <p>02 au 23 août 2025</p>
                    </div>
                    
                    <div class="fiche-content">
                        <div class="info-row">
                            <span class="label">Prénoms & Nom :</span>
                            <span class="value">${p.prenom} ${p.nom}</span>
                        </div>
                        
                        <div class="info-row">
                            <span class="label">Date et lieu de naissance :</span>
                            <span class="value">${p.date_naissance || ''} - ${p.lieu_naissance || ''}</span>
                        </div>
                        
                        <div class="info-row">
                            <span class="label">Adresse :</span>
                            <span class="value">${p.adresse || ''}</span>
                        </div>
                        
                        <div class="info-row">
                            <span class="label">Section de base :</span>
                            <span class="value">${p.section || ''}</span>
                        </div>
                        
                        <div class="info-row">
                            <span class="label">Type de pensionnaire :</span>
                            <span class="value">${p.type_pensionnaire || ''}</span>
                        </div>
                        
                        <div class="info-row">
                            <span class="label">Prénom du Père :</span>
                            <span class="value">${p.prenom_pere || ''}</span>
                            <span class="label">Tél :</span>
                            <span class="value">${p.tel_pere || ''}</span>
                        </div>
                        
                        <div class="info-row">
                            <span class="label">Prénom & Nom de la Mère :</span>
                            <span class="value">${p.prenom_mere || ''} ${p.nom_mere || ''}</span>
                            <span class="label">Tél :</span>
                            <span class="value">${p.tel_mere || ''}</span>
                        </div>
                        
                        <div class="info-row">
                            <span class="label">Encadreur :</span>
                            <span class="value">${p.encadreur || ''}</span>
                            <span class="label">Tél :</span>
                            <span class="value">${p.tel_encadreur || ''}</span>
                        </div>
                        
                        <div class="info-row">
                            <span class="label">Le pensionnaire est-il scolarisé ?</span>
                            <span class="value">${p.scolarise || ''}</span>
                        </div>
                        
                        <div class="info-row">
                            <span class="label">Si OUI en Arabe ou bien en Français ?</span>
                            <span class="value">${p.langue_enseignement || ''}</span>
                        </div>
                        
                        <div class="info-row">
                            <span class="label">Niveau d'études :</span>
                            <span class="value">${p.niveau_etudes || ''}</span>
                            <span class="label">École Fréquentée :</span>
                            <span class="value">${p.ecole_frequentee || ''}</span>
                        </div>
                        
                        <div class="info-row">
                            <span class="label">Le pensionnaire souffre-t-il d'une maladie ?</span>
                            <span class="value">${p.maladie || ''}</span>
                        </div>
                        
                        <div class="info-row">
                            <span class="label">Si OUI laquelle ?</span>
                            <span class="value">${p.type_maladie || ''}</span>
                        </div>
                        
                        <div class="info-row">
                            <span class="label">Suit-il un traitement ?</span>
                            <span class="value">${p.traitement || ''}</span>
                        </div>
                        
                        <div class="info-row">
                            <span class="label">Participation du pensionnaire (somme) :</span>
                            <span class="value">${p.participation || ''}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Fiches d'Inscription - Daara Re-Creation</title>
                <style>
                    @page { 
                        size: A4; 
                        margin: 20mm; 
                    }
                    
                    body {
                        font-family: Arial, sans-serif;
                        font-size: 12px;
                        line-height: 1.4;
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }
                    
                    .page-break {
                        page-break-before: always;
                    }
                    
                    .fiche-container {
                        width: 100%;
                        border: 2px solid #333;
                        padding: 20px;
                        margin-bottom: 20px;
                    }
                    
                    .fiche-header {
                        text-align: center;
                        margin-bottom: 30px;
                        border-bottom: 1px solid #333;
                        padding-bottom: 15px;
                    }
                    
                    .fiche-header h2 {
                        margin: 0 0 10px 0;
                        font-size: 18px;
                        font-weight: bold;
                    }
                    
                    .fiche-header h3 {
                        margin: 0 0 5px 0;
                        font-size: 16px;
                        color: #666;
                    }
                    
                    .fiche-header p {
                        margin: 0;
                        font-size: 14px;
                        color: #666;
                    }
                    
                    .fiche-content {
                        margin-top: 20px;
                    }
                    
                    .info-row {
                        margin-bottom: 15px;
                        display: flex;
                        align-items: center;
                        flex-wrap: wrap;
                        border-bottom: 1px dotted #ccc;
                        padding-bottom: 8px;
                    }
                    
                    .label {
                        font-weight: bold;
                        margin-right: 10px;
                        min-width: 200px;
                    }
                    
                    .value {
                        flex: 1;
                        border-bottom: 1px solid #333;
                        min-height: 20px;
                        padding: 2px 5px;
                        margin-right: 10px;
                    }
                    
                    @media print {
                        body { margin: 0; }
                        .fiche-container { 
                            border: 2px solid #000;
                            margin-bottom: 0;
                        }
                    }
                </style>
            </head>
            <body>
                ${fichesHTML}
            </body>
            </html>
        `;
    }
    
    generatePrintableStatistiques() {
        const today = Utils.formatDate(new Date());
        const totalPensionnaires = this.pensionnaires.length;
        const sections = ['Rawda', '1ère section', '2ème section', '3ème section'];
        
        // Calculer les statistiques par section
        let sectionsStats = '';
        sections.forEach(section => {
            const pensionnairesSection = this.pensionnaires.filter(p => p.section === section);
            const membres = pensionnairesSection.filter(p => p.type_pensionnaire === 'Membre').length;
            const sympathisants = pensionnairesSection.filter(p => p.type_pensionnaire === 'Sympathisant').length;
            
            sectionsStats += `
                <tr>
                    <td>${section}</td>
                    <td>${pensionnairesSection.length}</td>
                    <td>${membres}</td>
                    <td>${sympathisants}</td>
                </tr>
            `;
        });
        
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Statistiques - Daara Re-Creation</title>
                <style>
                    @page { size: A4; margin: 20mm; }
                    body { font-family: Arial, sans-serif; font-size: 12px; line-height: 1.6; }
                    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
                    .stats-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                    .stats-table th, .stats-table td { border: 1px solid #333; padding: 8px; text-align: center; }
                    .stats-table th { background-color: #f5f5f5; font-weight: bold; }
                    .summary { margin-top: 30px; padding: 20px; border: 1px solid #333; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>STATISTIQUES DAARA RE-CREATION</h1>
                    <h2>02 au 23 août 2025</h2>
                    <p>Rapport généré le ${today}</p>
                </div>
                
                <h3>Répartition par Section</h3>
                <table class="stats-table">
                    <thead>
                        <tr>
                            <th>Section</th>
                            <th>Total</th>
                            <th>Membres</th>
                            <th>Sympathisants</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sectionsStats}
                        <tr style="font-weight: bold; background-color: #f0f0f0;">
                            <td>TOTAL</td>
                            <td>${totalPensionnaires}</td>
                            <td>${this.pensionnaires.filter(p => p.type_pensionnaire === 'Membre').length}</td>
                            <td>${this.pensionnaires.filter(p => p.type_pensionnaire === 'Sympathisant').length}</td>
                        </tr>
                    </tbody>
                </table>
                
                <div class="summary">
                    <h3>Résumé Général</h3>
                    <p><strong>Total des pensionnaires :</strong> ${totalPensionnaires}</p>
                    <p><strong>Nombre de commissions :</strong> ${this.commissions.length}</p>
                    <p><strong>Sections actives :</strong> ${sections.length}</p>
                </div>
            </body>
            </html>
        `;
    }
    
    fallbackPrintStatistiques() {
        try {
            const printWindow = window.open('', '_blank');
            const printHTML = this.generatePrintableStatistiques();
            
            printWindow.document.write(printHTML);
            printWindow.document.close();
            
            printWindow.onload = function() {
                printWindow.print();
            };
            
            Utils.showToast('Document préparé pour impression', 'success');
            
        } catch (error) {
            Utils.handleError(error, 'lors de la préparation de l\'impression');
        }
    }
}

// Créer une instance globale
window.rapports = new Rapports();
