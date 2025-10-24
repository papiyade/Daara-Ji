# Daara Re-Creation Manager

Application desktop/PWA pour la gestion complète du Daara Re-Creation (02-23 Août 2025).

## 🎯 Fonctionnalités

### 📊 Dashboard Interactif
- Vue d'ensemble des statistiques du Daara
- Graphiques et métriques en temps réel
- Alertes et notifications importantes

### 👥 Gestion des Pensionnaires
- **CRUD complet** : Créer, lire, modifier, supprimer
- **Fiche d'inscription complète** avec tous les champs requis :
  - Informations personnelles (nom, prénom, date/lieu de naissance, adresse)
  - Classification par section (Rawda, 1ère, 2ème, 3ème section)
  - Type de pensionnaire (Membre/Sympathisant)
  - Contacts famille (père, mère, encadreur)
  - Informations scolaires et de santé
  - Participation financière
- **Export** : Excel et PDF

### ✅ Gestion des Présences/Absences
- Marquage quotidien des présences (Lundi-Samedi)
- Interface par section avec statistiques en temps réel
- **Système d'alertes automatiques** : 3 absences/semaine = alerte
- Export des rapports de présence

### 🏛️ Gestion des Commissions
- **5 Commissions** : CIPS, CA, CTC, Commission Logistique, Points Focaux
- Gestion des membres avec informations complètes
- Export des listes de commissions

### 🚨 Système d'Alertes
- Détection automatique des absences répétées
- Notifications en temps réel
- Gestion des alertes (marquer comme lu, résoudre)

### 📈 Rapports et Exports
- **Export Excel** : Pensionnaires, présences, commissions, statistiques
- **Export PDF** : Listes formatées, rapports détaillés
- **Fiches individuelles** des pensionnaires
- **Rapports personnalisés**

## 🛠️ Technologies Utilisées

- **Frontend** : HTML5, CSS3 (Tailwind CSS), JavaScript (ES6+)
- **Desktop** : Electron.js
- **Base de données** : SQLite (stockage local)
- **Exports** : SheetJS (Excel), jsPDF (PDF)
- **Charts** : Chart.js

## 📦 Installation et Configuration

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn

### 1. Cloner le projet
```bash
git clone https://github.com/papiyade/Daara-Ji.git
cd Daara-Ji
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Lancer l'application en mode développement
```bash
npm start
```

### 4. Construire l'application pour la production
```bash
npm run build
```

### 5. Packager l'application (exécutable)
```bash
# Pour Windows
npm run build:win

# Pour macOS
npm run build:mac

# Pour Linux
npm run build:linux

# Pour toutes les plateformes
npm run build:all
```

## 📁 Structure du Projet

```
Daara-Ji/
├── src/
│   ├── main/                 # Processus principal Electron
│   │   └── main.js
│   └── renderer/             # Interface utilisateur
│       ├── css/
│       │   └── styles.css    # Styles Tailwind CSS
│       ├── js/
│       │   ├── utils.js      # Utilitaires
│       │   ├── storage.js    # Gestion SQLite
│       │   ├── navigation.js # Navigation
│       │   ├── dashboard.js  # Dashboard
│       │   ├── pensionnaires.js # Gestion pensionnaires
│       │   ├── presences.js  # Gestion présences
│       │   ├── commissions.js # Gestion commissions
│       │   ├── alertes.js    # Système d'alertes
│       │   └── rapports.js   # Exports et rapports
│       └── index.html        # Page principale
├── package.json
├── tailwind.config.js        # Configuration Tailwind
└── README.md
```

## 🚀 Utilisation

### Premier Lancement
1. L'application créera automatiquement la base de données SQLite
2. Les 5 commissions seront initialisées automatiquement
3. Vous pouvez commencer à ajouter des pensionnaires

### Gestion Quotidienne
1. **Matin** : Marquer les présences dans l'onglet "Présences"
2. **Vérifier** les alertes pour les absences répétées
3. **Exporter** les rapports selon les besoins

### Exports et Rapports
- Tous les exports sont sauvegardés dans le dossier de téléchargements
- Les fichiers sont nommés avec la date pour éviter les conflits
- Format Excel pour les données tabulaires
- Format PDF pour les rapports formatés

## 🔧 Configuration Avancée

### Base de Données
- Fichier SQLite : `daara_data.db` (créé automatiquement)
- Sauvegarde automatique à chaque modification
- Possibilité de sauvegarde manuelle via l'interface

### Personnalisation
- Modifier les sections dans `src/renderer/js/pensionnaires.js`
- Ajouter des commissions dans `src/renderer/js/storage.js`
- Personnaliser les alertes dans `src/renderer/js/alertes.js`

## 📱 Mode PWA (Progressive Web App)

L'application peut également fonctionner comme PWA dans un navigateur :

1. Ouvrir `src/renderer/index.html` dans un navigateur moderne
2. Installer comme application web (Chrome/Edge)
3. Fonctionnalités limitées (pas d'accès fichier système)

## 🐛 Dépannage

### Problèmes Courants

**L'application ne démarre pas**
- Vérifier que Node.js est installé
- Supprimer `node_modules` et relancer `npm install`

**Erreurs d'export**
- Vérifier que les bibliothèques XLSX et jsPDF sont chargées
- Contrôler la console développeur (F12)

**Base de données corrompue**
- Supprimer le fichier `daara_data.db`
- Relancer l'application (recréation automatique)

### Logs et Debug
- Ouvrir les outils développeur : `Ctrl+Shift+I` (Windows/Linux) ou `Cmd+Option+I` (Mac)
- Les erreurs sont affichées dans la console

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Créer une issue sur GitHub
- Contacter l'équipe de développement

---

**Développé avec ❤️ pour le Daara Re-Creation**

