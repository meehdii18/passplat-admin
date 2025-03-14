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

### 3.2 Tableau de bord

| ID | Description | Étapes | Résultat attendu | Statut |
|----|-------------|--------|------------------|--------|
| DASH-01 | Affichage des statistiques principales | 1. Se connecter<br>2. Accéder au tableau de bord | Les widgets de statistiques s'affichent correctement avec les données à jour | À tester |
| DASH-02 | Graphiques et visualisations | 1. Se connecter<br>2. Accéder au tableau de bord | Les graphiques se chargent et affichent correctement les données | À tester |
| DASH-03 | Filtrage des données par période | 1. Se connecter<br>2. Accéder au tableau de bord<br>3. Sélectionner une période (jour/semaine/mois) | Les données sont filtrées selon la période sélectionnée | À tester |
| DASH-04 | Actualisation des données | 1. Se connecter<br>2. Accéder au tableau de bord<br>3. Cliquer sur "Actualiser" | Les données sont mises à jour | À tester |
| DASH-05 | Navigation entre onglets | 1. Se connecter<br>2. Cliquer successivement sur chaque onglet du tableau de bord | Chaque onglet s'affiche correctement avec son contenu spécifique | À tester |
| DASH-06 | Menu administrateur | 1. Se connecter<br>2. Cliquer sur l'icône d'administration<br>3. Vérifier l'affichage du menu déroulant | Le menu administrateur s'affiche avec toutes les options | À tester |

### 3.3 Gestion des emprunts

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

### 3.4 Gestion des utilisateurs

| ID | Description | Étapes | Résultat attendu | Statut |
|----|-------------|--------|------------------|--------|
| USER-01 | Liste des utilisateurs | 1. Se connecter<br>2. Accéder à la page "Utilisateurs" | La liste des utilisateurs s'affiche correctement | À tester |
| USER-02 | Ajout d'un utilisateur | 1. Accéder à la page "Utilisateurs"<br>2. Cliquer sur "Ajouter"<br>3. Remplir le formulaire<br>4. Valider | L'utilisateur est créé et apparaît dans la liste | À tester |
| USER-03 | Modification d'un utilisateur | 1. Accéder à la page "Utilisateurs"<br>2. Cliquer sur un utilisateur<br>3. Modifier les informations<br>4. Valider | L'utilisateur est mis à jour avec les nouvelles informations | À tester |
| USER-04 | Désactivation d'un compte | 1. Accéder à la page "Utilisateurs"<br>2. Cliquer sur "Désactiver" pour un utilisateur<br>3. Confirmer | Le compte utilisateur est désactivé | À tester |
| USER-05 | Recherche d'utilisateurs | 1. Accéder à la page "Utilisateurs"<br>2. Saisir un terme dans le champ de recherche | Les résultats correspondant aux critères s'affichent | À tester |
| USER-06 | Attribution de rôles | 1. Accéder à la page "Utilisateurs"<br>2. Modifier un utilisateur<br>3. Changer son rôle<br>4. Valider | Le rôle de l'utilisateur est mis à jour | À tester |

### 3.5 Gestion de l'inventaire

| ID | Description | Étapes | Résultat attendu | Statut |
|----|-------------|--------|------------------|--------|
| INV-01 | Liste des articles | 1. Se connecter<br>2. Accéder à la page "Inventaire" | La liste des articles s'affiche correctement | À tester |
| INV-02 | Ajout d'un article | 1. Accéder à la page "Inventaire"<br>2. Cliquer sur "Ajouter"<br>3. Remplir le formulaire<br>4. Valider | L'article est créé et apparaît dans la liste | À tester |
| INV-03 | Modification d'un article | 1. Accéder à la page "Inventaire"<br>2. Cliquer sur un article<br>3. Modifier les informations<br>4. Valider | L'article est mis à jour avec les nouvelles informations | À tester |
| INV-04 | Gestion du stock | 1. Accéder à la page "Inventaire"<br>2. Modifier la quantité d'un article<br>3. Valider | Le stock est mis à jour | À tester |
| INV-05 | Recherche d'articles | 1. Accéder à la page "Inventaire"<br>2. Utiliser le champ de recherche | Les articles correspondant au critère s'affichent | À tester |
| INV-06 | Catégorisation des articles | 1. Accéder à la page "Inventaire"<br>2. Filtrer par catégorie | Seuls les articles de la catégorie sélectionnée s'affichent | À tester |

### 3.6 Statistiques totales

| ID | Description | Étapes | Résultat attendu | Statut |
|----|-------------|--------|------------------|--------|
| STAT-01 | Affichage des statistiques utilisateurs | 1. Se connecter<br>2. Accéder à l'onglet Statistiques Totales | Les statistiques d'utilisateurs (nombre total, diffuseurs, collecteurs) s'affichent correctement | À tester |
| STAT-02 | Affichage des statistiques emprunts | 1. Se connecter<br>2. Accéder à l'onglet Statistiques Totales | Les statistiques d'emprunts (total, rendus, en cours) s'affichent correctement | À tester |
| STAT-03 | Affichage des ratios | 1. Se connecter<br>2. Accéder à l'onglet Statistiques Totales | Les ratios (rendus/total) s'affichent avec le pourcentage correct | À tester |
| STAT-04 | Gestion des erreurs | 1. Provoquer une erreur de chargement des données<br>2. Observer l'affichage | Un message d'erreur approprié s'affiche | À tester |

