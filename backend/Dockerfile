FROM node:18-alpine
WORKDIR /app
COPY package*.json ./

ARG NODE_ENV=production 
#Default to production for image build unless overridden
ENV NODE_ENV=$NODE_ENV

RUN if [ "$NODE_ENV" = "production" ]; \
    then npm install --omit=dev; \
    else npm install; \
    fi

#COPY . .

CMD ["npm", "run", "start"] 
# Or "node", "index.js"