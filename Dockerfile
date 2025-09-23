# Use an official Node.js runtime as a parent image
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --force --omit=dev

# (Optional: you don’t need to install tailwindcss separately,
# since it's already in your devDependencies)
# RUN npm install tailwindcss --save --legacy-peer-deps

COPY . .

# Build for production
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
