import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from '../../components/header';
import Footer from "../../components/footer";
import './styles.css';

function Adicionar() {

  // Estados para armazenar os dados do formulário e o status de carregamento
  const [arquivo, setArquivo] = useState(null);
  const [arquivoNome, setArquivoNome] = useState(null);
  const [nome, setNome] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [modoPreparo, setModoPreparo] = useState("");
  const [categorias, setCategorias] = useState("");
  const [tempoPreparo, setTempoPreparo] = useState("");
  const [rendimento, setRendimento] = useState("");
  const [loading, setLoading] = useState(false); // Estado de carregamento
  const navigate = useNavigate(); // Hook para navegação

  // Manipulador de evento para selecionar arquivo de imagem
  const handleArquivo = (event) => {

    if (event.target.files[0]) {

      setArquivo(event.target.files[0]);
      setArquivoNome(event.target.files[0].name);
    }
  };

  // Manipulador de evento para selecionar categoria
  const handleDropdown = (event) => {

    setCategorias(event.target.value);
  };

  // Função para fazer upload da receita
  const handleUpload = async () => {

    setLoading(true); // Ativa o status de carregamento
    
    try {

      // Cria um objeto FormData para enviar os dados do formulário
      const formData = new FormData();
      formData.append("imagem", arquivo);
      formData.append("nome", nome);
      formData.append("ingredientes", ingredientes);
      formData.append("modoPreparo", modoPreparo);
      formData.append("categorias", categorias);
      formData.append("tempoPreparo", tempoPreparo);
      formData.append("rendimento", rendimento);

      // Confirmação do usuário antes de enviar o formulário
      const confirmed = window.confirm("Tem certeza de que deseja fazer o upload?");

      if (!confirmed) {
        
        setLoading(false);
        return;
      }

      // Requisição POST para adicionar a receita
      const response = await axios.post(
        "https://facecook-backend.blacksky-4c211341.australiaeast.azurecontainerapps.io/adicionar",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Se a requisição for bem-sucedida, navega de volta para a página inicial
      if (response.status === 200) {

        setLoading(false); // Desativa o status de carregamento
        alert("Criado com sucesso"); // Exibe um alerta de sucesso
        navigate("/"); // Navega de volta para a página inicial
      }
    } catch (error) {
      
      // Registra um erro caso a requisição falhe
      console.error("Erro ao criar: ", error);
    }
};

  return (
    <div>
      <Header />
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
      <main>
        <div className="adicionar-section">
          <div>
            <input id="file" type="file" onChange={handleArquivo} />
            <label htmlFor="file">
              <span>{ arquivoNome }</span>
              <span>Escolha uma imagem!</span>
            </label>
          </div>
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <textarea
            type="text"
            placeholder="Ingrediente 1, Ingrediente 2,..."
            value={ingredientes}
            onChange={(e) => setIngredientes(e.target.value)}
          />
          <textarea
            type="text"
            placeholder="Modo de preparo"
            value={modoPreparo}
            onChange={(e) => setModoPreparo(e.target.value)}
          />
          <select value={categorias} onChange={handleDropdown}>
            <option value="">Escolha a categoria</option>
            <option value="salgado">Salgado</option>
            <option value="doce">Doce</option>
          </select>
          <input
            type="text"
            placeholder="Tempo de preparo"
            value={tempoPreparo}
            onChange={(e) => setTempoPreparo(e.target.value)}
          />
          <input
            type="text"
            placeholder="Rendimento"
            value={rendimento}
            onChange={(e) => setRendimento(e.target.value)}
          />
          <button onClick={handleUpload}>Upload</button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Adicionar;