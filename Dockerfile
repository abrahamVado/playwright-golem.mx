FROM mcr.microsoft.com/playwright:v1.59.1-noble

WORKDIR /app

COPY package*.json ./

RUN npm config set registry http://registry.npmjs.org/ \
    && npm install --no-audit --no-fund

COPY . .

CMD ["npx", "playwright", "test"]
