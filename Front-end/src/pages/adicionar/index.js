import React, { useState } from "react";
import axios from "axios";

function Adicionar() {
  const [arquivo, setArquivo] = useState(null);
  const [nome, setNome] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [modoPreparo, setModoPreparo] = useState("");
  const [categorias, setCategorias] = useState("");
  const [tempoPreparo, setTempoPreparo] = useState("");
  const [rendimento, setRendimento] = useState("");

  const handleArquivo = (event) => {

    setArquivo(event.target.files[0]);
  };

  const handleDropdown = (event) => {

    setCategorias(event.target.value);
  };

  const handleUpload = async () => {

    try {

      const formData = new FormData();
      formData.append("imagem", arquivo);
      formData.append("nome", nome); 
      formData.append("ingredientes", ingredientes);
      formData.append("modoPreparo", modoPreparo);
      formData.append("categorias", categorias);
      formData.append("tempoPreparo", tempoPreparo);
      formData.append("rendimento", rendimento);

      const response = await axios.post(
        "http://localhost:5000/adicionar",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {

        alert("Criado com sucesso");
      }
    } catch (error) {

      console.error("Erro ao criar: ", error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleArquivo} />
      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <input
        type="text"
        placeholder="Ingrediente 1, Ingrediente 2,..."
        value={ingredientes}
        onChange={(e) => setIngredientes(e.target.value)}
      />
      <input
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
  );
}

export default Adicionar;