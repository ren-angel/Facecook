# Arquivo que cria a imagem com todo o projeto

# Usa a imagem Node como base para construção
FROM node:20 AS builder

# Cria a pasta /frontend dentro do contêiner e entra nela
WORKDIR /frontend

# Copia todo o conteúdo desta pasta para a criada, sendo estes arquivos tudo que é necessário para instalar as dependências
COPY . .

# Roda o comando para instalar as dependências no contêiner
RUN npm install

# Copia o restante dos arquivos para o contêiner
COPY . /frontend/

# Gera a versão otimizada para produção
RUN npx vite build

# Usa uma imagem leve para produção
FROM node:18.17.0-alpine

# Cria a pasta /frontend dentro do contêiner
WORKDIR /frontend

# Copia apenas os arquivos necessários para a produção
COPY --from=builder /frontend/dist /frontend/dist

# Instala um servidor HTTP leve
RUN npm install -g serve

# Indica que a aplicação dentro do contêiner é executada na porta 5173.
EXPOSE 5173

# Comando para iniciar o servidor HTTP e servir os arquivos estáticos em produção
CMD ["serve", "-s", "dist", "-l", "5173"]