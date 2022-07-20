# Base image
FROM node:alpine

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json .

# Install app dependencies
RUN npm ci

# Bundle app source
COPY . .

# Generate prisma client
RUN npx prisma generate

# Creates a "dist" folder with the production build
RUN npm run build

# Removes dependencies not used in production
RUN npm prune --production

# Start the server using the production build
CMD [ "node", "dist/main.js" ]