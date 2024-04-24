const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { BlobServiceClient } = require("@azure/storage-blob");

const receitas = require("../schemas/receitas.js");

const conexao = require("../config/db.js");
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
        
        console.error("Error:", error);
        return res.status(401).json({ error: "Failed to upload image" });
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

    ingredientes = ingredientes.split(',');

    const receitas = new receitas({
      nome,
      ingredientes,
      modoPreparo,
      categorias,
      tempoPreparo,
      rendimento,
      imagem: imageUrl,
    });
    await receitas.save();
  } catch (err) {

    console.error("Erro ao fazer o upload", err);
    res.status(500).json({ error: "Falha ao fazer o upload" });
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

      const blobName = `${Date.now()} + ${req.file.originalname}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      const data = req.file.buffer;
      await blockBlobClient.upload(data, data.length);
      
      receitaExistente.imagem = blockBlobClient.url;
    }

    const { nome, ingredientes, modoPreparo, categorias, tempoPreparo, rendimento } = req.body;
    if (nome) receitaExistente.nome = nome;
    if (ingredientes) receitaExistente.ingredientes = ingredientes;
    if (modoPreparo) receitaExistente.modoPreparo = modoPreparo;
    if (categorias) receitaExistente.categorias = categorias;
    if (tempoPreparo) receitaExistente.tempoPreparo = tempoPreparo;
    if (rendimento) receitaExistente.rendimento = rendimento;

    await receitaExistente.save();
  } catch (err) {

    console.error("Erro ao atualizar receita", err);
    res.status(500).json({ error: "Falha ao atualizar a receita" });
  }
});

app.delete("/:id", async (req, res) => {

  try {

    const id = req.params.id;

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
