import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import Header from "../../components/header";
import Footer from "../../components/footer";
import './styles.css';
import axios from "axios";

function Editar() {
  
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
  const { id } = useParams(); // Hook para pegar o id da receita nos parâmetros da URL

  useEffect(() => {

    // Função assíncrona para buscar os detalhes da receita a ser editada
    async function fetchReceita() {

      try {

        // Requisição GET para obter os detalhes da receita com o ID específico
        const response = await axios.get(
          `https://facecook-backend.blacksky-4c211341.australiaeast.azurecontainerapps.io/editar/${id}`
        );
  
        // Extrai os dados da receita da resposta
        const { NomePrato, Ingrediente, ModoPreparo, Categoria, TempoPreparo, Rendimento } = response.data.receitaSelecionada;
  
        // Define os estados com os dados da receita
        setNome(NomePrato);
        setIngredientes(Ingrediente);
        setModoPreparo(ModoPreparo);
        setCategorias(Categoria);
        setTempoPreparo(TempoPreparo);
        setRendimento(Rendimento);
      } catch (error) {

        // Registra um erro caso ocorra um problema ao carregar a receita
        console.error("Erro ao carregar a receita: ", error);
      }
    }
  
    // Chama a função fetchReceita quando o ID da receita mudar
    fetchReceita();
  }, [id]); // Array de dependências, isso significa que este efeito só será executado quando o ID mudar
  
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

  // Função para editar a receita selecionada
  const handleEditar = async () => {

    // Confirmação do usuário antes de enviar o formulário
    const confirmed = window.confirm("Tem certeza de que deseja realmente atualizar?");
    
    if (!confirmed) {

      setLoading(false);
      return;
    }

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

      // Requisição PUT para atualizar a receita
      const response = await axios.put(
        `https://facecook-backend.blacksky-4c211341.australiaeast.azurecontainerapps.io/editar/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Se a requisição for bem-sucedida, navega de volta para a página inicial
      if (response.status === 200) {

        setLoading(false); // Desativa o status de carregamento
        alert("Atualizado com sucesso"); // Exibe um alerta de sucesso
        navigate("/"); // Navega de volta para a página inicial
      }
    } catch (error) {

      // Registra um erro caso a requisição falhe
      console.error("Erro ao atualizar: ", error);
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
          <div className="editar-section">
            <p><strong>Imagem: </strong></p>
            <div>
              <input id="file" type="file" onChange={handleArquivo} />
              <label for="file">
                <span>{ arquivoNome }</span>
                <span>selecionar</span>
              </label>
            </div>
            <p className="titulo"><strong>Nome: </strong></p>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <p className="titulo"><strong>Ingredientes: </strong></p>
            <textarea
              type="text"
              value={ingredientes}
              onChange={(e) => setIngredientes(e.target.value)}
            />
            <p className="titulo"><strong>Modo de preparo: </strong></p>
            <textarea
              type="text"
              value={modoPreparo}
              onChange={(e) => setModoPreparo(e.target.value)}
            />
            <p className="titulo"><strong>categoria: </strong></p>
            <select value={categorias} onChange={handleDropdown}>
              <option value="">Escolha a categoria</option>
              <option value="salgado">Salgado</option>
              <option value="doce">Doce</option>
            </select>
            <p className="titulo"><strong>Tempo de preparo: </strong></p>
            <input
              type="text"
              value={tempoPreparo}
              onChange={(e) => setTempoPreparo(e.target.value)}
            />
            <p className="titulo"><strong>Rendimento: </strong></p>
            <input
              type="text"
              value={rendimento}
              onChange={(e) => setRendimento(e.target.value)}
            />
            <button onClick={handleEditar}>Atualizar</button>
          </div>
        </main>
      <Footer />
    </div>
  );
}

export default Editar;