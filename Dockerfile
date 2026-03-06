FROM node:20-slim

# Install native dependencies for sharp
RUN apt-get update && apt-get install -y \
    libvips-dev \
    libvips42 \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p uploads processed

EXPOSE 3000
CMD ["node", "src/server.js"]
