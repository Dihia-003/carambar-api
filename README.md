# 🍬 API Carambar & Co - Blagues

API REST pour gérer les blagues de Carambar & Co, construite avec Node.js, Express, Sequelize et SQLite.

## 🚀 Fonctionnalités

- ✅ API versionnée (v1)
- ✅ CRUD complet pour les blagues
- ✅ Endpoint pour blague aléatoire
- ✅ Documentation Swagger intégrée
- ✅ Architecture MVC
- ✅ Base de données SQLite
- ✅ Prêt pour le déploiement sur Render.com

## 📋 Prérequis

- Node.js (version 14 ou supérieure)
- npm ou yarn

## 🛠️ Installation

1. **Cloner le repository**
```bash
git clone <url-du-repo-api>
cd carambar-api
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Démarrer le serveur**
```bash
# Mode développement (avec nodemon)
npm run dev

# Mode production
npm start
```

Le serveur sera accessible sur `http://localhost:3000`

## 📚 Documentation API

La documentation Swagger est disponible à l'adresse : `http://localhost:3000/api-docs`

## 🔗 Endpoints

### Base URL
```
http://localhost:3000/api/v1
```

### Endpoints disponibles

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/blagues` | Récupérer toutes les blagues |
| `GET` | `/blagues/:id` | Récupérer une blague par ID |
| `GET` | `/blagues/random` | Récupérer une blague aléatoire |
| `POST` | `/blagues` | Ajouter une nouvelle blague |

### Exemples d'utilisation

#### Ajouter une blague
```bash
curl -X POST http://localhost:3000/api/v1/blagues \
  -H "Content-Type: application/json" \
  -d '{
    "contenu": "Pourquoi les plongeurs plongent-ils toujours en arrière ? Parce que sinon ils tombent dans le bateau !",
    "auteur": "Anonyme"
  }'
```

#### Récupérer une blague aléatoire
```bash
curl http://localhost:3000/api/v1/blagues/random
```

#### Récupérer toutes les blagues
```bash
curl http://localhost:3000/api/v1/blagues
```

## 🗄️ Structure de la base de données

### Table `Blagues`

| Champ | Type | Description |
|-------|------|-------------|
| `id` | INTEGER | Clé primaire, auto-incrémentée |
| `contenu` | TEXT | Contenu de la blague (obligatoire) |
| `auteur` | STRING | Auteur de la blague (optionnel, défaut: "Anonyme") |
| `date_creation` | DATETIME | Date de création automatique |
| `date_modification` | DATETIME | Date de modification automatique |

## 🏗️ Architecture

```
carambar-api/
├── config/
│   └── database.js          # Configuration Sequelize
├── controllers/
│   └── blagueController.js  # Contrôleurs pour les blagues
├── models/
│   └── Blague.js           # Modèle Sequelize
├── routes/
│   └── blagues.js          # Routes de l'API
├── app.js                  # Point d'entrée de l'application
├── package.json
└── README.md
```

## 🚀 Déploiement sur Render.com

1. Connectez-vous à votre compte Render.com
2. Créez un nouveau "Web Service"
3. Connectez votre repository GitHub
4. Configurez les variables d'environnement si nécessaire
5. Déployez !

### Variables d'environnement recommandées
- `NODE_ENV=production`
- `PORT=10000` (ou le port fourni par Render)

## 🧪 Tests

Pour tester l'API avec Postman :

1. Importez la collection Postman (à créer)
2. Configurez l'URL de base : `http://localhost:3000/api/v1`
3. Testez les différents endpoints

## 📝 Licence

Ce projet est sous licence ISC.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

---

**Développé avec ❤️ pour Carambar & Co** 