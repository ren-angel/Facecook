// Importação do Mongoose para manipular o MongoDB
const mongoose = require("mongoose");

// Definição do esquema das receitas usando o método Schema do Mongoose
const receitasSchema = new mongoose.Schema({
    Imagem: { type: String, required: true }, // Campo para a URL da imagem da receita
    NomePrato: { type: String, required: true }, // Campo para o nome do prato da receita
    Ingrediente: { type: [String], required: true }, // Campo para os ingredientes da receita, armazenados como um array de strings
    ModoPreparo: { type: String, required: true }, // Campo para o modo de preparo da receita
    Categoria: { type: String, enum: ['salgado', 'doce'], default: 'salgado' }, // Campo para a categoria da receita, com valores permitidos 'salgado' ou 'doce'
    TempoPreparo: { type: String, required: true }, // Campo para o tempo de preparo da receita
    Rendimento: { type: String, required: true }, // Campo para o rendimento da receita
});

// Criação do modelo 'receitas' com base no esquema definido
const receitas = mongoose.model('receitas', receitasSchema);

// Exportação do modelo para que ele possa ser utilizado em outros módulos
module.exports = receitas;
