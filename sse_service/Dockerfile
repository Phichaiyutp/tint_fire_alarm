FROM node:alpine3.20

# Create the app directory and set permissions
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

# Switch to the app directory
WORKDIR /home/node/app

# Copy package.json and package-lock.json and change ownership
COPY package*.json ./
RUN chown node:node package*.json

# Switch to the 'node' user
USER node

# Install dependencies
RUN npm install

# Copy the rest of the application code and change ownership
COPY --chown=node:node . .

# Expose the application port
EXPOSE 80

# Start the application
CMD ["node", "app.js"]
