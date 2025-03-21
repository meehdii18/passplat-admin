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
| AUTH-01 | Connexion avec identifiants administrateur valides | 1. Accéder à la page de connexion<br>2. Saisir un nom d'utilisateur valide<br>3. Saisir un mot de passe valide<br>4. Cliquer sur "Se connecter" | L'utilisateur est connecté et redirigé vers le tableau de bord | À tester |
| AUTH-02 | Connexion avec  non administrateur valide | 1. Accéder à la page de connexion<br>2. Saisir un nom d'utilisateur valide<br>3. Saisir un mot de passe<br>4. Cliquer sur "Se connecter" | Un message d'erreur s'affiche | À tester |
| AUTH-03 | Connexion avec identifiants invalides | 1. Accéder à la page de connexion<br>2. Saisir un nom d'utilisateur invalide<br>3. Saisir un mot de passe<br>4. Cliquer sur "Se connecter" | Un message d'erreur s'affiche | À tester |
| AUTH-04 | Déconnexion | 1. Se connecter<br>2. Cliquer sur le bouton de déconnexion | L'utilisateur est déconnecté et redirigé vers la page de connexion | À tester |
| AUTH-05 | Protection des routes | 1. Essayer d'accéder directement à une URL protégée sans être connecté | Redirection vers la page de connexion | À tester |
| AUTH-06 | Confirmation de déconnexion | 1. Se connecter<br>2. Cliquer sur le bouton de déconnexion<br>3. Vérifier l'affichage de la boîte de dialogue<br>4. Cliquer sur "Annuler" | La boîte de dialogue se ferme et l'utilisateur reste connecté | À tester |

### 3.2 Gestion des emprunts

