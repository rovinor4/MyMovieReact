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

    function formatRupiah(angka) {
        return angka.toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR'
        });
    }

    const Status = {
        0: {
            text: "Proses Pembayaran",
            color: "warning"
        },
        1: {
            text: "Pembayaran Selesai",
            color: "success"
        },
    };


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


        fetch("http://apimymovie.test/api/bill", {
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
        fetch("http://apimymovie.test/api/bill/" + id, {
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
                            <th rowSpan={2}>Id</th>
                            <th rowSpan={2}>Email User</th>
                            <th colSpan={2}>Film</th>
                            <th rowSpan={2}>Status</th>
                            <th rowSpan={2} style={{ width: "150px" }}>Tools</th>
                        </tr>
                        <tr>
                            <th>Nama</th>
                            <th>Harga</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            film.map((item) => (
                                <tr key={item.id}>
                                    <th>{item.id}</th>
                                    <td>{item.users.email}</td>
                                    <td>{item.films.name}</td>
                                    <td>{formatRupiah(item.films.price)}</td>
                                    <td><Bs.Badge className={'bg-' + Status[item.status].color}>{Status[item.status].text}</Bs.Badge></td>
                                    <td>
                                        <div className='d-flex gap-2 justify-content-center'>
                                            <Link to={"/admin/transaksi/edit/" + item.id}>
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
            return <h3 className='mx-auto text-center mt-4 fw-bold text-primary'>Data Transaksi Tidak Di Temukan</h3>;
        }
    }


    return (
        <Bs.Container className="pt-5">
            <div className='shadow-sm border p-4 rounded-4 bg-white'>
                <Link to={"/admin"}>
                    <Bs.Button variant='dark'>Back To Admin</Bs.Button>
                </Link>
                <div className='d-flex w-100 justify-content-end gap-2'>
                    <Link to={"/admin/transaksi/add"}>
                        <Bs.Button >Add Transaksi</Bs.Button>
                    </Link>
                </div>
                <Tables />
            </div>
        </Bs.Container>
    );
}

export default App;
