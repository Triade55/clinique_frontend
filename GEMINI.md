# 🏥 Projet Clinique — Fiche Contexte & Architecture (GEMINI.md)

> Ce fichier synthétise l'architecture, l'état actuel du projet, la configuration Docker, le réseau et les commandes essentielles pour permettre à toute instance d'agent ou développeur de reprendre immédiatement le travail.

---

## 1. 📂 Structure Globale du Projet

Le projet est hébergé localement sous `/home/jean/code/clinique/` et composé de deux dépôts Git distincts :

```text
/home/jean/code/clinique/
├── GEMINI.md                     <- Cette fiche récapitulative
├── clinic_gestion/               <- Backend Django REST + PostgreSQL
│   ├── compose.yml               <- Orchestrateur Docker Compose (DB + Web + Frontend)
│   ├── API_DOCUMENTATION.md      <- Documentation de l'API de prise de rendez-vous
│   ├── manage.py
│   └── ...
└── frontend/                     <- Frontend Astro + Nginx
    ├── GEMINI.md                 <- Copie de synchronisation
    ├── Dockerfile                <- Build multi-stage (Node.js 22 alpine -> Nginx alpine)
    ├── nginx.conf                <- Reverse-proxy (/api/ -> clinic_web:8000)
    ├── package.json
    ├── src/
    │   ├── pages/                <- Pages Astro (index, etc.)
    │   ├── components/           <- Composants UI
    │   └── services/api.ts       <- Client Axios configuré pour l'API Django
    └── ...
```

### Dépôts GitHub :
- **Backend Django :** [`git@github.com:Triade55/clinic_gestion.git`](https://github.com/Triade55/clinic_gestion) (branche `main`)
- **Frontend Astro :** [`git@github.com:Triade55/clinique_frontend.git`](https://github.com/Triade55/clinique_frontend) (branche `main`)

---

## 2. 🐳 Architecture Docker & Déploiement Local

Le fichier [`clinic_gestion/compose.yml`](file:///home/jean/code/clinique/clinic_gestion/compose.yml) orchestre l'ensemble des conteneurs :

| Service Docker | Nom du conteneur | Port Local / Interne | Rôle |
| :--- | :--- | :--- | :--- |
| `db` | `clinic_db` | `5432` (interne) | PostgreSQL 16 Alpine avec volume persistant |
| `web` | `clinic_web` | `0.0.0.0:8000:8000` | Backend Django REST Framework (Gunicorn) |
| `frontend` | `clinic_frontend` | `0.0.0.0:3000:80` | Frontend Astro compilé servi par Nginx |

### Intégration Nginx & Reverse-Proxy API :
Dans [`frontend/nginx.conf`](file:///home/jean/code/clinique/frontend/nginx.conf) :
- Les fichiers statiques d'Astro sont servis directement sur le port `3000` (racine `/`).
- Toutes les requêtes débutant par `/api/` sont relayées de manière transparente vers `http://clinic_web:8000/api/`.
- **Zéro blocage CORS** : Le navigateur communique avec une seule origine (`localhost:3000`).

---

## 3. 🌐 Réseau, Accès Externe & Box Internet

### Configuration actuelle de la Box :
- La box internet de l'utilisateur redirige actuellement le port externe `8000` vers le port `8000` de la machine locale (Django).
- Le backend se déploie automatiquement sur le serveur lors d'un push.

### Configuration cible recommandée pour séparer Frontend & Django Admin :
- **Sans nom de domaine (via IP publique) :**
  - **Sur la Box :** Rediriger le port externe **`80`** vers le port local **`3000`** (Frontend).
  - Laisser le port externe **`8000`** vers le port local **`8000`** (Django).
  - **Accès visiteurs :** `http://<IP_PUBLIQUE>` ➡️ Affichage direct du Frontend Astro.
  - **Accès admin :** `http://<IP_PUBLIQUE>:8000/admin/` ➡️ Administration Django.
- **Alternative avec nom de domaine gratuit :**
  - Utiliser **DuckDNS** (ex: `clinique-demo.duckdns.org`) pour pointer sur l'IP publique sans payer.
  - Option Cloudflare Quick Tunnel (`cloudflared tunnel --url http://localhost:3000`) pour du HTTPS temporaire sans configuration de box.

---

## 4. 🔌 Services & Intégrations Clés

1. **Client API Axios ([`src/services/api.ts`](file:///home/jean/code/clinique/frontend/src/services/api.ts))** :
   - Conforme à [`clinic_gestion/API_DOCUMENTATION.md`](file:///home/jean/code/clinique/clinic_gestion/API_DOCUMENTATION.md).
   - Gère les spécialités, les médecins, les disponibilités et la création de rendez-vous avec gestion des erreurs et validation.
2. **Remotion & Vidéo** :
   - Vidéo de démonstration générée avec Remotion sous `frontend/prompt/videos`.

---

## 5. 💻 Antisèche des Commandes Fréquentes

### Lancer la production locale :
```bash
cd /home/jean/code/clinique/clinic_gestion
docker compose up -d
```

### Vérifier l'état des conteneurs :
```bash
docker compose ps
```

### Reconstruire après modification :
```bash
# Frontend :
docker compose up -d --build frontend

# Backend Django :
docker compose up -d --build web
```

### Voir les logs :
```bash
docker compose logs -f frontend
docker compose logs -f web
```

### Mode Développement Frontend (Hot-Reload) :
```bash
# 1. Garder DB + Backend actifs dans Docker :
cd /home/jean/code/clinique/clinic_gestion && docker compose up -d db web

# 2. Lancer Astro en dev local :
cd /home/jean/code/clinique/frontend && npm run dev
# Accessible sur http://localhost:4321
```
