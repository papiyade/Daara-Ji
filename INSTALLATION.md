# Guide d'Installation - Daara Re-Creation Manager

Ce guide vous accompagne pas à pas pour installer et utiliser l'application Daara Re-Creation Manager sur votre ordinateur.

## 📋 Prérequis

### Système d'exploitation supporté
- ✅ Windows 10/11 (64-bit)
- ✅ macOS 10.14+ (Intel et Apple Silicon)
- ✅ Linux Ubuntu 18.04+ / Debian 10+ / CentOS 8+

### Logiciels requis
- **Node.js** version 16 ou supérieure
- **npm** (inclus avec Node.js) ou **yarn**

## 🚀 Installation Rapide

### Étape 1 : Installer Node.js

#### Windows
1. Aller sur [nodejs.org](https://nodejs.org/)
2. Télécharger la version LTS (recommandée)
3. Exécuter l'installateur et suivre les instructions
4. Redémarrer l'ordinateur

#### macOS
```bash
# Avec Homebrew (recommandé)
brew install node

# Ou télécharger depuis nodejs.org
```

#### Linux (Ubuntu/Debian)
```bash
# Méthode recommandée avec NodeSource
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérifier l'installation
node --version
npm --version
```

### Étape 2 : Télécharger le projet

#### Option A : Téléchargement ZIP
1. Aller sur [GitHub - Daara-Ji](https://github.com/papiyade/Daara-Ji)
2. Cliquer sur "Code" → "Download ZIP"
3. Extraire le fichier ZIP dans un dossier de votre choix

#### Option B : Git Clone (recommandé)
```bash
git clone https://github.com/papiyade/Daara-Ji.git
cd Daara-Ji
```

### Étape 3 : Installation des dépendances

Ouvrir un terminal/invite de commande dans le dossier du projet :

```bash
# Installer les dépendances
npm install

# Attendre que l'installation se termine (peut prendre quelques minutes)
```

### Étape 4 : Lancer l'application

```bash
# Démarrer l'application en mode développement
npm start
```

L'application devrait s'ouvrir automatiquement dans une nouvelle fenêtre.

## 📦 Créer un Exécutable

Pour créer un fichier exécutable que vous pouvez installer sur d'autres ordinateurs :

### Windows (.exe)
```bash
npm run build:win
```
Le fichier sera créé dans `dist/Daara Re-Creation Manager Setup.exe`

### macOS (.dmg)
```bash
npm run build:mac
```
Le fichier sera créé dans `dist/Daara Re-Creation Manager.dmg`

### Linux (.AppImage)
```bash
npm run build:linux
```
Le fichier sera créé dans `dist/Daara Re-Creation Manager.AppImage`

### Toutes les plateformes
```bash
npm run build:all
```

## 🔧 Configuration Avancée

### Personnaliser l'icône de l'application

1. Créer vos icônes dans le dossier `assets/` :
   - `icon.ico` (Windows, 256x256)
   - `icon.icns` (macOS, 512x512)
   - `icon.png` (Linux, 512x512)

2. Reconstruire l'application :
```bash
npm run build
```

### Modifier la configuration

Éditer le fichier `package.json` section `"build"` pour :
- Changer le nom de l'application
- Modifier l'ID de l'application
- Personnaliser les options d'installation

## 🐛 Résolution des Problèmes

### Erreur "node: command not found"
**Solution :** Node.js n'est pas installé ou pas dans le PATH
```bash
# Vérifier l'installation
node --version
npm --version

# Si pas installé, suivre l'étape 1
```

### Erreur "npm install" échoue
**Solutions possibles :**
```bash
# Nettoyer le cache npm
npm cache clean --force

# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install

# Utiliser yarn à la place
npm install -g yarn
yarn install
```

### L'application ne démarre pas
**Solutions :**
1. Vérifier que toutes les dépendances sont installées
2. Redémarrer le terminal
3. Vérifier les permissions du dossier
```bash
# Réinstaller Electron
npm install electron --save-dev
```

### Erreur de construction (build)
**Solutions :**
```bash
# Installer electron-builder globalement
npm install -g electron-builder

# Nettoyer et reconstruire
npm run clean
npm install
npm run build
```

### Base de données corrompue
**Solution :**
1. Fermer l'application
2. Supprimer le fichier `daara_data.db` dans le dossier de l'application
3. Relancer l'application (la base sera recréée automatiquement)

### Problèmes d'export Excel/PDF
**Vérifications :**
1. Vérifier la connexion internet (pour les CDN)
2. Ouvrir les outils développeur (F12) et vérifier la console
3. Réinstaller les dépendances

## 📱 Mode PWA (Navigateur)

L'application peut aussi fonctionner dans un navigateur web :

1. Ouvrir le fichier `src/renderer/index.html` dans Chrome/Edge
2. Cliquer sur l'icône d'installation dans la barre d'adresse
3. L'application sera installée comme PWA

**Limitations du mode PWA :**
- Pas d'accès au système de fichiers local
- Exports limités (téléchargements uniquement)
- Pas de notifications système

## 🔄 Mise à Jour

Pour mettre à jour l'application :

1. Télécharger la nouvelle version
2. Sauvegarder votre fichier `daara_data.db`
3. Remplacer les fichiers de l'application
4. Restaurer votre base de données
5. Relancer l'installation des dépendances si nécessaire

## 📞 Support Technique

### Avant de demander de l'aide

1. Vérifier ce guide de dépannage
2. Consulter les logs d'erreur (F12 → Console)
3. Vérifier que votre système répond aux prérequis

### Obtenir de l'aide

- **GitHub Issues :** [Créer une issue](https://github.com/papiyade/Daara-Ji/issues)
- **Email :** contact@daara-recreation.com
- **Documentation :** Consulter le README.md

### Informations à fournir

Quand vous demandez de l'aide, incluez :
- Système d'exploitation et version
- Version de Node.js (`node --version`)
- Message d'erreur complet
- Étapes pour reproduire le problème

## ✅ Vérification de l'Installation

Pour vérifier que tout fonctionne correctement :

1. ✅ L'application se lance sans erreur
2. ✅ Vous pouvez ajouter un pensionnaire test
3. ✅ Les présences se marquent correctement
4. ✅ Les exports Excel/PDF fonctionnent
5. ✅ Les alertes s'affichent
6. ✅ La base de données se sauvegarde

Si tous ces points sont validés, votre installation est réussie ! 🎉

---

**Bon usage de l'application Daara Re-Creation Manager !**

