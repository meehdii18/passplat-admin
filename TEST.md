# Cahier de Tests Fonctionnels - Panneau d'Administration PassPlat

## 1. Introduction

Ce document présente les tests fonctionnels du panneau d'administration PassPlat. Il vise à garantir que toutes les fonctionnalités de l'interface d'administration répondent aux exigences spécifiées et fonctionnent correctement.

## 2. Environnement de test

- **Navigateurs cibles**: Chrome Version 134.0.6998.45 (Build officiel)
- **Résolutions d'écran**: Desktop (1920×1080, 1366×768), Tablette (1024×768), Mobile (375×667)
- **Prérequis**: Backend Java déployé ou disponible en local et BDD SQL initialisée
- **Version de l'application**: v1.0.0

## 3. Cas de tests fonctionnels

### 3.1 Authentification

| ID | Description | Étapes | Résultat attendu | Statut |
|----|-------------|--------|------------------|--------|
| AUTH-01 | Connexion avec identifiants administrateur valides | 1. Accéder à la page de connexion<br>2. Saisir un nom d'utilisateur valide<br>3. Saisir un mot de passe valide<br>4. Cliquer sur "Se connecter" | L'utilisateur est connecté et redirigé vers le tableau de bord | OK |
| AUTH-02 | Connexion avec  non administrateur valide | 1. Accéder à la page de connexion<br>2. Saisir un nom d'utilisateur valide<br>3. Saisir un mot de passe<br>4. Cliquer sur "Se connecter" | Un message d'erreur s'affiche | OK |
| AUTH-03 | Connexion avec identifiants invalides | 1. Accéder à la page de connexion<br>2. Saisir un nom d'utilisateur invalide<br>3. Saisir un mot de passe<br>4. Cliquer sur "Se connecter" | Un message d'erreur s'affiche | OK |
| AUTH-04 | Déconnexion | 1. Se connecter<br>2. Cliquer sur le bouton de déconnexion | L'utilisateur est déconnecté et redirigé vers la page de connexion | OK |
| AUTH-05 | Protection des routes | 1. Essayer d'accéder directement à une URL protégée sans être connecté | Redirection vers la page de connexion | OK |
| AUTH-06 | Confirmation de déconnexion | 1. Se connecter<br>2. Cliquer sur le bouton de déconnexion<br>3. Vérifier l'affichage de la boîte de dialogue<br>4. Cliquer sur "Annuler" | La boîte de dialogue se ferme et l'utilisateur reste connecté | OK |

### 3.2 Gestion des emprunts

| ID | Description | Étapes | Résultat attendu | Statut |
|----|-------------|--------|------------------|--------|
| EMP-01 | Liste des emprunts | 1. Se connecter<br>2. Accéder à la page "Emprunts" | La liste des emprunts s'affiche correctement | OK |
| EMP-02 | Filtrage des emprunts | 1. Accéder à la page "Emprunts"<br>2. Utiliser les filtres disponibles (tous, en cours et rendus) | La liste est filtrée selon les critères sélectionnés | OK |
| EMP-03 | Création d'un emprunt | 1. Accéder à la page "Emprunts"<br>2. Cliquer sur "Ajouter"<br>3. Remplir le formulaire<br>4. Valider | L'emprunt est créé et apparaît dans la liste | OK |
| EMP-04 | Modification d'un emprunt | 1. Accéder à la page "Emprunts"<br>2. Cliquer sur un emprunt<br>3. Modifier les informations<br>4. Valider | L'emprunt est mis à jour avec les nouvelles informations | OK |
| EMP-06 | Pagination des emprunts | 1. Accéder à la page "Emprunts"<br>2. Naviguer entre les différentes pages de résultats | La pagination fonctionne et affiche correctement les emprunts par page | À tester |
| EMP-07 | Tri des emprunts | 1. Accéder à la page "Emprunts"<br>2. Cliquer sur le menu déroulant et choisir une données pour le tri | Les emprunts sont triés selon la colonne sélectionnée | OK |
| EMP-08 | Mise à jour des données d'en-tête | 1. Accéder à la page "Emprunts"<br>2. Ajouter un emprunt <br>3. Vérifier que le total des emprunt a augmenté<br>4. Vérifier que le nombre d'emprunt actif augmente<br>5. Terminer l'emprunt<br>6. Vérifier que le nombre d'emprunt rendus augmente | Les données sont mise à jour | OK |
| EMP-09 | Retour au tableau de bord | 1. Accéder à la page "Emprunts"<br>2. Clique sur le bouton retour<br>3. Vérifier qu'on arrive bien sur la page principale| On reviens à la page principale | À tester |
| EMP-10 | Emprunt sans stock | 1. Accéder à la page "Emprunts"<br>2. Cliquer sur "Ajouter"<br>3. Remplir le formulaire en sélectionnant un diffuseur sans stock<br>4. Valider | Message d'erreur indiquant que le diffuseur n'a pas de stock | OK |

