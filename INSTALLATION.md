# Guide d'Installation - Daara Re-Creation Manager

Ce guide vous accompagne pas à pas pour installer et utiliser l'application de gestion du Daara Re-Creation.

## 📋 Prérequis Système

### Configuration Minimale
- **Système d'exploitation** : Windows 10/11, macOS 10.14+, ou Linux Ubuntu 18.04+
- **RAM** : 4 GB minimum, 8 GB recommandé
- **Espace disque** : 500 MB pour l'application + espace pour les données
- **Résolution écran** : 1280x720 minimum, 1920x1080 recommandé

### Logiciels Requis
- **Node.js** version 16 ou supérieure
- **npm** (inclus avec Node.js) ou **yarn**
- **Git** pour cloner le repository

## 🚀 Installation Étape par Étape

### Étape 1 : Installer Node.js

#### Windows
1. Téléchargez Node.js depuis https://nodejs.org/
2. Exécutez l'installateur et suivez les instructions
3. Vérifiez l'installation : ouvrez CMD et tapez `node --version`

#### macOS
```bash
# Avec Homebrew (recommandé)
brew install node

# Ou téléchargez depuis https://nodejs.org/
```

#### Linux (Ubuntu/Debian)
```bash
# Méthode recommandée avec NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérification
node --version
npm --version
```

### Étape 2 : Cloner le Projet

```bash
# Cloner le repository
git clone https://github.com/papiyade/Daara-Ji.git

# Naviguer dans le dossier
cd Daara-Ji
```

### Étape 3 : Installer les Dépendances

```bash
# Installer toutes les dépendances
npm install

# Si vous rencontrez des erreurs, essayez :
npm install --legacy-peer-deps
```

### Étape 4 : Configuration Initiale

```bash
# Compiler les styles CSS
npm run css:build
```

### Étape 5 : Premier Démarrage

```bash
# Démarrer en mode développement
npm run dev

# Ou en mode production
npm start
```

## 🔧 Configuration Avancée

### Configuration de la Base de Données

L'application utilise SQLite et se configure automatiquement. La base de données sera créée dans le dossier `data/` au premier démarrage.

**Emplacement** : `data/daara.db`

### Personnalisation des Styles

Pour modifier l'apparence de l'application :

1. Éditez `src/renderer/css/input.css`
2. Modifiez `tailwind.config.js` pour les couleurs et thèmes
3. Recompilez : `npm run css:build`

### Configuration des Exports

Les exports (Excel/PDF) sont sauvegardés par défaut dans le dossier de téléchargements de l'utilisateur.

## 📦 Création d'un Exécutable

### Pour Toutes les Plateformes
```bash
npm run build
```

### Pour une Plateforme Spécifique

#### Windows
```bash
npm run build:win
```
Génère : `dist/Daara Re-Creation Manager Setup.exe`

#### macOS
```bash
npm run build:mac
```
Génère : `dist/Daara Re-Creation Manager.dmg`

#### Linux
```bash
npm run build:linux
```
Génère : `dist/Daara Re-Creation Manager.AppImage`

## 🎯 Installation sur d'Autres PC

### Méthode 1 : Exécutable (Recommandée)

1. **Créez l'exécutable** sur votre PC de développement :
   ```bash
   npm run build:win  # Pour Windows
   ```

2. **Copiez le fichier** `dist/Daara Re-Creation Manager Setup.exe` sur le PC cible

3. **Exécutez l'installateur** sur le PC cible
   - Double-cliquez sur le fichier .exe
   - Suivez les instructions d'installation
   - L'application sera installée et accessible depuis le menu Démarrer

### Méthode 2 : Installation Manuelle

Si vous préférez installer manuellement :

1. **Copiez tout le dossier** du projet sur le PC cible
2. **Installez Node.js** sur le PC cible
3. **Ouvrez un terminal** dans le dossier du projet
4. **Installez les dépendances** :
   ```bash
   npm install --production
   ```
5. **Démarrez l'application** :
   ```bash
   npm start
   ```

### Méthode 3 : Version Portable

Pour créer une version portable :

1. **Modifiez le package.json** :
   ```json
   "build": {
     "nsis": {
       "oneClick": false,
       "allowToChangeInstallationDirectory": true,
       "createDesktopShortcut": true,
       "createStartMenuShortcut": true
     }
   }
   ```

2. **Construisez** :
   ```bash
   npm run build:win
   ```

## 🛠️ Dépannage

### Problèmes Courants

#### "npm install" échoue
```bash
# Nettoyer le cache npm
npm cache clean --force

# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
```

#### Erreur "better-sqlite3"
```bash
# Réinstaller avec rebuild
npm rebuild better-sqlite3

# Ou installer une version compatible
npm install better-sqlite3@latest
```

#### L'application ne démarre pas
1. Vérifiez que Node.js est installé : `node --version`
2. Vérifiez les permissions du dossier
3. Consultez les logs dans la console

#### Base de données corrompue
1. Fermez l'application
2. Supprimez le dossier `data/`
3. Redémarrez l'application (la base sera recréée)

#### Styles non appliqués
```bash
# Recompiler les CSS
npm run css:build

# Vérifier Tailwind
npx tailwindcss --version
```

### Logs et Débogage

#### Activer les logs détaillés
```bash
# Démarrer avec debug
DEBUG=* npm start

# Ou en mode développement
npm run dev
```

#### Emplacement des logs
- **Windows** : `%APPDATA%/Daara Re-Creation Manager/logs/`
- **macOS** : `~/Library/Logs/Daara Re-Creation Manager/`
- **Linux** : `~/.config/Daara Re-Creation Manager/logs/`

## 📱 Utilisation Mobile (Future)

L'application est actuellement desktop uniquement, mais la structure permet une extension mobile future avec :
- Capacitor pour iOS/Android
- Interface responsive déjà intégrée
- API backend séparée possible

## 🔐 Sécurité et Sauvegarde

### Sauvegarde des Données
```bash
# Sauvegarder la base de données
cp data/daara.db backup/daara_$(date +%Y%m%d).db
```

### Restauration
```bash
# Restaurer une sauvegarde
cp backup/daara_20250802.db data/daara.db
```

### Sécurité
- Les données sont stockées localement
- Aucune connexion internet requise
- Chiffrement possible en ajoutant SQLCipher

## 📞 Support Technique

### Avant de Contacter le Support
1. Vérifiez cette documentation
2. Consultez les logs d'erreur
3. Testez sur un environnement propre
4. Notez votre configuration système

### Informations à Fournir
- Version de l'application
- Système d'exploitation et version
- Version de Node.js
- Message d'erreur complet
- Étapes pour reproduire le problème

### Contacts
- **GitHub Issues** : https://github.com/papiyade/Daara-Ji/issues
- **Email Support** : [À définir]
- **Documentation** : Dossier `docs/` du projet

## 🎓 Formation Utilisateurs

### Ressources Disponibles
- **Guide utilisateur** : `docs/guide-utilisateur.md`
- **Vidéos tutoriels** : [À créer]
- **FAQ** : `docs/faq.md`

### Formation Recommandée
1. **Administrateur** : 2-3 heures de formation
2. **Utilisateurs** : 1 heure de présentation
3. **Support technique** : Formation complète recommandée

---

**Dernière mise à jour** : Août 2025  
**Version du guide** : 1.0  
**Compatibilité** : Daara Re-Creation Manager v1.0.0
