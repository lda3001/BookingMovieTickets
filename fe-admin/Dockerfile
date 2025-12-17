FROM node:22-alpine
# Create app directory
WORKDIR /app/fe-admin
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
# Install app dependencies
RUN npm install
# Bundle app source
COPY . .
RUN npm run build
RUN npm install -g serve
ENV ENV=production
# Start the server using the production build
CMD [ "serve", "-s" , "dist" ]