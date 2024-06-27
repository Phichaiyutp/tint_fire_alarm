FROM node:alpine3.20 AS build

WORKDIR /usr/src/app
COPY package.json ./

# Install dependencies
RUN npm install --no-optional

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose the application port
EXPOSE 80

# Command to start the application
CMD ["npm", "start"]
