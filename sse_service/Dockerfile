FROM node:lts AS build

WORKDIR /usr/src/app
COPY package.json ./

# Install dependencies
RUN npm install --no-optional
RUN npm install @aws-sdk/client-sqs
# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 80

# Command to start the application
CMD ["npm", "start"]
