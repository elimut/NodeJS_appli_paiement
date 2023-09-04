FROM node:18

# create app directory
WORKDIR /usr/app

# Installer les dépendances de l'application
# Un caractère générique (wildcard) est utilisé pour s'assurer que package.json ET package-lock.json sont copiés
COPY package*.json ./
RUN npm install

# Regroupez la source de l'application
COPY . .

EXPOSE 8080

CMD [ "node", "app.js" ]


