const { Op } = require('sequelize');

module.exports = (Blague) => {
    // --- Fonctions du Contrôleur ---
    // Chaque fonction correspond à une action (un cas d'utilisation) de notre API.
    // Elles sont 'async' car les opérations avec la base de données prennent du temps.

    /**
     * @description Ajoute une nouvelle blague à la base de données.
     * @param {object} req - L'objet de la requête Express, contient les données envoyées par le client (req.body).
     * @param {object} res - L'objet de la réponse Express, utilisé pour renvoyer des données au client.
     */
    const ajouterBlague = async (req, res) => {
        console.log('📝 Tentative d\'ajout d\'une nouvelle blague...');
        // On utilise un bloc try...catch pour gérer les erreurs qui pourraient survenir lors de l'interaction avec la BDD.
        try {
            // On extrait 'contenu' et 'auteur' du corps de la requête. C'est le JSON envoyé par le client.
            const { contenu, auteur } = req.body;
            
            // Validation simple : on vérifie que le contenu de la blague n'est pas vide.
            if (!contenu) {
                console.log('❌ Contenu manquant');
                return res.status(400).json({ // On renvoie une erreur 400 (Bad Request).
                    success: false,
                    message: 'Le contenu de la blague est requis'
                });
            }

            // On utilise la méthode 'create' de notre modèle Sequelize pour insérer une nouvelle ligne dans la table 'Blagues'.
            const nouvelleBlague = await Blague.create({
                contenu,
                auteur: auteur || 'Anonyme' // Si aucun auteur n'est fourni, on met 'Anonyme' par défaut.
            });

            console.log('✅ Nouvelle blague ajoutée');
            // On renvoie une réponse de succès (201 - Created) avec la blague qui vient d'être créée.
            res.status(201).json({
                success: true,
                message: 'Blague ajoutée avec succès',
                data: nouvelleBlague
            });
        } catch (error) {
            console.error('❌ Erreur lors de l\'ajout de la blague:', error);
            // Si une erreur se produit, on renvoie une erreur 500 (Internal Server Error).
            res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur',
                error: error.message
            });
        }
    };

    /**
     * @description Récupère toutes les blagues de la base de données.
     */
    const consulterToutesBlagues = async (req, res) => {
        console.log('🔍 Tentative de récupération de toutes les blagues...');
        try {
            // On utilise la méthode 'findAll' pour récupérer toutes les lignes de la table.
            // On les trie par date de création, de la plus récente à la plus ancienne.
            const blagues = await Blague.findAll({
                order: [['date_creation', 'DESC']]
            });

            console.log(`✅ ${blagues.length} blagues trouvées`);
            
            // On renvoie la liste des blagues dans la réponse.
            res.json({
                success: true,
                count: blagues.length,
                data: blagues
            });
        } catch (error) {
            console.error('❌ Erreur lors de la récupération des blagues:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur',
                error: error.message
            });
        }
    };

    /**
     * @description Récupère une seule blague par son ID.
     */
    const consulterBlagueParId = async (req, res) => {
        try {
            // On récupère l'ID depuis les paramètres de l'URL (ex: /api/blagues/3).
            const { id } = req.params;
            
            // 'findByPk' est une méthode pratique pour trouver une entrée par sa clé primaire (Primary Key).
            const blague = await Blague.findByPk(id);
            
            // Si aucune blague ne correspond à cet ID, on renvoie une erreur 404 (Not Found).
            if (!blague) {
                return res.status(404).json({
                    success: false,
                    message: 'Blague non trouvée'
                });
            }

            // Si on la trouve, on la renvoie.
            res.json({
                success: true,
                data: blague
            });
        } catch (error) {
            console.error('Erreur lors de la récupération de la blague:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur',
                error: error.message
            });
        }
    };

    /**
     * @description Récupère une blague au hasard.
     */
    const consulterBlagueAleatoire = async (req, res) => {
        console.log('🎲 Tentative de récupération d\'une blague aléatoire...');
        try {
            // Pour obtenir une blague aléatoire en SQLite, on ruse un peu.
            // 1. On compte combien il y a de blagues au total.
            const count = await Blague.count();
            if (count === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Aucune blague disponible'
                });
            }

            // 2. On génère un index (une position) aléatoire entre 0 et le nombre total de blagues.
            const randomIndex = Math.floor(Math.random() * count);

            // 3. On demande à la BDD de nous donner une seule blague en sautant les 'randomIndex' premières.
            const blague = await Blague.findOne({ offset: randomIndex });

            if (!blague) { // Juste une sécurité au cas où.
                return res.status(404).json({
                    success: false,
                    message: 'Aucune blague disponible'
                });
            }

            console.log('✅ Blague aléatoire trouvée');
            res.json({
                success: true,
                data: blague
            });
        } catch (error) {
            console.error('❌ Erreur lors de la récupération de la blague aléatoire:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur',
                error: error.message
            });
        }
    };

    /**
     * @description Met à jour une blague existante.
     */
    const mettreAJourBlague = async (req, res) => {
        console.log('🔄 Tentative de mise à jour d\'une blague...');
        try {
            const { id } = req.params;
            const { contenu, auteur } = req.body;
            // D'abord, on récupère la blague à modifier.
            const blague = await Blague.findByPk(id);

            if (!blague) {
                return res.status(404).json({
                    success: false,
                    message: 'Blague non trouvée'
                });
            }

            // On met à jour les champs de l'objet 'blague' avec les nouvelles données.
            // Si une nouvelle valeur est fournie, on l'utilise, sinon on garde l'ancienne.
            blague.contenu = contenu || blague.contenu;
            blague.auteur = auteur || blague.auteur;
            // On utilise la méthode 'save' pour enregistrer les modifications en BDD.
            await blague.save();

            console.log('✅ Blague mise à jour avec succès');
            res.json({
                success: true,
                message: 'Blague mise à jour avec succès',
                data: blague
            });
        } catch (error) {
            console.error('❌ Erreur lors de la mise à jour de la blague:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur',
                error: error.message
            });
        }
    };

    /**
     * @description Supprime une blague.
     */
    const supprimerBlague = async (req, res) => {
        console.log('🗑️ Tentative de suppression d\'une blague...');
        try {
            const { id } = req.params;
            const blague = await Blague.findByPk(id);

            if (!blague) {
                return res.status(404).json({
                    success: false,
                    message: 'Blague non trouvée'
                });
            }

            // La méthode 'destroy' supprime la ligne de la base de données.
            await blague.destroy();

            console.log('✅ Blague supprimée avec succès');
            res.json({
                success: true,
                message: 'Blague supprimée avec succès'
            });
        } catch (error) {
            console.error('❌ Erreur lors de la suppression de la blague:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur',
                error: error.message
            });
        }
    };

    // On retourne un objet contenant toutes nos fonctions pour que le fichier de routes puisse les utiliser.
    return {
        ajouterBlague,
        consulterToutesBlagues,
        consulterBlagueParId,
        consulterBlagueAleatoire,
        mettreAJourBlague,
        supprimerBlague
    };
}; 