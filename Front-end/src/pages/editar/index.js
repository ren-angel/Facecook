import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";

function Editar() {
  
  const [arquivo, setArquivo] = useState(null);
  const [nome, setNome] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [modoPreparo, setModoPreparo] = useState("");
  const [categorias, setCategorias] = useState("");
  const [tempoPreparo, setTempoPreparo] = useState("");
  const [rendimento, setRendimento] = useState("");
  const { id } = useParams();

  useEffect(() => {

    async function fetchReceita() {
      
      try {

        const response = await axios.get(
          `http://localhost:5000/editar/${id}`
        );

        const { NomePrato, Ingrediente, ModoPreparo, Categoria, TempoPreparo, Rendimento } = response.data.receitaSelecionada;
        setNome(NomePrato);
        setIngredientes(Ingrediente);
        setModoPreparo(ModoPreparo);
        setCategorias(Categoria);
        setTempoPreparo(TempoPreparo);
        setRendimento(Rendimento);
      } catch (error) {

        console.error("Erro ao carregar a receita: ", error);
      }
    }

    fetchReceita();

  }, [id]);

  const handleArquivo = (event) => {

    setArquivo(event.target.files[0]);
  };

  const handleDropdown = (event) => {

    setCategorias(event.target.value);
  };

  const handleEditar = async () => {

    try {

      const formData = new FormData();
      formData.append("imagem", arquivo);
      formData.append("nome", nome); 
      formData.append("ingredientes", ingredientes);
      formData.append("modoPreparo", modoPreparo);
      formData.append("categorias", categorias);
      formData.append("tempoPreparo", tempoPreparo);
      formData.append("rendimento", rendimento);

      const response = await axios.put(
        `http://localhost:5000/editar/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {

        alert("Atualizado com sucesso");
      }
    } catch (error) {

      console.error("Erro ao atualizar: ", error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleArquivo} />
      <input
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <input
        type="text"
        value={ingredientes}
        onChange={(e) => setIngredientes(e.target.value)}
      />
      <input
        type="text"
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
        value={tempoPreparo}
        onChange={(e) => setTempoPreparo(e.target.value)}
      />
      <input
        type="text"
        value={rendimento}
        onChange={(e) => setRendimento(e.target.value)}
      />
      <button onClick={handleEditar}>Atualizar</button>
    </div>
  );
}

export default Editar;
