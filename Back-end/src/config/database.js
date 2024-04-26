const mongoose = require("mongoose");

async function conexao() {

    try {

        await mongoose.connect("mongodb+srv://alecampos1976:ZUq0lulWM8CRu3s0@cluster0.wohbmou.mongodb.net/facecook");
    } catch (error) {

        console.log("Erro de conexão com o banco de dados:", error);
    }
}

module.exports = conexao;