### 3.3 Gestion des utilisateurs

| ID | Description | Étapes | Résultat attendu | Statut |
|----|-------------|--------|------------------|--------|
| USER-01 | Liste des utilisateurs | 1. Se connecter<br>2. Accéder à la page "Utilisateurs" | La liste des utilisateurs s'affiche correctement | À tester |
| USER-02 | Ajout d'un utilisateur | 1. Accéder à la page "Utilisateurs"<br>2. Cliquer sur "Ajouter"<br>3. Remplir le formulaire<br>4. Valider | L'utilisateur est créé et apparaît dans la liste | À tester |
| USER-03 | Modification d'un utilisateur | 1. Accéder à la page "Utilisateurs"<br>2. Cliquer sur un utilisateur<br>3. Modifier les informations<br>4. Valider | L'utilisateur est mis à jour avec les nouvelles informations | À tester |
| USER-04 | Désactivation d'un compte | 1. Accéder à la page "Utilisateurs"<br>2. Cliquer sur "Désactiver" pour un utilisateur<br>3. Confirmer | Le compte utilisateur est désactivé | À tester |
| USER-05 | Recherche d'utilisateurs | 1. Accéder à la page "Utilisateurs"<br>2. Saisir un terme dans le champ de recherche | Les résultats correspondant aux critères s'affichent | À tester |
| USER-06 | Attribution de rôles | 1. Accéder à la page "Utilisateurs"<br>2. Modifier un utilisateur<br>3. Changer son rôle<br>4. Valider | Le rôle de l'utilisateur est mis à jour | À tester |

### 3.4 Gestion de l'inventaire

| ID | Description | Étapes | Résultat attendu | Statut |
|----|-------------|--------|------------------|--------|
| INV-01 | Liste des articles | 1. Se connecter<br>2. Accéder à la page "Inventaire" | La liste des articles s'affiche correctement | À tester |
| INV-02 | Ajout d'un article | 1. Accéder à la page "Inventaire"<br>2. Cliquer sur "Ajouter"<br>3. Remplir le formulaire<br>4. Valider | L'article est créé et apparaît dans la liste | À tester |
| INV-03 | Modification d'un article | 1. Accéder à la page "Inventaire"<br>2. Cliquer sur un article<br>3. Modifier les informations<br>4. Valider | L'article est mis à jour avec les nouvelles informations | À tester |
| INV-04 | Gestion du stock | 1. Accéder à la page "Inventaire"<br>2. Modifier la quantité d'un article<br>3. Valider | Le stock est mis à jour | À tester |
| INV-05 | Recherche d'articles | 1. Accéder à la page "Inventaire"<br>2. Utiliser le champ de recherche | Les articles correspondant au critère s'affichent | À tester |
| INV-06 | Catégorisation des articles | 1. Accéder à la page "Inventaire"<br>2. Filtrer par catégorie | Seuls les articles de la catégorie sélectionnée s'affichent | À tester |

### 3.5 Statistiques totales

| ID | Description | Étapes | Résultat attendu | Statut |
|----|-------------|--------|------------------|--------|
| STAT-01 | Affichage des statistiques | 1. Se connecter<br>2. Accéder à l'onglet statistiques totales | Les statistiques s'affichent correctement | OK |
| STAT-02 | Exportation CSV | 1. Se connecter<br>2. Accéder à l'onglet statistiques totales<br>3.Cliquer sur le bouton exporter puis données csv<br>4.Ouvrir le fichier dans excel et vérifier les données | Les données sont correctes dans le fichier CSV | OK |


### 3.6 Graphiques d'emprunts

