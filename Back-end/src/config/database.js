// Importação do Mongoose para manipular o MongoDB
const mongoose = require("mongoose");

// Função assíncrona para estabelecer a conexão com o banco de dados
async function conexao() {
    try {
        // Tentativa de conexão com o banco de dados MongoDB utilizando o método connect do Mongoose
        await mongoose.connect("mongodb+srv://alecampos1976:ZUq0lulWM8CRu3s0@cluster0.wohbmou.mongodb.net/facecook");
    } catch (error) {
        // Se ocorrer um erro durante a conexão, será capturado aqui e exibido no console
        console.log("Erro de conexão com o banco de dados:", error);
    }
}

// Exportação da função para que ela possa ser utilizada em outros módulos
module.exports = conexao;
