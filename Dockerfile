# Étape 1 : Construction du projet Astro
FROM node:22-alpine AS builder

WORKDIR /app

# Copie des dépendances
COPY package*.json ./
RUN npm ci

# Copie du code source et build
COPY . .
RUN npm run build

# Étape 2 : Image de production Nginx ultra-légère
FROM nginx:alpine

# Copie des fichiers statiques générés
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
