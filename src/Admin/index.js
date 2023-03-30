import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation, } from "react-router-dom";
import * as Bs from 'react-bootstrap';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

function App() {

    const navigate = useNavigate();
    const [loading, SetLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [film, setFilm] = useState([]);

    React.useEffect(() => {
        if (!localStorage._token || !localStorage._user) {
            navigate("../");
        } else {
            var dataUser = JSON.parse(localStorage._user);
            setItems([dataUser]);
            if (dataUser.is_admin == 0) {
                navigate("../");
            }
        }


        fetch("http://apimymovie.test/api/film", {
            method: "GET",
        })
            .then(
                (response) => {
                    return response.json();
                }
            )
            .then((data) => {
                if (data.status == true) {
                    SetLoading(false);
                    setFilm(data.data);
                }
            })
    }, []);


    const Hapus = (e) => {
        var id = e.target.getAttribute("data-id")
        fetch("http://apimymovie.test/api/film/" + id, {
            method: "DELETE",
        })
            .then(
                (response) => {
                    return response.json();
                }
            )
            .then((data) => {
                if (data.status == true) {
                    const MySwal = withReactContent(Swal)
                    MySwal.fire({
                        title: <strong>Delete Success</strong>,
                        html: <p>Data berhasil dihapus</p>,
                        icon: 'success'
                    }).then(() => {
                        window.location.reload()
                    })
                }
            })
    }

    if (loading) {
        return (
            <Bs.Container className="pt-5">
                <Bs.Spinner animation="border" className='mx-auto d-block' variant="primary" />
            </Bs.Container>
        );
    }


    const Tables = () => {
        if (film.length > 0) {
            return (
                <Bs.Table className='mt-4' striped bordered hover>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Nama Film</th>
                            <th>Tayang pada</th>
                            <th style={{ width: "150px" }}>Tools</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            film.map((item) => (
                                <tr key={item.id}>
                                    <th>{item.id}</th>
                                    <td>{item.name}</td>
                                    <td>{item.created_at}</td>
                                    <td>
                                        <div className='d-flex gap-2 justify-content-center'>
                                            <Link to={"/admin/film/" + item.id}>
                                                <Bs.Button>Edit</Bs.Button>
                                            </Link>
                                            <Bs.Button variant='danger' data-id={item.id} onClick={(e) => { Hapus(e) }}>Hapus</Bs.Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Bs.Table>
            );
        } else {
            return <h3 className='mx-auto text-center mt-4 fw-bold text-primary'>Data Film Tidak Di Temukan</h3>;
        }
    }


    return (
        <Bs.Container className="pt-5">
            <div className='shadow-sm border p-4 rounded-4 bg-white'>
                <Link to={"/akun"}>
                    <Bs.Button variant='dark'>Back To Account</Bs.Button>
                </Link>
                <div className='d-flex w-100 justify-content-end gap-2'>
                    <Link to={"/admin/film"}>
                        <Bs.Button >Add Film</Bs.Button>
                    </Link>
                    <Link to={"/admin/kategori"}>
                        <Bs.Button variant='warning'>Lihat Kategori</Bs.Button>
                    </Link>
                    <Link to={"/admin/transaksi"}>
                        <Bs.Button variant='success'>Lihat Transaksi</Bs.Button>
                    </Link>
                </div>
                <Tables />
            </div>
        </Bs.Container>
    );
}

export default App;
