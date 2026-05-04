FROM mcr.microsoft.com/playwright:v1.56.1-noble

WORKDIR /app

ENV CI=true

COPY package*.json ./
RUN npm install --no-audit --no-fund

COPY . .

CMD ["npx", "playwright", "test"]