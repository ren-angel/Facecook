import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/home";
import Adicionar from "../pages/adicionar";
import Editar from "../pages/editar";

function Rotas() {

    return (

        // Atribuindo as rotas apropriadas a cada página
        <BrowserRouter>
            <Routes>
                <Route path="/" Component={Home} />
                <Route path="/adicionar" Component={Adicionar} />
                <Route path="/editar/:id" Component={Editar} />
            </Routes>
        </BrowserRouter>
    );
}

export default Rotas;