// On importe le type de données 'DataTypes' de Sequelize pour définir les types de nos colonnes.
const { DataTypes } = require('sequelize');

// Ce module exporte une fonction qui prend l'instance de Sequelize en paramètre.
// C'est notre 'usine' à modèle : elle crée et retourne le modèle Blague.
module.exports = (sequelize) => {
    // On utilise sequelize.define() pour définir un nouveau modèle.
    // Le premier argument, 'Blague', est le nom du modèle dans notre code JavaScript.
    const Blague = sequelize.define('Blague', {
        // --- Définition des colonnes de la table ---
        // Chaque clé de cet objet correspond à une colonne dans notre table 'Blagues'.

        // La colonne 'id' : notre clé primaire.
        id: {
            type: DataTypes.INTEGER,     // Ce sera un nombre entier.
            primaryKey: true,            // On indique que c'est la clé primaire.
            autoIncrement: true          // La base de données se chargera de l'incrémenter automatiquement.
        },

        // La colonne 'contenu' : le texte de la blague.
        contenu: {
            type: DataTypes.TEXT,        // Un type de données texte, optimisé pour les longues chaînes de caractères.
            allowNull: false,            // Cette colonne ne peut pas être vide.
            validate: {
                notEmpty: true           // Une validation supplémentaire qui s'assure que la chaîne n'est pas juste des espaces.
            }
        },

        // La colonne 'auteur'.
        auteur: {
            type: DataTypes.STRING,      // Un type de données texte, pour les chaînes plus courtes.
            allowNull: true,             // Cette colonne peut être laissée vide.
            defaultValue: 'Anonyme'      // Si elle est vide, la valeur 'Anonyme' sera utilisée par défaut.
        }
    }, {
        // --- Options du modèle ---
        
        // timestamps: true va automatiquement ajouter deux colonnes : createdAt et updatedAt.
        timestamps: true,
        // On peut renommer ces colonnes pour qu'elles soient en français dans la base de données.
        createdAt: 'date_creation',
        updatedAt: 'date_modification',

        // On spécifie explicitement le nom de la table dans la base de données.
        // Par défaut, Sequelize met le nom du modèle au pluriel, mais c'est une bonne pratique de le forcer.
        tableName: 'Blagues'
    });

    // On retourne le modèle nouvellement créé pour qu'il puisse être utilisé par le reste de l'application.
    return Blague;
}; 