# Imagen base
FROM node:20-alpine

# Crear directorio de la app
WORKDIR /app

# Copiar solo package.json para cache
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código
COPY . .

# Exponer puerto
EXPOSE 3000

# Comando por defecto
CMD ["npm", "run", "start:dev"]