| ID | Description | Étapes | Résultat attendu | Statut |
|----|-------------|--------|------------------|--------|
| GRAPH-01 | Affichage des graphiques | 1. Se connecter<br>2. Accéder à l'onglet graphe des emprunts| Les graphiques s'affichent correctement | OK |
| GRAPH-02 | Infobulles des graphiques | 1. Se connecter<br>2. Accéder à l'onglet graphe des emprunts<br>3. Passer la souris sur un élément du graphique | Les infobulles s'affichent avec les données détaillées (date et nombre d'emprunt) | OK |
| GRAPH-03 | Actualiser les données | 1. Se connecter<br>2. Accéder à l'onglet graphe des emprunts<br>3. Mettre à jour les données manuellement via l'API<br>4. Cliquer sur le bouton actualiser | Le graphique se met à jour avec les nouvelles données | OK |
| GRAPH-04 | Exportation CSV | 1. Se connecter<br>2. Accéder à l'onglet graphe des emprunts<br>3.Cliquer sur le bouton exporter puis données csv<br>4.Ouvrir le fichier dans excel et vérifier les données | Les données sont correctes dans le fichier CSV | OK |
| GRAPH-04 | Exportation PNG | 1. Se connecter<br>2. Accéder à l'onglet graphe des emprunts<br>3.Cliquer sur le bouton exporter puis données image png<br>4.Ouvrir l'image | Le graphique correspond à celui sur le site | OK |


### 3.7 Statistiques par diffuseur

| ID | Description | Étapes | Résultat attendu | Statut |
|----|-------------|--------|------------------|--------|
| DIFF-01 | Affichage des diffuseurs | 1. Se connecter<br>2. Accéder à l'onglet statistiques par diffuseur<br>3. Cliquer sur le menu déroulant de sélection  | La liste des diffuseurs correspond à celle de la base de données | OK
| DIFF-02 | Selection d'un diffuseurs | 1. Se connecter<br>2. Accéder à l'onglet statistiques par diffuseur<br>3. Cliquer sur le menu déroulant de sélection<br>4.Choisir un diffuseur et cliquer sur rechercher  | Les données s'affiche correctement et correspondent au diffuseur sélectionné | OK
| DIFF-03 | Nouvelle recherche | 1. Se connecter<br>2. Accéder à l'onglet statistiques par diffuseur<br>3. Cliquer sur le menu déroulant de sélection<br>4.Choisir un diffuseur et cliquer sur rechercher<br>5.Cliquer sur le bouton nouvelle recherche  | La page reviens au stade de recherche avec aucun diffuseur selectionné | OK

### 3.8 Statistiques d'emprunts par période

| ID | Description | Étapes | Résultat attendu | Statut |
|----|-------------|--------|------------------|--------|
| PER-01 | Sélection d'une période | 1. Se connecter<br>2. Accéder à l'onglet statistique par période<br>3. Sélectionner une période (jour, semaine, mois, année) | Les statistiques correspondant à la période s'affichent | OK |
| PER-02 | Affichage graphique | 1. Se connecter<br>2. Accéder à l'onglet statistique par période | Les graphiques d'évolution sur la période s'affichent correctement | OK |
| PER-03 | Exportation CSV | 1. Se connecter<br>2. Accéder à l'onglet statistique par période<br>3.Cliquer sur le bouton CSV<br>4.Ouvrir le fichier dans excel et vérifier les données | Les données sont correctes dans le fichier CSV | OK |
| PER-04 | Exportation image | 1. Se connecter<br>2. Accéder à l'onglet statistique par période<br>3.Cliquer sur le bouton IMAGE<br>4.Ouvrir l'image et vérifier que le graphique est correct | L'image contient le même graphique que sur le site | OK |
| PER-05 | Actualisation des données | 1. Se connecter<br>2. Accéder à l'onglet statistique par période<br>3. Mettre à jour les données via une requête API <br>4. Cliquer sur le bouton actualiser| Les données sont mises à jour | OK |
| PER-05 | Actualisation de la date | 1. Se connecter<br>2. Accéder à l'onglet statistique par période<br>3. Sélectionner une période (jour, semaine, mois, année)<br>4. Choisir de nouvelles dates et cliquer sur analyser | Les statistiques sont mise à jour avec la nouvelle période | OK |

### 3.9 Articles populaires

| ID | Description | Étapes | Résultat attendu | Statut |
|----|-------------|--------|------------------|--------|
| POP-01 | Affichage des articles populaires | 1. Se connecter<br>2. Accéder à l'onglet Populaire | La liste des articles les plus empruntés, des diffuseurs les plus populaires ainsi que les utilisateurs les plus actifs s'affiche correctement | OK |
| POP-02 | Actualisation des données | 1. Se connecter<br>2. Accéder à l'onglet Populaire<br>3. Mettre à jour les données via une requête API <br>4. Cliquer sur le bouton actualiser| Les données sont mises à jour | OK |

### 3.10 Serveur

| ID | Description | Étapes | Résultat attendu | Statut |
|----|-------------|--------|------------------|--------|
| SERV-01 | Pas de connexion au serveur | 1. Ne pas lancer l'application de l'API Java<br>2. Accéder au site web<br>3.Renseignez des identifiants pour se connecter | Message d'erreur 'Erreur interne, veuillez réessayer plus tard' | OK |
| SERV-02 | Panne de serveur | 1. Lancer l'API Java<br>2. Accéder au site web<br>3.Se connecter<br>4. Fermer l'API Java<br>5.Changer de page ou actualiser la page | Message d'erreur 'Impossible de contacter le serveur, veuillez vérifier votre réseau' | OK |
| SERV-03 | Actualiser après une panne | 1. Lancer l'API Java<br>2. Accéder au site web<br>3.Se connecter<br>4. Fermer l'API Java<br>5.Changer de page ou actualiser la page<br>6. Relancer l'API<br>7. Cliquer sur actualiser | Les données s'affiche à nouveau | OK |
