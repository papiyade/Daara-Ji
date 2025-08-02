# Daara Re-Creation Manager

Application desktop de gestion du Daara Re-Creation (02-23 août 2025).

## 🌟 Fonctionnalités

### 📊 Dashboard Interactif
- Vue d'ensemble des statistiques du Daara
- Graphiques en temps réel des présences
- Alertes et notifications importantes
- Actions rapides pour les tâches courantes

### 👥 Gestion des Pensionnaires
- **CRUD complet** : Ajouter, modifier, supprimer, consulter
- **Fiche d'inscription complète** avec tous les champs requis :
  - Informations personnelles (nom, prénom, date/lieu de naissance, adresse)
  - Classification (section, type : Membre/Sympathisant)
  - Contacts famille (père, mère, encadreur avec téléphones)
  - Scolarisation (statut, langue, niveau, école)
  - Informations santé (maladies, traitements)
  - Participation financière
- **Filtres et recherche** avancés
- **Pagination** pour une navigation fluide
- **Exports** Excel et PDF

### ✅ Gestion des Présences
- Marquage quotidien des présences (Lundi-Samedi)
- Interface intuitive par section
- Statuts : Présent, Absent, Excusé
- Actions groupées par section
- Statistiques en temps réel
- **Système d'alertes** automatique pour absences répétées (3 fois/semaine)

### 🏛️ Gestion des Commissions
- **5 Commissions prédéfinies** :
  - CIPS (Commission de l'Intelligence et de la Perception Spirituelle)
  - CA (Commission Administrative)
  - CTC (Commission de Trésor et Capacitation)
  - Commission Logistique
  - PF (Points Focaux)
- Gestion des membres de chaque commission
- Vue d'ensemble des responsabilités

### 🚨 Système d'Alertes
- Détection automatique des absences répétées
- Notifications visuelles dans l'interface
- Suivi et résolution des alertes
- Badge de notification dans la navigation

### 📈 Rapports et Exports
- **Export Excel** : Listes, statistiques, présences
- **Export PDF** : Fiches individuelles, rapports
- **Impression** directe des documents
- Rapports personnalisés

## 🛠️ Technologies Utilisées

- **Electron.js** - Framework desktop multiplateforme
- **HTML5/CSS3/JavaScript** - Interface utilisateur
- **Tailwind CSS** - Framework CSS moderne et responsive
- **SQLite** - Base de données locale
- **Chart.js** - Graphiques interactifs
- **Better-SQLite3** - Driver SQLite performant
- **XLSX** - Export Excel
- **jsPDF** - Génération PDF

## 📋 Prérequis

- **Node.js** (version 16 ou supérieure)
- **npm** ou **yarn**
- **Git**

## 🚀 Installation et Démarrage

### 1. Cloner le repository
```bash
git clone https://github.com/papiyade/Daara-Ji.git
cd Daara-Ji
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Compiler les styles CSS
```bash
npm run css:build
```

### 4. Démarrer l'application en mode développement
```bash
npm run dev
```

### 5. Démarrer l'application en mode production
```bash
npm start
```

## 📦 Packaging et Distribution

### Construire pour toutes les plateformes
```bash
npm run build
```

### Construire pour Windows uniquement
```bash
npm run build:win
```

### Construire pour macOS uniquement
```bash
npm run build:mac
```

### Construire pour Linux uniquement
```bash
npm run build:linux
```

Les fichiers d'installation seront générés dans le dossier `dist/`.

## 📁 Structure du Projet

```
Daara-Ji/
├── main.js                    # Process principal Electron
├── preload.js                 # Script de préchargement
├── package.json               # Configuration npm
├── tailwind.config.js         # Configuration Tailwind
├── postcss.config.js          # Configuration PostCSS
├── src/
│   ├── database/
│   │   ├── schema.sql         # Schéma de base de données
│   │   └── database.js        # Gestionnaire de base de données
│   └── renderer/
│       ├── index.html         # Page principale
│       ├── css/
│       │   ├── input.css      # Styles source
│       │   └── styles.css     # Styles compilés
│       └── js/
│           ├── app.js         # Application principale
│           ├── navigation.js  # Gestion navigation
│           ├── utils.js       # Utilitaires
│           ├── dashboard.js   # Module Dashboard
│           ├── pensionnaires.js # Module Pensionnaires
│           ├── presences.js   # Module Présences
│           ├── commissions.js # Module Commissions
│           ├── alertes.js     # Module Alertes
│           └── rapports.js    # Module Rapports
├── data/                      # Base de données SQLite (créé automatiquement)
├── dist/                      # Fichiers de distribution (créé lors du build)
└── docs/                      # Documentation
```

## 🎯 Utilisation

### Premier Démarrage
1. L'application créera automatiquement la base de données SQLite
2. Les commissions seront pré-créées
3. Vous pouvez commencer à ajouter des pensionnaires

### Workflow Quotidien
1. **Matin** : Consulter le dashboard pour les statistiques
2. **Présences** : Marquer les présences de la journée
3. **Alertes** : Vérifier et traiter les alertes d'absences
4. **Gestion** : Ajouter/modifier des pensionnaires si nécessaire

### Exports et Rapports
- Utilisez le module "Rapports" pour générer des exports
- Les fichiers sont sauvegardés dans le dossier de téléchargements
- Formats disponibles : Excel (.xlsx) et PDF

## 🔧 Configuration

### Base de Données
- La base de données SQLite est créée automatiquement dans `data/daara.db`
- Sauvegarde automatique des données
- Pas de configuration requise

### Personnalisation
- Modifiez `tailwind.config.js` pour personnaliser les couleurs
- Ajustez les styles dans `src/renderer/css/input.css`
- Recompilez avec `npm run css:build`

## 🐛 Dépannage

### Problèmes courants

**L'application ne démarre pas**
- Vérifiez que Node.js est installé : `node --version`
- Réinstallez les dépendances : `rm -rf node_modules && npm install`

**Erreur de base de données**
- Supprimez le dossier `data/` et redémarrez l'application
- La base sera recréée automatiquement

**Styles non appliqués**
- Recompilez les CSS : `npm run css:build`
- Vérifiez que Tailwind est correctement configuré

## 📞 Support

Pour toute question ou problème :
- Créez une issue sur GitHub
- Contactez l'équipe de développement
- Consultez la documentation dans le dossier `docs/`

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.

## 🙏 Remerciements

Développé pour le Daara Re-Creation avec ❤️

---

**Version** : 1.0.0  
**Date** : Août 2025  
**Auteur** : Équipe Daara Re-Creation
