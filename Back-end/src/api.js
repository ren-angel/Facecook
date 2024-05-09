// Importação dos módulos necessários do Express, Cors, Multer e Azure Blob Storage
const express = require("express"); // Express para construir a API
const cors = require("cors"); // Cors para permitir requisições de diferentes origens
const multer = require("multer"); // Multer para upload de arquivos
const { BlobServiceClient } = require("@azure/storage-blob"); // Cliente para o Azure Blob Storage

// Importação do modelo de receitas
const receitas = require("./models/schema.js");

// Importação da função de conexão com o banco de dados MongoDB
const conexao = require("./config/database.js");
conexao(); // Estabelecimento da conexão com o banco de dados

// Inicialização do aplicativo Express
const app = express();

// Definição da porta para a aplicação Express
const PORT = 5000;

// Middleware para processar requisições com dados JSON
app.use(express.json());

// Middleware para habilitar o CORS
app.use(cors());

// Configuração do armazenamento do Multer para armazenamento em memória
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Configurações para conexão com o Azure Blob Storage
const connectionString =
  "DefaultEndpointsProtocol=https;AccountName=senaireceitas;AccountKey=lMEgnyyW994t0pdTBoI1WvQ4fXuSOiskBH1gcpqcQd9RzWdZDKQzgByISQnNe0TppVymUrMXGbqD+AStieWT3g==;EndpointSuffix=core.windows.net";
const containerName = "fotosreceitas";
const blobServiceClient =
  BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

// Rota para obter todas as receitas
app.get("/", async (req, res) => {
    try {
        // Tentativa de encontrar todas as receitas no banco de dados
        const receitasLista = await receitas.find();
        // Resposta com a lista de receitas em formato JSON
        res.json({ receitasLista });
    } catch (error) {
        // Em caso de erro, loga o erro no console e retorna uma resposta com status de erro e uma mensagem JSON
        console.error("Erro:", error);
        return res.status(401).json({ error: "Falha ao achar os dados" });
    }
});

// Rota para adicionar uma nova receita
app.post("/adicionar", upload.single("imagem"), async (req, res) => {
  try {
    // Gerar um nome único para o blob no Azure Blob Storage
    const blobName = `${Date.now()} + ${req.file.originalname}`;
    // Cliente para acessar o bloco de blob no container do Azure Blob Storage
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    // Dados do arquivo enviado na requisição
    const data = req.file.buffer;
    // Upload do arquivo para o Azure Blob Storage
    await blockBlobClient.upload(data, data.length);

    // URL da imagem no Azure Blob Storage
    const imageUrl = blockBlobClient.url;
    // Extrair os dados da receita do corpo da requisição
    const { nome, ingredientes, modoPreparo, categorias, tempoPreparo, rendimento } = req.body;
    // Separar os ingredientes em um array
    const ingredientesArray = ingredientes.split(',');

    // Criar uma nova instância de receita com os dados fornecidos
    const novaReceita = new receitas({
      Imagem: imageUrl,
      NomePrato: nome,
      Ingrediente: ingredientesArray,
      ModoPreparo: modoPreparo,
      Categoria: categorias,
      TempoPreparo: tempoPreparo,
      Rendimento: rendimento,
    });
    // Salvar a nova receita no banco de dados
    await novaReceita.save();

    // Retorna uma mensagem de sucesso
    res.status(200).json({ message: "Receita adicionadad com sucesso" });
  } catch (err) {
    // Em caso de erro, loga o erro no console e retorna uma resposta com status de erro e uma mensagem JSON
    console.error("Erro ao fazer o upload", err);
    res.status(500).json({ error: "Falha ao fazer o upload" });
  }
});

// Rota para mostrar os dados da receita com base no seu ID quando for editá-la
app.get("/editar/:id", async (req, res) => {
  try {
    // ID da receita a ser editada, extraído dos parâmetros da URL
    const id = req.params.id;
    // Buscar a receita com o ID fornecido no banco de dados
    const receitaSelecionada = await receitas.findById(id);
    // Responder com os dados da receita selecionada em formato JSON
    res.json({ receitaSelecionada });
  } catch (error) {
    // Em caso de erro, loga o erro no console e retorna uma resposta com status de erro e uma mensagem JSON
    console.error("Erro:", error);
    return res.status(401).json({ error: "Falha ao achar os dados" });
  }
});

