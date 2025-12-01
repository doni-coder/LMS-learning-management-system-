# Use Node.js as base image
FROM node:22

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all files
COPY . .

# Expose port (change according to your backend)
EXPOSE 5050

# Start the backend
CMD ["npm", "nodemon", "backend/server.js"]


