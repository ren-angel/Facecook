# FaceCook

## Sobre o Aplicativo
O FaceCook é uma aplicação para compartilhar e descobrir receitas culinárias. Ele permite aos usuários adicionar suas próprias receitas, editar receitas existentes e visualizar receitas compartilhadas por outros usuários.

## Instalação e Uso

### Pré-requisitos
- Node.js
- Docker
- Docker Compose

### Configuração do Banco de Dados
O FaceCook utiliza o MongoDB como banco de dados. A conexão com o banco de dados é estabelecida através do Mongoose. Certifique-se de configurar corretamente a URI do seu banco de dados MongoDB no arquivo `config/database.js`.

### Backend
1. Navegue até o diretório `backend`.
2. Execute o comando `npm install` para instalar as dependências.
3. Execute o comando `npm start` para iniciar o servidor backend.

### Frontend
1. Navegue até o diretório `frontend`.
2. Execute o comando `npm install` para instalar as dependências.
3. Execute o comando `npm start` para iniciar o servidor de desenvolvimento do frontend.

### Construção e Implantação
Para construir e implantar o aplicativo completo usando Docker Compose:
1. Certifique-se de ter o Docker e o Docker Compose instalados.
2. No diretório raiz do projeto, execute o comando `docker-compose up --build` para construir e iniciar os serviços.

## Funcionalidades Principais
- Adicionar uma nova receita com imagem, nome, ingredientes, modo de preparo, categoria, tempo de preparo e rendimento.
- Editar uma receita existente.
- Excluir uma receita.
- Visualizar todas as receitas cadastradas.

## Estrutura do Projeto
- O backend é construído com Node.js e Express, utilizando MongoDB como banco de dados para armazenar as receitas.
- O frontend é construído com React.js e utiliza axios para comunicação com o backend.

## Autor
Este aplicativo foi desenvolvido por Daniel Medrado, Lucas Vasconcelos, Hiago Rodrigues, Alexsandra de Campos e Thaina Macedo.

---

Este README fornece uma visão geral do aplicativo FaceCook e como executá-lo. Para obter instruções detalhadas sobre o aplicativo, consulte a documentação do projeto.