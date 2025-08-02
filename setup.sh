#!/bin/bash

echo "========================================"
echo "  Installation Daara Re-Creation Manager"
echo "========================================"
echo

echo "[1/4] Nettoyage des anciens fichiers..."
rm -rf node_modules package-lock.json dist

echo "[2/4] Installation des dépendances..."
npm install

echo "[3/4] Compilation des styles CSS..."
npm run css:build

echo "[4/4] Test de l'application..."
echo
echo "========================================"
echo "  Installation terminée !"
echo "========================================"
echo
echo "Pour lancer l'application : npm start"
echo "Pour créer l'exécutable : npm run build"
echo
