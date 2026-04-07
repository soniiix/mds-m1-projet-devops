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


## 🛠 Choix techniques et difficultés

1. **Local Registry** : Plutôt que d'envoyer mes images sur le Docker Hub, j'ai préféré monter un registry local. C'est plus proche d'un environnement pro réel où les images restent sur un réseau privé.
2. **Taskfile vs Makefile** : J'ai préféré Taskfile car il gère mieux les dépendances entre les étapes et les variables globales que Makefile, qui est parfois un peu trop "vieux-jeu".
3. **Adminer et Healthchecks** : Sur d'autres projets, j'avais eu des soucis où les services démarraient avant la DB. J'ai ajouté des healthchecks et des `depends_on` avec `condition: service_healthy` dans Docker Compose pour éviter ça.
4. **Multi-stage build** : C'était un point important pour moi de ne pas avoir des images de 1Go. Mes images finales sont beaucoup plus légères (autour de 150-200 Mo).
5. **Helm** : Au début j'utilisais des fichiers YAML simples, mais Helm est devenu indispensable dès qu'il a fallu gérer les environnements et la répétition des manifestes pour les 3 services.

## Comment lancer le projet ?

1. S'assurer que Docker et Kubernetes (type k3d ou Kind) sont installés.
2. Installer les dépendances : `task install`
3. Lancer la pipeline complète : `task pipeline`
