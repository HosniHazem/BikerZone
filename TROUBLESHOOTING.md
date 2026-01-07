# 🔧 BIKERZONE - GUIDE DE DÉPANNAGE

## ❌ Problème: Variables d'environnement manquantes

**Erreur :**
```
WARN[0000] The "CLOUDINARY_CLOUD_NAME" variable is not set
WARN[0000] The "SENDGRID_API_KEY" variable is not set
```

**Solution :**
1. Copiez `.env.example` vers `.env` :
   ```bash
   cp .env.example .env
   ```

2. Ou créez un fichier `.env` avec le contenu minimum :
   ```env
   NODE_ENV=development
   PORT=3000
   DATABASE_HOST=postgres
   DATABASE_PORT=5432
   DATABASE_USER=bikerzone
   DATABASE_PASSWORD=biker_secure_2024
   DATABASE_NAME=bikerzone_db
   MONGODB_URI=mongodb://bikerzone:mongo_secure_2024@mongodb:27017/bikerzone_social?authSource=admin
   REDIS_HOST=redis
   REDIS_PORT=6379
   REDIS_PASSWORD=redis_secure_2024
   JWT_SECRET=change-this-secret
   JWT_EXPIRATION=15m
   JWT_REFRESH_SECRET=change-this-refresh-secret
   JWT_REFRESH_EXPIRATION=7d
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   SENDGRID_API_KEY=
   FCM_SERVER_KEY=
   GOOGLE_MAPS_API_KEY=
   ```

**Note :** Les variables vides (Cloudinary, SendGrid, etc.) sont optionnelles et peuvent rester vides pour le développement local.

---

## ❌ Problème: nginx.conf not found

**Erreur :**
```
COPY nginx.conf /etc/nginx/conf.d/default.conf: "/nginx.conf": not found
```

**Solution :**
Créez le fichier `frontend/nginx.conf` avec ce contenu :

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /health {
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

---

## ❌ Problème: Docker build trop lent

**Cause :**
Le build inclut `node_modules` qui est très lourd.

**Solution :**
1. Créez `.dockerignore` dans `backend/` et `frontend/` :
   ```
   node_modules
   dist
   .git
   *.log
   ```

2. Nettoyez et rebuild :
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

---

## ❌ Problème: Port déjà utilisé

**Erreur :**
```
Bind for 0.0.0.0:3000 failed: port is already allocated
```

**Solution :**
1. Vérifiez les ports utilisés :
   ```bash
   # Linux/Mac
   sudo lsof -i :3000
   sudo lsof -i :8080
   
   # Windows
   netstat -ano | findstr :3000
   ```

2. Arrêtez le processus ou changez le port dans `docker-compose.yml` :
   ```yaml
   api:
     ports:
       - "3001:3000"  # Changez 3000 en 3001
   ```

---

## ❌ Problème: Base de données non accessible

**Erreur :**
```
Error: connect ECONNREFUSED postgres:5432
```

**Solution :**
1. Attendez que PostgreSQL démarre complètement :
   ```bash
   docker-compose logs postgres
   ```

2. Redémarrez le service API :
   ```bash
   docker-compose restart api
   ```

3. Vérifiez la santé des services :
   ```bash
   docker-compose ps
   ```

---

## ✅ Démarrage Propre (Clean Start)

Si vous avez des problèmes persistants, faites un démarrage propre :

```bash
# 1. Arrêter tous les services
docker-compose down -v

# 2. Supprimer les volumes (⚠️ efface les données)
docker volume prune -f

# 3. Supprimer les images
docker-compose down --rmi all

# 4. Créer le fichier .env
cp .env.example .env

# 5. Rebuild et redémarrer
docker-compose build --no-cache
docker-compose up -d

# 6. Vérifier les logs
docker-compose logs -f
```

---

## 🚀 Script de Setup Automatique

Utilisez le script fourni pour un setup automatique :

```bash
chmod +x setup.sh
./setup.sh
```

---

## 📊 Commandes Utiles

### Vérifier l'état des services
```bash
docker-compose ps
```

### Voir les logs
```bash
# Tous les services
docker-compose logs -f

# Un service spécifique
docker-compose logs -f api
docker-compose logs -f postgres
```

### Redémarrer un service
```bash
docker-compose restart api
docker-compose restart frontend
```

### Entrer dans un conteneur
```bash
docker-compose exec api sh
docker-compose exec postgres psql -U bikerzone -d bikerzone_db
```

### Nettoyer complètement
```bash
docker-compose down -v
docker system prune -a
```

---

## 🆘 Problèmes Courants et Solutions Rapides

| Problème | Solution Rapide |
|----------|----------------|
| Services ne démarrent pas | `docker-compose down && docker-compose up -d` |
| Port occupé | Changez le port dans `docker-compose.yml` |
| Build lent | Ajoutez `.dockerignore` |
| Erreur de connexion DB | Attendez 30s et redémarrez l'API |
| Variables manquantes | Créez le fichier `.env` |
| nginx.conf manquant | Créez `frontend/nginx.conf` |

---

## 📞 Besoin d'Aide Supplémentaire ?

1. Vérifiez la documentation complète dans `README.md`
2. Consultez les logs : `docker-compose logs -f`
3. Vérifiez les issues GitHub de Docker Compose
4. Assurez-vous d'avoir Docker v20+ et Docker Compose v2+

---

## ✅ Checklist de Démarrage

- [ ] Docker et Docker Compose installés
- [ ] Fichier `.env` créé
- [ ] Fichier `frontend/nginx.conf` existe
- [ ] Fichiers `.dockerignore` créés
- [ ] Ports 3000, 8080, 5432, 27017 disponibles
- [ ] Minimum 4 GB RAM disponible

---

**Une fois tout configuré, lancez simplement :**
```bash
docker-compose up -d
```

**Et accédez à :**
- Frontend: http://localhost:8080
- API: http://localhost:3000/api/v1
- Docs: http://localhost:3000/api/docs