// Rota para editar uma receita com base no seu ID
app.put("/editar/:id", upload.single("imagem"), async (req, res) => {
  try {
    // ID da receita a ser editada, extraído dos parâmetros da URL
    const id = req.params.id;
    // Buscar a receita existente no banco de dados com o ID fornecido
    const receitaExistente = await receitas.findById(id);

    // Verificar se a receita existe
    if (!receitaExistente) {
      return res.status(404).json({ error: "A receita não existe" });
    }

    // Se um novo arquivo de imagem for enviado na requisição
    if (req.file) {
      // URL da imagem atual
      const imageUrl = receitaExistente.Imagem;
      // Nome do blob atual
      const OldBlobName = decodeURIComponent(imageUrl.substring(imageUrl.lastIndexOf('/') + 1));
      // Cliente para acessar o blob atual no Azure Blob Storage
      const OldBlockBlobClient = containerClient.getBlockBlobClient(OldBlobName);
      // Excluir o blob atual
      await OldBlockBlobClient.delete();
      
      // Gerar um novo nome único para o novo blob de imagem
      const NewBlobName = `${Date.now()} + ${req.file.originalname}`;
      // Cliente para acessar o novo blob de imagem no Azure Blob Storage
      const NewBlockBlobClient = containerClient.getBlockBlobClient(NewBlobName);
      // Dados do novo arquivo de imagem enviado na requisição
      const data = req.file.buffer;
      // Upload do novo arquivo de imagem para o Azure Blob Storage
      await NewBlockBlobClient.upload(data, data.length);
      
      // Atualizar a URL da imagem da receita para a nova URL
      receitaExistente.Imagem = NewBlockBlobClient.url;
    }

    // Extrair os dados da receita do corpo da requisição
    const { nome, ingredientes, modoPreparo, categorias, tempoPreparo, rendimento } = req.body;
    
    // Atualizar os dados da receita conforme for enviado
    if (nome) receitaExistente.NomePrato = nome;
    if (ingredientes) {
      const ingredientesArray = ingredientes.split(',');
      receitaExistente.Ingrediente = ingredientesArray;
    }
    if (modoPreparo) receitaExistente.ModoPreparo = modoPreparo;
    if (categorias) receitaExistente.Categoria = categorias;
    if (tempoPreparo) receitaExistente.TempoPreparo = tempoPreparo;
    if (rendimento) receitaExistente.Rendimento = rendimento;

    // Salvar as alterações da receita no banco de dados
    await receitaExistente.save();

    // Retorna uma mensagem de sucesso
    res.status(200).json({ message: "Receita adicionadad com sucesso" });
  } catch (err) {
    // Em caso de erro, loga o erro no console e retorna uma resposta com status de erro e uma mensagem JSON
    console.error("Erro ao atualizar receita", err);
    res.status(500).json({ error: "Falha ao atualizar a receita" });
  }
});

// Rota para deletar uma receita com base no seu ID
app.delete("/:id", async (req, res) => {
  try {
    // ID da receita a ser deletada, extraído dos parâmetros da URL
    const id = req.params.id;
    // Buscar a receita a ser deletada no banco de dados com o ID fornecido
    const receitaVitima = await receitas.findById(id);
    // URL da imagem da receita a ser deletada
    const imageUrl = receitaVitima.Imagem;
    // Nome do blob a ser deletado (extraído da URL da imagem)
    const blobName = decodeURIComponent(imageUrl.substring(imageUrl.lastIndexOf('/') + 1));
    // Cliente para acessar o blob a ser deletado no Azure Blob Storage
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    // Deletar o blob do Azure Blob Storage
    await blockBlobClient.delete();
    // Deletar a receita do banco de dados
    const deletarReceita = await receitas.findByIdAndDelete(id);
    // Responder com a receita deletada em formato JSON
    res.json(deletarReceita);
  } catch (err) {
    // Em caso de erro, loga o erro no console e retorna uma resposta com status de erro e uma mensagem JSON
    console.error("Erro ao deletar a receita", err);
    res.status(500).json({ error: "Falha ao deletar a receita" });
  }
});

// Iniciar o servidor Express e escutar na porta especificada
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
