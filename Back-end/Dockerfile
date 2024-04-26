# Arquivo que cria a imagem com todo o projeto

# Usa a imagem Node como base para o Back-end
FROM node:20

# Cria a pasta /backend dentro do contêiner e entra nela
WORKDIR /backend

# Copia todo o conteúdo desta pasta para a criada, sendo estes arquivos tudo que é necessário para instalar as dependências
COPY . .

# Roda o comando para instalar as dependências no contêiner
RUN npm install

# Porta do servidor do Back-end
EXPOSE 5000

# Comando para o servidor ser executado
CMD ["npm", "start"]