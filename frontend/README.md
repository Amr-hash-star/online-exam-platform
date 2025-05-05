# Online Exam Platform

Ce projet est une plateforme d'examen en ligne permettant aux enseignants de créer des examens et aux étudiants d'y participer.

## Fonctionnalités

- Inscription et connexion (étudiants et enseignants)
- Création d'examens avec questions QCM et questions ouvertes
- Gestion du temps par question
- Calcul automatique du score
- Suivi de la géolocalisation de l'étudiant

## Technologies utilisées

- **Backend** : Node.js, Express.js
- **Frontend** : HTML, CSS, et JavaScript (DOM)
- **Base de données** : MongoDB
- **Authentification** : JWT
- **Versioning** : GitHub

## Installation

1. Clonez le projet :
   ```bash
   git clone https://github.com/Amr-hash-star/online-exam-platform.git


# Frontend - Online Exam Platform

## Instructions pour le collaborateur

   Ce que vous ne devez pas modifier :

- Les fichiers index.html et login.html contiennent des scripts JavaScript intégrés pour gérer la communication avec le backend (API).
 NE MODIFIEZ PAS ces blocs <script>...</script> dans ces deux fichiers.

- Ne modifiez pas :

   - les identifiants id des formulaires (registerForm, loginForm)

   - les noms des champs name (email, nom, prenom, etc.)

   - la structure générale des formulaires

- Ces éléments sont nécessaires au fonctionnement du backend.


   Ce que vous pouvez faire :

- Modifier l’apparence et le design avec style.css

- Ajouter vos propres fichiers .js pour l'esthétique uniquement (exemples : animations, transitions)

- Ajouter des balises HTML supplémentaires si besoin sans casser les formulaires

- Styliser librement les champs et boutons du formulaire


   Bootstrap :

- Bootstrap est aussi utilisé dans ce projet.

- Vous pouvez ajouter une feuille de style externe si vous le souhaitez (CDN dans <head>), mais ce n’est pas obligatoire.


   Vérification :

Après chaque modification :

   - Vérifiez que l’inscription et la connexion fonctionnent toujours.

   - Si les messages d’erreur ou de succès ne s’affichent plus : vous avez probablement modifié un champ ou un ID critique.



