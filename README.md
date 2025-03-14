# Panneau d'Administration PassPlat 📊

Une interface d'administration moderne et intuitive pour la gestion de la plateforme PassPlat, développée avec React et Material-UI.

## 🚀 Fonctionnalités

- **Statistiques Globales**
  - Vue d'ensemble des métriques clés
  - Visualisation des données utilisateurs
  - Suivi des emprunts et des contenants

- **Analyses Détaillées**
  - Graphiques d'évolution des emprunts
  - Statistiques par période
  - Analyses par diffuseur

- **Classements**
  - Top emprunteurs
  - Top diffuseurs
  - Contenants les plus utilisés

## 🛠️ Technologies Utilisées

- React 18
- TypeScript
- Material-UI v6
- Chart.js
- Axios
- Day.js
- Vite

## 📋 Prérequis

- Node.js (v16 ou supérieur)
- npm ou yarn

## 🔧 Installation

Il vous faudra en parallèle de cette installation avoir le backend Java qui est déployé ou en local sur votre machine. Il est disponible sur le repo git fourni.

```bash
# Cloner le dépôt
git clone https://scm.univ-tours.fr/22108349t/panneau-admin-passplat.git

# Accéder au répertoire
cd panneau-admin-passplat

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

## 💻 Scripts disponibles

```bash
# Développement
npm run dev

# Build
npm run build

# Preview
npm run preview

# Tests
npm test
npm run test:coverage
npm run test:watch
```

## 📦 Structure du Projet

```
panneau-admin-passplat/
├── src/
│   ├── components/    # Composants réutilisables
│   ├── contexts/      # Contextes React
│   ├── pages/         # Pages de l'application
│   ├── test/          # Configuration des tests
│   ├── theme.ts       # Configuration du thème
│   └── App.tsx        # Composant principal
├── public/            # Ressources statiques
└── package.json       # Dépendances et scripts
```

## 🎨 Personnalisation

Le thème peut être modifié dans `src/theme.ts`. Couleurs principales :

```typescript
palette: {
    primary: {
        main: '#AECB36'
    },
    secondary: {
        main: '#41aebf'
    }
}
```

## 📊 Exports de Données

Formats disponibles :
- CSV
- XLS
- TXT
- PNG (graphiques)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

## 📫 Contact

Pour toute question :
- Email : [mehdiaml@icloud.com](mailto:mehdiaml@icloud.com)