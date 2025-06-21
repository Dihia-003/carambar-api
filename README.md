# 🍬 Carambar & Co - API

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) ![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

API RESTful pour l'application de blagues Carambar & Co. Elle fournit des endpoints pour lire, créer, mettre à jour et supprimer des blagues.

---

## 🔗 Liens importants

-   **API en production :** [https://carambar-api-lndl.onrender.com/api/blagues](https://carambar-api-lndl.onrender.com/api/blagues)
-   **Documentation Swagger :** [https://carambar-api-lndl.onrender.com/api-docs](https://carambar-api-lndl.onrender.com/api-docs)
-   **Repository Frontend :** [https://github.com/Dihia-003/carambar-frontend](https://github.com/Dihia-003/carambar-frontend)

---

## 📋 Prérequis

- Node.js (version 14 ou supérieure)
- npm

## 🚀 Démarrage Rapide

1.  **Cloner le repository**
    ```bash
    git clone https://github.com/votre-username/carambar-api.git
    cd carambar-api
    ```

2.  **Installer les dépendances**
    ```bash
    npm install
    ```

3.  **Initialiser la base de données**
    Cette commande crée le fichier `database.sqlite` et le remplit avec 10 blagues de test.
    ```bash
    npm run setup-db
    ```

4.  **Démarrer le serveur**
    ```bash
    # Pour le développement (avec rechargement automatique)
    npm run dev

    # Pour la production
    npm start
    ```

Le serveur sera accessible sur `http://localhost:3001`.
La documentation interactive (Swagger) sera disponible sur `http://localhost:3001/api-docs`.

---

## 📚 Endpoints de l'API

L'URL de base pour toutes les routes est `http://localhost:3001`.

| Méthode | Endpoint                 | Description                     |
| ------- | ------------------------ | ------------------------------- |
| `GET`   | `/api/blagues`           | Récupérer toutes les blagues    |
| `GET`   | `/api/blagues/random`    | Récupérer une blague aléatoire  |
| `GET`   | `/api/blagues/:id`       | Récupérer une blague par son ID |
| `POST`  | `/api/blagues`           | Ajouter une nouvelle blague     |
| `PUT`   | `/api/blagues/:id`       | Mettre à jour une blague        |
| `DELETE`| `/api/blagues/:id`       | Supprimer une blague            |

### Exemples d'utilisation avec `curl`

#### Récupérer une blague aléatoire
```bash
curl http://localhost:3001/api/blagues/random
```

#### Ajouter une nouvelle blague
```bash
curl -X POST http://localhost:3001/api/blagues \
  -H "Content-Type: application/json" \
  -d '{
    "contenu": "Pourquoi les plongeurs plongent-ils toujours en arrière ? Parce que sinon ils tombent dans le bateau !",
    "auteur": "Anonyme"
  }'
```

---

## 🏗️ Structure du Projet

```
carambar-api-repo/
├── controllers/
│   └── blagueController.js  # Logique métier pour les routes
├── models/
│   └── Blague.js            # Modèle de données Sequelize pour une blague
├── routes/
│   └── blagues.js           # Définition des routes de l'API
├── .gitignore
├── app.js                   # Fichier de configuration Express (obsolète ou à vérifier)
├── package.json
├── package-lock.json
├── README.md
├── server.js                # Point d'entrée principal du serveur
└── setup-database.js        # Script pour initialiser la base de données
```

---

## 🚀 Déploiement

Ce projet est prêt à être déployé sur des plateformes comme Render, Heroku, etc.

### Exemple avec Render.com

-   **Runtime** : `Node`
-   **Build Command** : `npm install`
-   **Start Command** : `npm start`
-   **Note** : Si votre base de données doit persister après les déploiements, utilisez le service de disque de Render.

---

## 📝 Licence

Ce projet est sous licence ISC.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

---

**Développé avec ❤️ pour Carambar & Co** 