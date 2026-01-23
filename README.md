# Task Manager Dashboard - DevOps Project

Ce projet est une application de démonstration basée sur une architecture microservices (Frontend React, deux microservices Node.js/Express) gérée avec Docker, Kubernetes et Helm.

## Architecture

- **Frontend** : Dashboard React (Vite) pour gérer les tâches.
- **Tasks Service** : Microservice Node.js pour le CRUD des tâches (PostgreSQL).
- **Stats Service** : Microservice Node.js pour calculer les statistiques des tâches.
- **PostgreSQL** : Base de données relationnelle.
- **Helm** : Orchestration des déploiements Kubernetes.
- **Taskfile** : Pipelines d'automatisation.

## Prérequis

- **Docker** & **Docker Compose**
- **Kubernetes cluster** (minikube, kind, docker-desktop, etc.)
- **Helm**
- **Task** (go-task)
- **Local Registry** à `localhost:5001` (peut être lancé via docker-compose)

## Installation & Développement

Lancer l'environnement de développement local avec hot-reload :
```bash
docker-compose up --build
```
L'application sera accessible sur :
- Frontend : http://localhost:8081
- Adminer (DB UI) : http://localhost:8080

## Pipeline d'automatisation

Le fichier `Taskfile.yml` permet d'exécuter toute la chaîne CI/CD :

```bash
# Installer les dépendances localement
task install

# Lancer le linter (ESLint & Prettier)
task lint

# Lancer les tests unitaires
task test

# Lancer les tests avec couverture de code (Coverage > 70%)
task test:coverage

# Builder les images multi-stage (Production)
task build

# Pousser les images dans le registry local (localhost:5001)
task push

# Déployer sur Kubernetes via Helm
task deploy

# Lancer toute la chaîne (lint -> test -> build -> push -> deploy)
task pipeline
```

## Exigences de Qualité

- **Dockerfiles Multi-stage** : Optimisés pour la production (images légères).
- **Linter** : ESLint et Prettier configurés pour tous les services.
- **Tests** : Couverture de code supérieure à 70% pour les services.
- **Kubernetes** : Déploiement paramétré via Helm.

## Nettoyage

Pour supprimer le déploiement Kubernetes :
```bash
helm uninstall task-manager -n task-manager
```
