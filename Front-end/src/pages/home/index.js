import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/header';
import Footer from '../../components/footer';
import './styles.css';
import { Link } from 'react-router-dom';

function Home() {

  // Variáveis de estado para gerenciar os dados das receitas e o card expandido
  const [receitas, setReceitas] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);

  // Hook useEffect para buscar as receitas quando o componente montar
  useEffect(() => {

    // Função para buscar as receitas de forma assíncrona
    const fetchReceitas = async () => {

      try {

        // Fazendo requisição GET para buscar os dados das receitas do backend
        const response = await axios.get("https://facecook-backend.blacksky-4c211341.australiaeast.azurecontainerapps.io/");

        // Se a requisição for bem-sucedida (código de status 200), atualiza o estado com os dados das receitas
        if (response.status === 200) {

          setReceitas(response.data.receitasLista);
        }
      } catch (error) {

        // Registra um erro caso a requisição falhe
        console.error("Algo deu errado: ", error);
      }
    };

    // Chamando a função fetchReceitas quando o componente monta
    fetchReceitas();
  }, []);

  // Função para alternar a expansão de um card de receita
  const toggleExpansion = (receitaId) => {

    // Se o card já estiver expandido, recolhe. Caso contrário, expande.
    setExpandedCard(expandedCard === receitaId ? null : receitaId);
  };

  // Função para excluir uma receita
  const excluirReceita = async (receitaId) => {

    // Solicitando confirmação do usuário para exclusão
    const confirmarExclusao = window.confirm("Tem certeza que deseja excluir esta receita?");

    if (confirmarExclusao) {

      try {

        // Fazendo requisição DELETE para excluir a receita do backend
        const response = await axios.delete(`https://facecook-backend.blacksky-4c211341.australiaeast.azurecontainerapps.io/${receitaId}`);

        // Se a requisição for bem-sucedida, atualiza o estado filtrando a receita excluída
        if (response.status === 200) {

          setReceitas(receitas.filter(receita => receita._id !== receitaId));
        }
      } catch (error) {

        // Registra um erro caso a requisição falhe
        console.error("Algo deu errado", error)
      }
    }
  };

  return (
    <div className="container">
      <Header />
      <main className="main">
        <section className="welcome-section">
          <h2>Bem-vindo ao melhor site de receitas!!</h2>
          <div className="receitas">
            {receitas && receitas.map((receita, indice) => (
              <div className="receita" key={indice} style={{ paddingBottom: expandedCard === receita._id ? 0 : 20 }}>
                <img className="imagem-receita" src={receita.Imagem} alt={`Imagem ${indice}`} />
                <h3 className="nome-receita">{receita.NomePrato}</h3>
                <div className={`informacoes ${expandedCard === receita._id ? 'show' : ''}`}>
                  <p><strong>Ingredientes: </strong></p>
                  <ul className="ingredientes">
                    {receita.Ingrediente.map((ingrediente, indiceIngrediente) => (
                      <li key={indiceIngrediente}>{ingrediente}</li>
                    ))}
                  </ul>
                  <p className="modo-preparo"><strong>Modo de Preparo: </strong>{receita.ModoPreparo}</p>
                  <p className="categoria"><strong>Categoria: </strong>{receita.Categoria}</p>
                  <p className="tempo-preparo"><strong>Tempo de Preparo: </strong>{receita.TempoPreparo}</p>
                  <p className="rendimento"><strong>Rendimento: </strong>{receita.Rendimento}</p>
                </div>
                <div className={`botoes ${expandedCard === receita._id ? 'show' : ''}`}>
                  <Link to={`/editar/${receita._id}`}>
                    <button className='botao-excluir'>Editar</button>
                  </Link>
                  <button className="botao-excluir" onClick={() => excluirReceita(receita._id)}>Excluir</button>
                </div>
                <button className="botao-expansao" onClick={() => toggleExpansion(receita._id)}>
                  {expandedCard === receita._id ? 'Fechar' : 'Expandir'}
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
