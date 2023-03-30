import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as Bs from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
function App() {
    return (
        <Bs.Container className="pt-5 text-center">
            <h1>Error 404</h1>
            <p>Sepertinya halaman yang kamu kunjungi tidak ditemukan pada server kami</p>
            <Link to={"/"}>
                <Bs.Button>Back To Home</Bs.Button>
            </Link>
        </Bs.Container>
    );
}

export default App;
