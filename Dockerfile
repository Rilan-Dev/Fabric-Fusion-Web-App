# ---- Build Stage ----
FROM node:18-alpine AS build

WORKDIR /usr/src/app

# Install all deps (including dev) for build
COPY package*.json ./
RUN npm install --force

COPY . .

# Run the build
RUN npm run build


# ---- Production Stage ----
FROM node:18-alpine AS production

WORKDIR /usr/src/app

# Copy only package files and install prod deps
COPY package*.json ./
RUN npm install --force --omit=dev

# Copy built files from build stage
COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["npm", "run", "start"]