| ID | Description | Étapes | Résultat attendu | Statut |
|----|-------------|--------|------------------|--------|
| EMP-01 | Liste des emprunts | 1. Se connecter<br>2. Accéder à la page "Emprunts" | La liste des emprunts s'affiche correctement | À tester |
| EMP-02 | Filtrage des emprunts | 1. Accéder à la page "Emprunts"<br>2. Utiliser les filtres disponibles | La liste est filtrée selon les critères sélectionnés | À tester |
| EMP-03 | Création d'un emprunt | 1. Accéder à la page "Emprunts"<br>2. Cliquer sur "Ajouter"<br>3. Remplir le formulaire<br>4. Valider | L'emprunt est créé et apparaît dans la liste | À tester |
| EMP-04 | Modification d'un emprunt | 1. Accéder à la page "Emprunts"<br>2. Cliquer sur un emprunt<br>3. Modifier les informations<br>4. Valider | L'emprunt est mis à jour avec les nouvelles informations | À tester |
| EMP-05 | Suppression d'un emprunt | 1. Accéder à la page "Emprunts"<br>2. Cliquer sur l'icône de suppression d'un emprunt<br>3. Confirmer la suppression | L'emprunt est supprimé de la liste | À tester |
| EMP-06 | Pagination des emprunts | 1. Accéder à la page "Emprunts"<br>2. Naviguer entre les différentes pages de résultats | La pagination fonctionne et affiche correctement les emprunts par page | À tester |
| EMP-07 | Tri des emprunts | 1. Accéder à la page "Emprunts"<br>2. Cliquer sur les en-têtes de colonnes | Les emprunts sont triés selon la colonne sélectionnée | À tester |
| EMP-08 | Mise à jour des données d'en-tête | 1. Accéder à la page "Emprunts"<br>2. Ajouter un emprunt (EMP-03)<br>3. Vérifier que le total des emprunt a augmenté<br>4. Vérifier que le nombre d'emprunt actif augmente<br>5. Terminer l'emprunt<br>6. Vérifier que le nombre d'emprunt rendus augmente | Les données sont mise à jour | À tester |
| EMP-09 | Retour au tableau de bord | 1. Accéder à la page "Emprunts"<br>2. Clique sur le bouton retour<br>3. Vérifier qu'on arrive bien sur la page principale| On reviens à la page principale | À tester |
| EMP-10 | Emprunt sans stock | 1. Accéder à la page "Emprunts"<br>2. Cliquer sur "Ajouter"<br>3. Remplir le formulaire en sélectionnant un diffuseur sans stock<br>4. Valider | Message d'erreur indiquant que le diffuseur n'a pas de stock | FAIL (message d'erreur incorrect) |

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
| STAT-01 | Affichage des statistiques utilisateurs | 1. Se connecter<br>2. Accéder à l'onglet Statistiques Totales | Les statistiques d'utilisateurs (nombre total, diffuseurs, collecteurs) s'affichent correctement | À tester |
| STAT-02 | Affichage des statistiques emprunts | 1. Se connecter<br>2. Accéder à l'onglet Statistiques Totales | Les statistiques d'emprunts (total, rendus, en cours) s'affichent correctement | À tester |
| STAT-03 | Affichage des ratios | 1. Se connecter<br>2. Accéder à l'onglet Statistiques Totales | Les ratios (rendus/total) s'affichent avec le pourcentage correct | À tester |
| STAT-04 | Gestion des erreurs | 1. Provoquer une erreur de chargement des données<br>2. Observer l'affichage | Un message d'erreur approprié s'affiche | À tester |

### 3.6 Graphiques d'emprunts

| ID | Description | Étapes | Résultat attendu | Statut |
|----|-------------|--------|------------------|--------|
| GRAPH-01 | Affichage des graphiques | 1. Se connecter<br>2. Accéder à l'onglet Graphe Emprunts | Les graphiques s'affichent correctement | À tester |
| GRAPH-02 | Interactivité des graphiques | 1. Se connecter<br>2. Accéder à l'onglet Graphe Emprunts<br>3. Passer la souris sur un élément du graphique | Les infobulles s'affichent avec les données détaillées | À tester |
| GRAPH-03 | Filtrage par période | 1. Se connecter<br>2. Accéder à l'onglet Graphe Emprunts<br>3. Sélectionner différentes périodes | Le graphique se met à jour selon la période sélectionnée | À tester |

### 3.7 Statistiques par diffuseur

| ID | Description | Étapes | Résultat attendu | Statut |
|----|-------------|--------|------------------|--------|
| DIFF-01 | Sélection d'un diffuseur | 1. Se connecter<br>2. Accéder à l'onglet Stats Diffuseur<br>3. Sélectionner un diffuseur dans la liste | Les statistiques du diffuseur sélectionné s'affichent | À tester |
| DIFF-02 | Affichage des données spécifiques | 1. Se connecter<br>2. Accéder à l'onglet Stats Diffuseur<br>3. Sélectionner un diffuseur | Les données sur les emprunts et les performances du diffuseur s'affichent correctement | À tester |
| DIFF-03 | Recherche de diffuseurs | 1. Se connecter<br>2. Accéder à l'onglet Stats Diffuseur<br>3. Utiliser la fonction de recherche | La liste des diffuseurs se filtre selon les critères de recherche | À tester |

### 3.8 Statistiques d'emprunts par période

| ID | Description | Étapes | Résultat attendu | Statut |
|----|-------------|--------|------------------|--------|
| PER-01 | Sélection d'une période | 1. Se connecter<br>2. Accéder à l'onglet Stats Emprunts Période<br>3. Sélectionner une période (jour, semaine, mois, année) | Les statistiques correspondant à la période s'affichent | À tester |
| PER-02 | Comparaison de périodes | 1. Se connecter<br>2. Accéder à l'onglet Stats Emprunts Période<br>3. Activer la comparaison de périodes<br>4. Sélectionner deux périodes différentes | Les statistiques comparatives s'affichent correctement | À tester |
| PER-03 | Affichage graphique | 1. Se connecter<br>2. Accéder à l'onglet Stats Emprunts Période | Les graphiques d'évolution sur la période s'affichent correctement | À tester |

### 3.9 Articles populaires

| ID | Description | Étapes | Résultat attendu | Statut |
|----|-------------|--------|------------------|--------|
| POP-01 | Affichage des articles populaires | 1. Se connecter<br>2. Accéder à l'onglet Populaire | La liste des articles les plus empruntés, des diffuseurs les plus populaires ainsi que les utilisateurs les plus actifs s'affiche correctement | OK |
| POP-02 | Actualisation des données | 1. Se connecter<br>2. Accéder à l'onglet Populaire<br>3. Mettre à jour les données via une requête API <br>4. Cliquer sur le bouton actualiser| Les données sont mises à jour | OK |
