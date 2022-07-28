# Base image
FROM node:alpine As base

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm ci

# Bundle app source
COPY . ./

# Generate prisma client
RUN npx prisma generate

FROM base As test

# Run test suites
CMD ["npm", "run", "test"]

FROM base As ci

# Run test suites
CMD ["npm", "run", "test:ci"]

FROM base As dev

# Run the server in development mode
CMD ["npm", "run", "dev"]

FROM base As prod

# Creates a "dist" folder with the production build
RUN npm run build

# Removes dependencies not used in production
RUN npm prune --production

# Run the server using the production build
CMD [ "node", "dist/main.js" ]