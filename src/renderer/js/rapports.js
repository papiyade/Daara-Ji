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
            
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Configuration
            const pageWidth = doc.internal.pageSize.width;
            const margin = 20;
            let yPosition = 30;
            
            // Titre
            doc.setFontSize(18);
            doc.setFont(undefined, 'bold');
            doc.text('LISTE DES PENSIONNAIRES - DAARA RE-CREATION', pageWidth / 2, yPosition, { align: 'center' });
            
            yPosition += 10;
            doc.setFontSize(12);
            doc.setFont(undefined, 'normal');
            doc.text(`Généré le ${Utils.formatDate(new Date())}`, pageWidth / 2, yPosition, { align: 'center' });
            
            yPosition += 20;
            
            // Grouper par section
            const sections = ['Rawda', '1ère section', '2ème section', '3ème section'];
            
            for (const section of sections) {
                const pensionnairesSection = this.pensionnaires.filter(p => p.section === section);
                if (pensionnairesSection.length === 0) continue;
                
                // Vérifier si on a assez de place pour la section
                if (yPosition > 250) {
                    doc.addPage();
                    yPosition = 30;
                }
                
                // Titre de section
                doc.setFontSize(14);
                doc.setFont(undefined, 'bold');
                doc.text(section.toUpperCase(), margin, yPosition);
                yPosition += 10;
                
                // Liste des pensionnaires
                doc.setFontSize(10);
                doc.setFont(undefined, 'normal');
                
                pensionnairesSection.forEach((p, index) => {
                    if (yPosition > 270) {
                        doc.addPage();
                        yPosition = 30;
                    }
                    
                    const ligne = `${index + 1}. ${p.prenom} ${p.nom} - ${p.type_pensionnaire}`;
                    doc.text(ligne, margin + 5, yPosition);
                    yPosition += 6;
                    
                    if (p.tel_pere || p.tel_mere) {
                        const contact = `   Contact: ${p.tel_pere || p.tel_mere}`;
                        doc.text(contact, margin + 5, yPosition);
                        yPosition += 6;
                    }
                });
                
                yPosition += 10;
            }
            
            // Statistiques en bas
            if (yPosition > 240) {
                doc.addPage();
                yPosition = 30;
            }
            
            yPosition += 20;
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text('STATISTIQUES', margin, yPosition);
            yPosition += 10;
            
            doc.setFont(undefined, 'normal');
            doc.text(`Total pensionnaires: ${this.pensionnaires.length}`, margin, yPosition);
            yPosition += 6;
            doc.text(`Membres: ${this.pensionnaires.filter(p => p.type_pensionnaire === 'Membre').length}`, margin, yPosition);
            yPosition += 6;
            doc.text(`Sympathisants: ${this.pensionnaires.filter(p => p.type_pensionnaire === 'Sympathisant').length}`, margin, yPosition);
            
            // Sauvegarder
            const fileName = `Pensionnaires_Daara_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);
            
            Utils.showToast('Export PDF des pensionnaires terminé', 'success');
        } catch (error) {
            console.error('Erreur lors de l\'export PDF:', error);
            Utils.showToast('Erreur lors de l\'export PDF', 'error');
        } finally {
            Utils.hideLoading();
        }
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
            
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Configuration
            const pageWidth = doc.internal.pageSize.width;
            const margin = 20;
            let yPosition = 30;
            
            // Titre
            doc.setFontSize(18);
            doc.setFont(undefined, 'bold');
            doc.text('COMMISSIONS DU DAARA RE-CREATION', pageWidth / 2, yPosition, { align: 'center' });
            
            yPosition += 10;
            doc.setFontSize(12);
            doc.setFont(undefined, 'normal');
            doc.text(`Généré le ${Utils.formatDate(new Date())}`, pageWidth / 2, yPosition, { align: 'center' });
            
            yPosition += 20;
            
            // Parcourir chaque commission
            this.commissions.forEach((commission, index) => {
                // Vérifier si on a assez de place
                if (yPosition > 240) {
                    doc.addPage();
                    yPosition = 30;
                }
                
                // Titre de commission
                doc.setFontSize(14);
                doc.setFont(undefined, 'bold');
                doc.text(`${index + 1}. ${commission.nom}`, margin, yPosition);
                yPosition += 8;
                
                // Description
                doc.setFontSize(10);
                doc.setFont(undefined, 'italic');
                const descriptionLines = doc.splitTextToSize(commission.description, pageWidth - 2 * margin);
                doc.text(descriptionLines, margin + 5, yPosition);
                yPosition += descriptionLines.length * 5 + 5;
                
                // Membres
                if (commission.membres && commission.membres.length > 0) {
                    doc.setFont(undefined, 'bold');
                    doc.text('Membres:', margin + 5, yPosition);
                    yPosition += 6;
                    
                    doc.setFont(undefined, 'normal');
                    commission.membres.forEach((membre, membreIndex) => {
                        if (yPosition > 270) {
                            doc.addPage();
                            yPosition = 30;
                        }
                        
                        let membreInfo = `  • ${membre.prenom} ${membre.nom}`;
                        if (membre.poste) membreInfo += ` - ${membre.poste}`;
                        if (membre.telephone) membreInfo += ` (${membre.telephone})`;
                        
                        doc.text(membreInfo, margin + 10, yPosition);
                        yPosition += 5;
                        
                        if (membre.email) {
                            doc.text(`    Email: ${membre.email}`, margin + 10, yPosition);
                            yPosition += 5;
                        }
                        
                        if (membre.responsabilites) {
                            const respLines = doc.splitTextToSize(`    Responsabilités: ${membre.responsabilites}`, pageWidth - 2 * margin - 20);
                            doc.text(respLines, margin + 10, yPosition);
                            yPosition += respLines.length * 5;
                        }
                        
                        yPosition += 2;
                    });
                } else {
                    doc.setFont(undefined, 'italic');
                    doc.text('Aucun membre assigné', margin + 5, yPosition);
                    yPosition += 6;
                }
                
                yPosition += 10;
            });
            
            // Résumé en bas
            if (yPosition > 240) {
                doc.addPage();
                yPosition = 30;
            }
            
            yPosition += 10;
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text('RÉSUMÉ', margin, yPosition);
            yPosition += 10;
            
            doc.setFont(undefined, 'normal');
            doc.text(`Nombre total de commissions: ${this.commissions.length}`, margin, yPosition);
            yPosition += 6;
            
            const totalMembres = this.commissions.reduce((total, c) => total + (c.membres ? c.membres.length : 0), 0);
            doc.text(`Nombre total de membres: ${totalMembres}`, margin, yPosition);
            
            // Sauvegarder
            const fileName = `Commissions_Daara_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);
            
            Utils.showToast('Export PDF des commissions terminé', 'success');
        } catch (error) {
            console.error('Erreur lors de l\'export PDF:', error);
            Utils.showToast('Erreur lors de l\'export PDF', 'error');
        } finally {
            Utils.hideLoading();
        }
    }

    async exportStatistiquesExcel() {
        Utils.showToast('Export Excel des statistiques en cours de développement', 'info');
    }

    async exportStatistiquesPDF() {
        Utils.showToast('Export PDF des statistiques en cours de développement', 'info');
    }

    showFichesOptions() {
        Utils.showToast('Génération de fiches individuelles en cours de développement', 'info');
    }

    showCustomReportOptions() {
        Utils.showToast('Rapports personnalisés en cours de développement', 'info');
    }
}

// Créer une instance globale
window.rapports = new Rapports();
