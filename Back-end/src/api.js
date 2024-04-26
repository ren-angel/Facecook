const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { BlobServiceClient } = require("@azure/storage-blob");

const receitas = require("./models/schema.js");

const conexao = require("./config/database.js");
conexao();

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const connectionString =
  "DefaultEndpointsProtocol=https;AccountName=senaireceitas;AccountKey=lMEgnyyW994t0pdTBoI1WvQ4fXuSOiskBH1gcpqcQd9RzWdZDKQzgByISQnNe0TppVymUrMXGbqD+AStieWT3g==;EndpointSuffix=core.windows.net";
const containerName = "fotosreceitas";
const blobServiceClient =
  BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

app.get("/", async (req, res) => {

    try {
    
        const receitasLista = await receitas.find();
    
        res.json({ receitasLista });
    } catch (error) {
        
        console.error("Erro:", error);
        return res.status(401).json({ error: "Falha ao achar os dados" });
    }
});

app.post("/adicionar", upload.single("imagem"), async (req, res) => {

  try {

    const blobName = `${Date.now()} + ${req.file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const data = req.file.buffer;
    await blockBlobClient.upload(data, data.length); 

    const imageUrl = blockBlobClient.url;
    const { nome, ingredientes, modoPreparo, categorias, tempoPreparo, rendimento } = req.body;

    const ingredientesArray = ingredientes.split(',');

    const novaReceita = new receitas({
      Imagem: imageUrl,
      NomePrato: nome,
      Ingrediente: ingredientesArray,
      ModoPreparo: modoPreparo,
      Categoria: categorias,
      TempoPreparo: tempoPreparo,
      Rendimento: rendimento,
    });
    await novaReceita.save();
  } catch (err) {

    console.error("Erro ao fazer o upload", err);
    res.status(500).json({ error: "Falha ao fazer o upload" });
  }
});

app.get("/editar/:id", async (req, res) => {

  try {

    const id = req.params.id;
  
    const receitaSelecionada = await receitas.findById(id);
  
    res.json({ receitaSelecionada });
  } catch (error) {
      
      console.error("Erro:", error);
      return res.status(401).json({ error: "Falha ao achar os dados" });
  }
});

app.put("/editar/:id", upload.single("imagem"), async (req, res) => {

  try {

    const id = req.params.id;

    const receitaExistente = await receitas.findById(id);

    if (!receitaExistente) {
      
      return res.status(404).json({ error: "A receita não existe" });
    }

    if (req.file) {

      const imageUrl = receitaExistente.Imagem;

      const OldBlobName = decodeURIComponent(imageUrl.substring(imageUrl.lastIndexOf('/') + 1));
      const OldBlockBlobClient = containerClient.getBlockBlobClient(OldBlobName);
      await OldBlockBlobClient.delete();

      const NewBlobName = `${Date.now()} + ${req.file.originalname}`;
      const NewBlockBlobClient = containerClient.getBlockBlobClient(NewBlobName);
      const data = req.file.buffer;
      await NewBlockBlobClient.upload(data, data.length);
      
      receitaExistente.Imagem = NewBlockBlobClient.url;
    }

    const { nome, ingredientes, modoPreparo, categorias, tempoPreparo, rendimento } = req.body;

    if (nome) receitaExistente.NomePrato = nome;
    if (ingredientes) {

      const ingredientesArray = ingredientes.split(',');
      receitaExistente.Ingrediente = ingredientesArray;
    }
    if (modoPreparo) receitaExistente.ModoPreparo = modoPreparo;
    if (categorias) receitaExistente.Categoria = categorias;
    if (tempoPreparo) receitaExistente.TempoPreparo = tempoPreparo;
    if (rendimento) receitaExistente.Rendimento = rendimento;

    await receitaExistente.save();
  } catch (err) {

    console.error("Erro ao atualizar receita", err);
    res.status(500).json({ error: "Falha ao atualizar a receita" });
  }
});

app.delete("/:id", async (req, res) => {

  try {

    const id = req.params.id;

    const receitaVitima = await receitas.findById(id);

    const imageUrl = receitaVitima.Imagem;

    const blobName = decodeURIComponent(imageUrl.substring(imageUrl.lastIndexOf('/') + 1));
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.delete();

    const deletarReceita = await receitas.findByIdAndDelete(id);

    res.json(deletarReceita);
  } catch (err) {

    console.error("Erro ao deletar a receita", err);
    res.status(500).json({ error: "Falha ao deletar a receita" });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
