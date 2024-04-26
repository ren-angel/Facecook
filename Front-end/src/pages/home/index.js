import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {

  const [receitas, setReceitas] = useState(null);

  useEffect(() => {

    const fetchReceitas = async () => {

      try {

        const response = await axios.get("http://localhost:5000/");

        if (response.status === 200) {

          setReceitas(response.data.receitasLista);
        }
      } catch (error) {

        console.error("Algo deu errado: ", error);
      }
    };

    fetchReceitas();

  }, []);

  const excluirReceita = async (receitaId) => {

    try {

        const response = await axios.delete(`http://localhost:5000/${receitaId}`);

        if (response.status === 200) {

            alert("Deletado com sucesso");
            setReceitas(receitas.filter(receita => receita._id !== receitaId));
        }
    } catch (error) {

        console.error("Algo deu errado", error)
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Home</h1>
      
      <Link to='/adicionar'>
        <button>Adicionar</button>
      </Link>
      
      {receitas && (
        <div>
          {receitas.map((receita, indice) => (
            <div key={indice}>
              <img src={receita.Imagem} alt={`Imagem ${indice}`} />
              <h2>Nome: {receita.NomePrato}</h2>
              <ul>
                {receita.Ingrediente.map((ingrediente, indiceIngrediente) => (
                  <li key={indiceIngrediente}>{ingrediente}</li>
                ))}
              </ul>
              <p>Modo de Preparo: {receita.ModoPreparo}</p>
              <h3>Categoria: {receita.Categoria}</h3>
              <h3>Tempo de Preparo: {receita.TempoPreparo}</h3>
              <h3>Rendimento: {receita.Rendimento}</h3>
              <Link to={`/editar/${receita._id}`}>
                <button>Editar</button>
              </Link>
              <button onClick={() => excluirReceita(receita._id)}>Excluir</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;