### 3.7 Graphiques d'emprunts

| ID | Description | Étapes | Résultat attendu | Statut |
|----|-------------|--------|------------------|--------|
| GRAPH-01 | Affichage des graphiques | 1. Se connecter<br>2. Accéder à l'onglet Graphe Emprunts | Les graphiques s'affichent correctement | À tester |
| GRAPH-02 | Interactivité des graphiques | 1. Se connecter<br>2. Accéder à l'onglet Graphe Emprunts<br>3. Passer la souris sur un élément du graphique | Les infobulles s'affichent avec les données détaillées | À tester |
| GRAPH-03 | Filtrage par période | 1. Se connecter<br>2. Accéder à l'onglet Graphe Emprunts<br>3. Sélectionner différentes périodes | Le graphique se met à jour selon la période sélectionnée | À tester |

### 3.8 Statistiques par diffuseur

| ID | Description | Étapes | Résultat attendu | Statut |
|----|-------------|--------|------------------|--------|
| DIFF-01 | Sélection d'un diffuseur | 1. Se connecter<br>2. Accéder à l'onglet Stats Diffuseur<br>3. Sélectionner un diffuseur dans la liste | Les statistiques du diffuseur sélectionné s'affichent | À tester |
| DIFF-02 | Affichage des données spécifiques | 1. Se connecter<br>2. Accéder à l'onglet Stats Diffuseur<br>3. Sélectionner un diffuseur | Les données sur les emprunts et les performances du diffuseur s'affichent correctement | À tester |
| DIFF-03 | Recherche de diffuseurs | 1. Se connecter<br>2. Accéder à l'onglet Stats Diffuseur<br>3. Utiliser la fonction de recherche | La liste des diffuseurs se filtre selon les critères de recherche | À tester |

### 3.9 Statistiques d'emprunts par période

| ID | Description | Étapes | Résultat attendu | Statut |
|----|-------------|--------|------------------|--------|
| PER-01 | Sélection d'une période | 1. Se connecter<br>2. Accéder à l'onglet Stats Emprunts Période<br>3. Sélectionner une période (jour, semaine, mois, année) | Les statistiques correspondant à la période s'affichent | À tester |
| PER-02 | Comparaison de périodes | 1. Se connecter<br>2. Accéder à l'onglet Stats Emprunts Période<br>3. Activer la comparaison de périodes<br>4. Sélectionner deux périodes différentes | Les statistiques comparatives s'affichent correctement | À tester |
| PER-03 | Affichage graphique | 1. Se connecter<br>2. Accéder à l'onglet Stats Emprunts Période | Les graphiques d'évolution sur la période s'affichent correctement | À tester |

### 3.10 Articles populaires

| ID | Description | Étapes | Résultat attendu | Statut |
|----|-------------|--------|------------------|--------|
| POP-01 | Affichage des articles populaires | 1. Se connecter<br>2. Accéder à l'onglet Populaire | La liste des articles les plus empruntés s'affiche correctement | À tester |
| POP-02 | Filtrage par période | 1. Se connecter<br>2. Accéder à l'onglet Populaire<br>3. Sélectionner une période | La liste se met à jour pour afficher les articles populaires durant la période sélectionnée | À tester |
| POP-03 | Affichage des détails | 1. Se connecter<br>2. Accéder à l'onglet Populaire<br>3. Cliquer sur un article | Les détails de l'article et ses statistiques d'emprunt s'affichent | À tester |

### 3.11 Exports et rapports

| ID | Description | Étapes | Résultat attendu | Statut |
|----|-------------|--------|------------------|--------|
| EXP-01 | Export CSV | 1. Accéder à une page avec données (Emprunts, Utilisateurs, etc.)<br>2. Cliquer sur "Exporter en CSV" | Un fichier CSV est téléchargé avec les données correctes | À tester |
| EXP-02 | Génération de rapport | 1. Accéder à la section "Rapports"<br>2. Sélectionner un type de rapport<br>3. Définir les paramètres<br>4. Générer | Le rapport est généré correctement | À tester |
| EXP-03 | Export des graphiques | 1. Accéder à une page avec graphiques<br>2. Cliquer sur l'option d'export<br>3. Sélectionner un format (PNG, PDF) | Le graphique est exporté dans le format sélectionné | À tester |

### 3.12 Thème et personnalisation

| ID | Description | Étapes | Résultat attendu | Statut |
|----|-------------|--------|------------------|--------|
| THEME-01 | Changement de thème | 1. Accéder aux paramètres<br>2. Sélectionner un thème (clair/sombre)<br>3. Valider | Le thème de l'application change selon la sélection | À tester |
| THEME-02 | Persistance des préférences | 1. Changer le thème<br>2. Se déconnecter<br>3. Se reconnecter | Le thème précédemment sélectionné est appliqué | À tester |

## 4. Matrice de couverture des exigences

| Fonctionnalité | Cas de tests | Couverture |
|----------------|--------------|------------|
| Authentification | AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05 | 100% |
| Tableau de bord | DASH-01, DASH-02, DASH-03, DASH-04, DASH-05, DASH-06 | 100% |
| Gestion des emprunts | EMP-01, EMP-02, EMP-03, EMP-04, EMP-05, EMP-06, EMP-07 | 100% |
| Gestion des utilisateurs | USER-01, USER-02, USER-03, USER-04, USER-05, USER-