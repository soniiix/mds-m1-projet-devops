## Architecture du projet

Le projet est décomposé en 3 services principaux (micro-services) :
- Frontend : l'interface utilisateur.
- Tasks-service : service métier pour la gestion des données des tâches.
- Stats-service : service pour les statistiques d'utilisation.

Un serveur Nginx sert de reverse proxy pour diriger le trafic vers les bons services.

## Conteneurisation avec Docker

Pour ce qui est de la conteneurisation, j'ai choisi d'utiliser des Dockerfiles multi-stages pour chaque service car cela permet :
- d'optimiser le poids, car on ne garde que le nécessaire dans l'image finale
- d'optimiser la sécurité, car on n'a pas d'outils de dev ou de code source en clair dans l'image finale
- d'optimiser la vitesse, car les builds sont plus rapides en utilisant le cache des layers

Pour le développement local, j'ai configuré un `docker-compose.yml` qui contient :
- le proxy adminer pour gérer la base de données en mode graphique
- un container postgres 18 avec des healthchecks pour être sûr que la base de données est prête avant de démarrer les services
- des volumes pour la persistence des données

## Automatisation avec Taskfile

Le Taskfile gère :
- l'installation des dépendances (`task install`)
- le linting et les tests unitaires (`task lint` + `task test`)
- le build des images Docker (`task build`)
- le push vers le registry local (`task push`)
- le déploiement complet (`task pipeline`)

## Kubernetes et orchestration avec Helm

L'étape finale est le déploiement sur Kubernetes via Helm.
J'ai tout regroupé dans un Chart Helm (`k8s/charts/task-manager`) pour faciliter le déploiement sur Kubernetes. Cela permet de gérer facilement les variables (replicas, ports, configMaps) sans changer chaque manifest yaml

## Stratégie de tests + qualité du code

Pour l'ensemble de la stack, c'est Vitest qui est utilisé pour les tests.

### 1. Tests dans tasks-service (logique métier)
Voici les types de tests que j'ai ajouté dans le service tasks-service :
- vérification que les titres des tâches ne sont pas vides ou trop longs
- tests sur la création, la mise à jour et le changement de statut
- tests sur le code de tri par date et filtrage par statut (complétées / en cours)

### 2. Tests dans stats-service
Voici les types de tests que j'ai ajouté dans le service stats-service :
- calcul du nombre total de tâches et du ratio de complétion
- calcul des stats par jour et identification du jour le plus productif
- calcul du taux de complétion moyen

### 3. Tests dans frontend
Pour le front, les tests vérifient que l'interface réagit correctement aux actions utilisateur en checkant le rendu global de l'application et en faisant des tests unitaires sur les composants clés (TaskForm : soumission de formulaire, TaskList : rendu de la liste, TaskStats : affichage des graphes/chiffres).

### 4. Automatisation et Seuil de Couverture
ESLint passe sur tous les fichiers pour garantir un code propre et chaque service est configuré pour que les tests échouent si la couverture descend en dessous de 70% (`task test:coverage`).