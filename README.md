# commodities-sim-v0.3
https://uexcorp-space.github.io/commodities-sim-v0.3/
 Commodities SIM v0.3 Un simulateur de terminal de commerce inspiré de ESi ENGINE SPACE INDUSTRIE.inc LLD , développé en HTML, CSS et JavaScript pur, pour tester des concepts d'économie, de logistique et d'événements de marché.


 # Commodities SIM v0.3

**Un simulateur de terminal de commerce inspiré de Star Citizen, développé en HTML, CSS et JavaScript pur. Ce projet vise à explorer et tester des concepts d'économie de jeu, de logistique de cargo, d'événements de marché dynamiques et d'interactions utilisateur.**

![image](https://github.com/user-attachments/assets/5f888b29-4d20-4075-a2bc-f41e3097dc01)
 <!-- Remplacez par une capture d'écran à jour de votre v0.3 si disponible -->

## Fonctionnalités Actuelles (v0.3)

*   **Gestion Financière :** Simulation d'un solde joueur en ESI (monnaie du simulateur).
*   **Inventaire Joueur Dynamique :**
    *   Gestion des commodités possédées par le joueur.
    *   Calcul et affichage de l'utilisation du cargo en SCU (Standard Cargo Units).
*   **Marchés Multiples :**
    *   Sélection de la localisation actuelle parmi plusieurs stations/villes (CRU-L5, Area 18, Grim HEX).
    *   Chaque localisation possède son propre marché avec des prix et des stocks distincts.
*   **Commerce de Commodités :**
    *   Achat d'items depuis le stock du magasin.
    *   Vente d'items de l'inventaire joueur au magasin.
*   **Gestion du Cargo :**
    *   Capacité de cargo limitée par le vaisseau actuel du joueur (modèle 'Aurora MR' par défaut avec 6 SCU).
    *   Blocage des achats si le cargo est plein, avec notification.
*   **Simulation Temporelle :**
    *   Horloge de jeu affichée, avec un écoulement du temps accéléré (1 seconde réelle = 2 heures en jeu).
    *   **Péremption des Marchandises :** Certaines commodités (ex: Stimulants, Quantanium Brut) ont une durée de vie et peuvent périmer, devenant invendables.
    *   **Délais de Transaction :** Simulation d'un temps de chargement/déchargement lors des transactions d'achat/vente.
*   **Marché Dynamique (Simplifié) :**
    *   Fluctuations de base des stocks et des prix au fil du temps.
    *   **Indicateurs de Marché :** Des badges visuels ("Good Deal!", "Expensive", "Low Stock") apparaissent sur les items dans le magasin pour aider à la décision.
*   **Vue d'Ensemble du Marché :**
    *   Onglet "LOCAL MARKET OVERVIEW" fonctionnel, affichant les prix d'achat/vente et stocks de toutes les commodités connues à la localisation actuelle.
*   **Événements de Marché (Basique) :**
    *   Implémentation d'un événement simple ("Boom des Stimulants") pouvant se déclencher aléatoirement.
    *   Notification visuelle lorsqu'un événement est actif à la localisation actuelle, avec sa durée restante.
    *   Modification temporaire des conditions de marché (prix, demande) pour la commodité affectée.
*   **Sauvegarde et Chargement de la Progression :**
    *   Possibilité de sauvegarder l'état actuel du jeu (solde, inventaire, localisation, temps, événements actifs) dans le `localStorage` du navigateur.
    *   Possibilité de recharger la dernière progression sauvegardée.
*   **Interface Utilisateur :**
    *   Interface inspirée des terminaux de Star Citizen.
    *   Notifications visuelles pour les transactions, erreurs, et événements.

## Comment Lancer le Simulateur

1.  **Télécharger les Fichiers :**
    *   Clonez ce dépôt GitHub ou téléchargez les fichiers `index.html`, `style.css`, et `javascript.js`.
2.  **Organisation des Fichiers :**
    *   Assurez-vous que les trois fichiers (`index.html`, `style.css`, `javascript.js`) se trouvent dans le même dossier sur votre ordinateur.
3.  **Ouvrir dans le Navigateur :**
    *   Ouvrez le fichier `index.html` directement avec un navigateur web moderne (Chrome, Firefox, Edge sont recommandés).
4.  **Console de Développement (Optionnel mais Recommandé) :**
    *   Ouvrez la console de développement de votre navigateur (généralement avec la touche F12) pour voir les messages de log du simulateur (transactions, péremption d'items, événements de marché, erreurs potentielles).

## Structure du Code

*   **`index.html`**: Définit la structure de base de l'interface utilisateur du terminal. Les listes d'inventaire et de marché sont principalement des conteneurs remplis dynamiquement par JavaScript.
*   **`style.css`**: Gère tous les aspects visuels et la mise en page du terminal pour lui donner une apparence inspirée de Star Citizen.
*   **`javascript.js`**: Contient toute la logique de la simulation. Cela inclut :
    *   La gestion de l'état du jeu (`gameState`).
    *   Les définitions des données initiales (vaisseaux, localisations, commodités, marchés).
    *   Les fonctions de rendu pour mettre à jour dynamiquement l'interface.
    *   La logique pour les transactions d'achat et de vente.
    *   Le moteur de temps de jeu, la péremption, les fluctuations de marché.
    *   La gestion des événements de marché.
    *   La logique de sauvegarde et de chargement de la progression.
    *   La gestion des interactions utilisateur (clics sur les boutons, sélection).

## Données Utilisées

Le simulateur utilise des structures de données JavaScript internes (définies dans `javascript.js`) pour gérer son état et les informations du jeu :

*   `gameState`: État global du joueur et du jeu (solde, localisation, temps, etc.).
*   `shipData`: Caractéristiques des vaisseaux (cargo, temps de chargement).
*   `locationData`: Informations sur les différentes localisations.
*   `commodityDefinitions`: Propriétés de base de toutes les commodités (prix de base, SCU, péremption).
*   `playerInventory`: Inventaire actuel du joueur, avec temps d'acquisition pour la péremption.
*   `marketStock`: Prix et stocks actuels des commodités pour chaque localisation.
*   `eventTemplates`: Modèles pour les événements de marché.

## Fonctionnalités Prévues / Idées pour le Futur

Ce projet est une base pour explorer diverses mécaniques de jeu. Voici quelques idées pour des versions futures :

*   **Plus d'Événements de Marché :** Introduction d'une plus grande variété d'événements dynamiques affectant différentes commodités ou régions.
*   **Gestion de Vaisseaux Multiple :** Permettre au joueur de posséder plusieurs vaisseaux et de sélectionner son vaisseau actif, impactant la capacité de cargo et potentiellement d'autres facteurs.
*   **Système de Réputation :** Introduire une réputation avec les factions ou les localisations, influençant les prix, la disponibilité des missions, ou l'accès.
*   **Missions Simplifiées :** Ajout de missions de transport de marchandises ou de livraison.
*   **Externalisation des Données :** Déplacer les définitions de données (`commodityDefinitions`, `marketStock` initial, etc.) vers des fichiers JSON externes pour une gestion plus facile.
*   **Améliorations UI/UX :** Peaufinage de l'interface pour une meilleure clarté et facilité d'utilisation, ajout d'icônes graphiques.
*   **Système Économique Plus Complexe :** Simulation plus poussée de la production, de la consommation et des chaînes d'approvisionnement.

## Contributions

Les contributions, suggestions et rapports de bugs sont les bienvenus ! Veuillez ouvrir une "Issue" sur ce dépôt GitHub pour toute discussion.

## Licence

Ce projet est distribué sous la licence MIT. Voir le fichier `LICENSE` pour plus de détails.

LICENSE (Contenu du fichier LICENSE)
MIT License

Copyright (c) [2954] [Votre Nom ou Nom du Projet 
ESi ENGINE SPACE INDUSTRIE.inc LLD
Organisation PUBLIC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
