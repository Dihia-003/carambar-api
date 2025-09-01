// --- Importations des modules nécessaires ---
// Express : le framework principal pour construire notre serveur web.
const express = require('express');
// CORS (Cross-Origin Resource Sharing) : un middleware pour autoriser les requêtes venant d'autres domaines (essentiel pour que notre frontend puisse parler à notre backend).
const cors = require('cors');
// Sequelize : notre ORM (Object-Relational Mapper) pour interagir avec la base de données SQLite de manière simple.
const { Sequelize } = require('sequelize');
// Path : un utilitaire Node.js pour gérer les chemins de fichiers de manière compatible entre les systèmes d'exploitation.
const path = require('path');
// Swagger : les outils pour générer une documentation interactive de notre API.
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// --- Initialisation de l'application Express ---
// 'app' est notre instance de serveur. C'est sur elle que nous allons brancher nos routes et nos middlewares.
const app = express();
// On définit le port d'écoute du serveur. On utilise le port 3001 par défaut.
const port = process.env.PORT || 3001;

console.log('📝 Configuration du serveur...');

// --- Configuration des Middlewares ---
// Un middleware est une fonction qui est exécutée à chaque requête reçue par le serveur, avant d'atteindre la route finale.
// On active CORS pour toutes les routes.
app.use(cors());
// On demande à Express de savoir interpréter le JSON envoyé dans les corps de requêtes (pour les POST, PUT...).
app.use(express.json());
// On demande aussi à Express de savoir interpréter les données de formulaires classiques.
app.use(express.urlencoded({ extended: true }));

// Le reste de la configuration (BDD, routes) se fera dans la fonction startServer pour un contrôle total de l'ordre d'initialisation.

