# 🍬 Carambar & Co - API

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) ![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

API REST pour l'application de blagues Carambar & Co.

---

## 🔗 Liens importants

-   **API en production :** [https://carambar-api-lndl.onrender.com/api/blagues](https://carambar-api-lndl.onrender.com/api/blagues)
-   **Documentation Swagger :** [https://carambar-api-lndl.onrender.com/api-docs](https://carambar-api-lndl.onrender.com/api-docs)
-   **Repository Frontend :** [https://github.com/Dihia-003/carambar-frontend](https://github.com/Dihia-003/carambar-frontend)

---

## 🚀 Démarrage local

1.  **Cloner le repository**
    ```bash
    git clone https://github.com/Dihia-003/carambar-api.git
    cd carambar-api
    ```

2.  **Installer les dépendances**
    ```bash
    npm install
    ```

3.  **Initialiser la base de données**
    Cette commande va créer la base de données `database.sqlite` et la remplir avec 10 blagues.
    ```bash
    npm run setup-db
    ```

4.  **Démarrer le serveur**
    ```bash
    npm run dev
    ```

Le serveur sera accessible sur `http://localhost:3001`.

---

## 📚 Endpoints de l'API

| Méthode | Endpoint            | Description                |
| ------- | ------------------- | -------------------------- |
| `GET`   | `/api/blagues`      | Récupérer toutes les blagues |
| `GET`   | `/api/blagues/:id`  | Récupérer une blague par ID |
| `GET`   | `/api/blagues/random` | Récupérer une blague aléatoire |
| `POST`  | `/api/blagues`      | Ajouter une nouvelle blague  |
| `PUT`   | `/api/blagues/:id`  | Mettre à jour une blague     |
| `DELETE`| `/api/blagues/:id`  | Supprimer une blague         |

---

## 🚀 Instructions de Déploiement (Render.com)

Ce projet est configuré pour un déploiement facile sur Render.

-   **Runtime** : `Node`
-   **Build Command** : `npm install && npm run setup-db`
-   **Start Command** : `npm start`
-   **Disque Persistant** :
    -   **Name**: `data`
    -   **Mount Path**: `/data`
-   **Variable d'environnement** :
    -   **Key**: `DATABASE_PATH`
    -   **Value**: `/data/database.sqlite`

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