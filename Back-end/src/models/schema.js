const mongoose = require("mongoose");

const receitasSchema = new mongoose.Schema({
    Imagem:{type:String,required:true},
    NomePrato:{type:String,required:true},
    Ingrediente:{type:[String],required:true},
    ModoPreparo:{type:String,required:true},
    Categoria:{type:String, enum:['salgado','doce'],default:'salgado'},
    TempoPreparo:{type:String,required:true},
    Rendimento:{type:String,required:true},
});

const receitas = mongoose.model('receitas',receitasSchema);
module.exports = receitas;