// --- Middleware de gestion des erreurs ---
// C'est un middleware spécial qui attrape toutes les erreurs survenues dans l'application pour éviter qu'elle ne plante.
app.use((err, req, res, next) => {
    console.error('❌ Erreur interceptée:', err.stack);
    // On renvoie une réponse d'erreur standard au format JSON.
    res.status(500).json({
        message: 'Une erreur est survenue !',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// --- Fonction principale de démarrage du serveur ---
// On utilise une fonction asynchrone pour pouvoir utiliser 'await' et garantir que les étapes se font dans le bon ordre.
async function startServer() {
    try {
        console.log('🔄 Démarrage du serveur...');

        // ÉTAPE 1 : Configuration et connexion à la base de données.
        console.log('📝 Configuration de la base de données...');
        const sequelize = new Sequelize({
            dialect: 'sqlite', // On spécifie qu'on utilise SQLite.
            storage: path.join(__dirname, 'database.sqlite'), // On indique le chemin vers le fichier de notre base de données.
            logging: false // On désactive les logs SQL dans la console pour plus de clarté.
        });

        // ÉTAPE 2 : On teste la connexion pour s'assurer que tout est bon.
        console.log('🔄 Test de la connexion à la base de données...');
        await sequelize.authenticate();
        console.log('✅ Connexion à la base de données établie avec succès.');

        // ÉTAPE 3 : On importe notre modèle 'Blague' et on le synchronise.
        // `sequelize.sync()` va créer la table 'Blagues' dans la BDD si elle n'existe pas.
        const Blague = require('./models/Blague')(sequelize);
        await sequelize.sync();
        console.log('🔄 Modèles synchronisés avec la base de données.');

        // --- Seed ultra-simple : si la table est vide, on insère 12 blagues ---
        const numExistingJokes = await Blague.count();
        if (numExistingJokes === 0) {
            console.log('🌱 Aucune blague trouvée. Insertion des blagues initiales...');
            await Blague.bulkCreate([
                { contenu: "Quelle est la femelle du hamster ? - L'Amsterdam", auteur: 'Carambar' },
                { contenu: "Que dit un oignon quand il se cogne ? - Aïe", auteur: 'Carambar' },
                { contenu: "Quel est l'animal le plus heureux ? - Le hibou, parce que sa femme est chouette.", auteur: 'Carambar' },
                { contenu: "Pourquoi le football c'est rigolo ? - Parce que Thierry en rit", auteur: 'Carambar' },
                { contenu: "Quel est le sport le plus fruité ? - La boxe, car on prend des pêches dans la poire et on tombe dans les pommes.", auteur: 'Carambar' },
                { contenu: "Que se fait un Schtroumpf quand il tombe ? - Un bleu", auteur: 'Carambar' },
                { contenu: "Quel est le comble pour un marin ? - Avoir le nez qui coule", auteur: 'Carambar' },
                { contenu: "Qu'est-ce que les enfants usent le plus à l'école ? - Le professeur", auteur: 'Carambar' },
                { contenu: "Quel est le sport le plus silencieux ? - Le para-chuuuut", auteur: 'Carambar' },
                { contenu: "Quel est le comble pour un joueur de bowling ? - Perdre la boule", auteur: 'Carambar' },
                { contenu: "Pourquoi les plongeurs plongent-ils en arrière ? - Parce que sinon ils tombent dans le bateau !", auteur: 'Carambar' },
                { contenu: "Que dit un escargot quand il croise une tortue ? - Rien, il ne peut pas la rattraper !", auteur: 'Carambar' }
            ]);
            console.log('✅ 12 blagues initiales insérées.');
        } else {
            console.log(`📚 ${numExistingJokes} blague(s) déjà présente(s). Pas de seed.`);
        }
        
        // ÉTAPE 4 : Configuration de la documentation Swagger.
        // C'est seulement maintenant, que la BDD est prête, qu'on peut charger les routes qui en dépendent.
        console.log('📝 Configuration de Swagger...');
        const swaggerOptions = {
            definition: {
                openapi: '3.0.0',
                info: {
                    title: 'Carambar & Co API',
                    version: '1.0.0',
                    description: 'Une API pour gérer les meilleures blagues Carambar',
                },
                servers: [{ url: `http://localhost:${port}` }],
            },
            apis: ['./routes/*.js'], // On dit à Swagger où trouver les commentaires de documentation (dans nos fichiers de routes).
        };
        const swaggerSpec = swaggerJSDoc(swaggerOptions);
        // On crée la route '/api-docs' qui servira notre page de documentation.
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
        
        // ÉTAPE 5 : On importe et on branche nos routes sur l'application.
        console.log('📝 Import et configuration des routes...');
        const blagueRoutes = require('./routes/blagues')(Blague); // On passe le modèle 'Blague' aux routes.
        app.use('/api/blagues', blagueRoutes); // Toutes les routes définies dans blagues.js seront préfixées par /api/blagues.

        // Route de test simple pour vérifier que le serveur est en vie.
        app.get('/', (req, res) => {
            console.log('📨 GET / - Route de test appelée');
            res.json({ message: 'Bienvenue sur l\'API Carambar & Co !' });
        });

        // ÉTAPE 6 : On démarre enfin le serveur Express pour qu'il écoute les requêtes entrantes.
        app.listen(port, () => {
            console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
            console.log(`📝 Documentation disponible sur http://localhost:${port}/api-docs`);
            console.log('📝 Routes disponibles :');
            console.log('  - GET  /');
            console.log('  - GET  /api/blagues');
            console.log('  - GET  /api/blagues/:id');
            console.log('  - POST /api/blagues');
            console.log('  - PUT  /api/blagues/:id');
            console.log('  - DELETE /api/blagues/:id');
        });

    } catch (error) {
        // Si une erreur survient pendant une des étapes de démarrage, on l'affiche et on arrête le processus.
        console.error('❌ Erreur lors du démarrage du serveur:', error);
        process.exit(1);
    }
}

// --- Lancement de l'application ---
console.log('🚀 Initialisation du serveur...');
startServer(); 