# SecureShop — Audit de sécurité d'une application web

> ⚠️ **Application à usage éducatif.** Elle a été conçue avec des vulnérabilités
> volontaires puis auditée. À exécuter uniquement en local, ne jamais l'exposer sur Internet.

## À propos du projet

SecureShop est une application e-commerce (React + FastAPI + SQLite + JWT) utilisée comme
laboratoire de test d'intrusion. J'ai détecté, exploité en local, expliqué puis corrigé
7 vulnérabilités en suivant une méthodologie de pentest : reconnaissance, authentification,
autorisation, validation des entrées, tests avancés.

📄 Rapport complet : [lien vers le rapport]

## Vulnérabilités corrigées

| # | Vulnérabilité | Endpoint | CWE | Sévérité |
|---|---|---|---|---|
| 1 | Injection SQL | GET /api/products/search | CWE-89 | Critique |
| 2 | IDOR | GET /api/orders/{id} | CWE-639 | Élevée |
| 3 | Contrôle d'accès cassé | GET /api/admin/users | CWE-862 | Élevée |
| 4 | XSS stockée | Avis produits | CWE-79 | Élevée |
| 5 | Exposition excessive de données | GET /api/users/{id} | CWE-200 | Moyenne à élevée |
| 6 | Upload de fichier non restreint | POST /api/users/me/avatar | CWE-434 | Élevée |
| 7 | Manipulation de prix (logique métier) | POST /api/checkout | CWE-840 | Élevée |

## Points identifiés, non corrigés

- Secret JWT codé en dur et expiration de 30 jours (`backend/auth.py`)
- Absence de limitation de débit sur le login
- Headers de sécurité absents et CORS permissif

## Technologies

Frontend : React, Vite, Tailwind CSS · Backend : FastAPI, SQLAlchemy, SQLite, JWT

## Installation

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate           # Linux/macOS : source venv/bin/activate
pip install -r requirements.txt
python seed_data.py             # crée et remplit secureshop.db
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend : http://localhost:5173 · API : http://localhost:8000 (documentation sur `/docs`)

## Comptes de test

| Utilisateur | Mot de passe | Rôle |
|---|---|---|
| alice | alice123 | customer |
| bob | bobpassword | customer |
| admin | admin2024 | admin |

## Structure du projet

```
secureshop/
├── backend/    API FastAPI, modèles, authentification, données de test
└── frontend/   Application React (pages, composants, contextes)
```

## Périmètre

Tout s'exécute sur la machine locale avec une base SQLite : aucun appel externe,
aucun vrai paiement, aucun envoi d'email. À tester uniquement sur sa propre copie locale.

## Réinitialiser les données

Relancer `python seed_data.py` pour réinitialiser la base.

## Auteur

Bouhadfane Elbatoul — e_bouhadfane@estin.dz
