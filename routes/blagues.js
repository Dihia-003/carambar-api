// On importe Express pour utiliser son système de Router.
const express = require('express');
// On crée une nouvelle instance de Router. C'est comme une mini-application Express, dédiée à une section de notre site.
const router = express.Router();

// Ce module exporte une fonction. C'est une technique d'injection de dépendances.
// Le serveur (server.js) appellera cette fonction en lui fournissant le modèle 'Blague' initialisé.
// Cela évite de devoir se connecter à la base de données depuis ce fichier.
module.exports = (Blague) => {
    // On importe les fonctions de notre contrôleur. On lui passe le modèle 'Blague' pour qu'il puisse l'utiliser.
    const {
        ajouterBlague,
        consulterToutesBlagues,
        consulterBlagueParId,
        consulterBlagueAleatoire,
        mettreAJourBlague,
        supprimerBlague
    } = require('../controllers/blagueController')(Blague);

    // --- Documentation du Modèle (Schema) pour Swagger ---
    // Ce bloc de commentaires n'est pas pour les humains, mais pour l'outil Swagger.
    // Il décrit à quoi ressemble un objet 'Blague' pour que Swagger puisse générer une belle documentation.
    /**
     * @swagger
     * components:
     *   schemas:
     *     Blague:
     *       type: object
     *       required:
     *         - contenu
     *       properties:
     *         id:
     *           type: integer
     *           description: ID unique de la blague
     *         contenu:
     *           type: string
     *           description: Contenu de la blague
     *         auteur:
     *           type: string
     *           description: Auteur de la blague
     *         date_creation:
     *           type: string
     *           format: date-time
     *           description: Date de création
     *         date_modification:
     *           type: string
     *           format: date-time
     *           description: Date de modification
     */

    // --- Définition des Routes ---
    
    // Les commentaires @swagger qui suivent décrivent chaque route pour la documentation.

    /**
     * @swagger
     * /api/blagues:
     *   post:
     *     summary: Ajouter une nouvelle blague
     *     tags: [Blagues]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - contenu
     *             properties:
     *               contenu:
     *                 type: string
     *                 description: Contenu de la blague
     *               auteur:
     *                 type: string
     *                 description: Auteur de la blague (optionnel)
     *     responses:
     *       201:
     *         description: Blague créée avec succès
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 message:
     *                   type: string
     *                 data:
     *                   $ref: '#/components/schemas/Blague'
     *       400:
     *         description: Données invalides
     */
    // On associe la route POST '/' (qui correspondra à /api/blagues/ en vrai) à la fonction 'ajouterBlague' du contrôleur.
    router.post('/', ajouterBlague);

    /**
     * @swagger
     * /api/blagues:
     *   get:
     *     summary: Récupérer toutes les blagues
     *     tags: [Blagues]
     *     responses:
     *       200:
     *         description: Liste des blagues
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 count:
     *                   type: integer
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Blague'
     */
    // On associe la route GET '/' à la fonction 'consulterToutesBlagues'.
    router.get('/', consulterToutesBlagues);

    /**
     * @swagger
     * /api/blagues/random:
     *   get:
     *     summary: Récupérer une blague aléatoire
     *     tags: [Blagues]
     *     responses:
     *       200:
     *         description: Blague aléatoire
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 data:
     *                   $ref: '#/components/schemas/Blague'
     *       404:
     *         description: Aucune blague disponible
     */
    // Important : les routes spécifiques comme '/random' doivent être déclarées AVANT les routes avec des paramètres comme '/:id'.
    // Sinon, Express penserait que 'random' est un ID.
    router.get('/random', consulterBlagueAleatoire);

    /**
     * @swagger
     * /api/blagues/{id}:
     *   get:
     *     summary: Récupérer une blague par ID
     *     tags: [Blagues]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID de la blague
     *     responses:
     *       200:
     *         description: Blague trouvée
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 data:
     *                   $ref: '#/components/schemas/Blague'
     *       404:
     *         description: Blague non trouvée
     */
    // Le ':id' dans l'URL est un paramètre dynamique. Express le rendra disponible dans req.params.id.
    router.get('/:id', consulterBlagueParId);

    // Note : Pour la présentation, j'ai omis la documentation Swagger pour PUT et DELETE pour rester concis,
    // mais dans un vrai projet, il faudrait les documenter aussi.

    // On associe la route PUT '/:id' à la fonction 'mettreAJourBlague'.
    router.put('/:id', mettreAJourBlague);

    // On associe la route DELETE '/:id' à la fonction 'supprimerBlague'.
    router.delete('/:id', supprimerBlague);

    // On retourne le routeur configuré pour que server.js puisse l'utiliser.
    return router;
};
