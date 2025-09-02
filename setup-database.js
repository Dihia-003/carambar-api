// Ce script est un utilitaire indépendant. Son seul rôle est de créer une base de données propre et de la remplir avec des données de test.
// Il n'est pas utilisé par le serveur principal, mais par le développeur pour initialiser l'environnement.

// On importe les modules nécessaires. 'fs' (File System) nous permet d'interagir avec les fichiers, ici pour supprimer l'ancienne BDD.
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const fs = require('fs');

// --- Nettoyage de l'ancienne base de données ---
// On définit le chemin vers notre fichier de base de données.
const dbPath = path.join(__dirname, 'database.sqlite');
// On vérifie si un ancien fichier de BDD existe déjà.
if (fs.existsSync(dbPath)) {
    console.log('🗑️ Suppression de l\'ancienne base de données...');
    // Si oui, on le supprime pour repartir de zéro.
    fs.unlinkSync(dbPath);
}

// --- Création d'une nouvelle connexion ---
// On crée une nouvelle instance de Sequelize, exactement comme dans le serveur, mais ici son but est temporaire (juste pour ce script).
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: console.log // On active les logs SQL pour voir ce que le script fait.
});

// --- Définition du modèle ---
// On doit redéfinir le modèle Blague ici, car ce script est indépendant du serveur principal.
// La structure doit être identique à celle dans `models/Blague.js` pour assurer la cohérence.
const Blague = sequelize.define('Blague', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    contenu: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    auteur: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'Anonyme'
    }
}, {
    timestamps: true,
    createdAt: 'date_creation',
    updatedAt: 'date_modification'
});

// On s'assure que le nom de la table est bien 'Blagues'.
Blague.tableName = 'Blagues';

// --- Définition du modèle User ---
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    session_token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
    tableName: 'Users',
});

// --- Données de test ---
// On prépare un tableau d'objets contenant les blagues que l'on veut insérer dans notre BDD.
const blagues = [
    {
        contenu: "Quelle est la femelle du hamster ? - L'Amsterdam",
        auteur: "Carambar"
    },
    {
        contenu: "Que dit un oignon quand il se cogne ? - Aïe",
        auteur: "Carambar"
    },
    {
        contenu: "Quel est l'animal le plus heureux ? - Le hibou, parce que sa femme est chouette.",
        auteur: "Carambar"
    },
    {
        contenu: "Pourquoi le football c'est rigolo ? - Parce que Thierry en rit",
        auteur: "Carambar"
    },
    {
        contenu: "Quel est le sport le plus fruité ? - La boxe, parce que tu te prends des pêches dans la poire et tu tombes dans les pommes.",
        auteur: "Carambar"
    },
    {
        contenu: "Que se fait un Schtroumpf quand il tombe ? - Un Bleu",
        auteur: "Carambar"
    },
    {
        contenu: "Quel est le comble pour un marin ? - Avoir le nez qui coule",
        auteur: "Carambar"
    },
    {
        contenu: "Qu'est ce que les enfants usent le plus à l'école ? - Le professeur",
        auteur: "Carambar"
    },
    {
        contenu: "Quel est le sport le plus silencieux ? - Le para-chuuuut",
        auteur: "Carambar"
    },
    {
        contenu: "Quel est le comble pour un joueur de bowling ? - C'est de perdre la boule",
        auteur: "Carambar"
    }
];

// --- Fonction principale d'initialisation ---
async function setupDatabase() {
    try {
        // Test de la connexion
        console.log('🔄 Test de la connexion à la base de données...');
        await sequelize.authenticate();
        console.log('✅ Connexion à la base de données établie avec succès.');

        // Synchronisation de la base de données.
        // L'option { force: false } préserve les données existantes et ne crée que les tables manquantes.
        console.log('🔄 Création des tables...');
        await sequelize.sync({ force: false });
        console.log('✅ Tables créées avec succès.');

        // On boucle sur notre tableau de blagues et on les insère une par une dans la BDD.
        console.log('🔄 Ajout des blagues de test...');
        for (const blague of blagues) {
            // Vérifier si la blague existe déjà pour éviter les doublons
            const existingBlague = await Blague.findOne({ where: { contenu: blague.contenu } });
            if (!existingBlague) {
                await Blague.create(blague);
                console.log(`✅ Blague ajoutée : ${blague.contenu.substring(0, 30)}...`);
            } else {
                console.log(`ℹ️ Blague déjà existante : ${blague.contenu.substring(0, 30)}...`);
            }
        }

        // Création de l'utilisateur admin par défaut
        console.log('🔄 Création de l\'utilisateur admin...');
        const crypto = require('crypto');
        const adminPassword = 'admin123';
        const adminPasswordHash = crypto.createHash('sha256').update(adminPassword).digest('hex');
        
        try {
            await User.create({
                email: 'admin@carambar.com',
                passwordHash: adminPasswordHash
            });
            console.log('✅ Utilisateur admin créé avec succès');
            console.log('📧 Email: admin@carambar.com');
            console.log('🔑 Mot de passe: admin123');
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                console.log('ℹ️ Utilisateur admin existe déjà');
            } else {
                console.error('❌ Erreur lors de la création de l\'admin:', error);
            }
        }

        // Petite vérification finale pour s'assurer que tout a été ajouté.
        const count = await Blague.count();
        console.log(`🎉 Base de données initialisée avec succès ! ${count} blagues ajoutées.`);

        // On quitte le processus Node.js. Le code 0 signifie que tout s'est bien passé.
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
        // Si une erreur survient, on quitte avec le code 1, qui indique une erreur.
        process.exit(1);
    }
}

// Lancement de la fonction d'initialisation.
console.log('🚀 Démarrage de l\'initialisation de la base de données...');
setupDatabase(); 