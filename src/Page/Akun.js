import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, } from "react-router-dom";
import * as Bs from 'react-bootstrap';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
function formatRupiah(angka) {
    return angka.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR'
    });
}

function App() {

    var dataUser = null;
    const navigate = useNavigate();
    const [loading, SetLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [film, setFilm] = useState([]);

    const [IdBill, SetIdBill] = useState(0);
    const [IdFilm, SetIdFilm] = useState(0);
    const [imagePreviewUrl, setImagePreviewUrl] = useState("");
    const [file, Setfile] = useState(null);

    const [Show, SetShow] = useState(false)
    const handleClose = () => { SetShow(false); Setfile(null); SetIdBill(0); setImagePreviewUrl(""); };

    const OpenBukti = (e) => {
        fetch("http://apimymovie.test/api/bill/" + e.target.value, {
            method: "GET",
        })
            .then(
                (response) => {
                    return response.json();
                }
            )
            .then((data) => {
                if (data.status == true) {
                    SetIdBill(data.data.id);
                    SetIdFilm(data.data.films.id);
                    SetShow(true)
                }
            })
    };

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
        var dataUser = null;
        if (!localStorage._token || !localStorage._user) {
            navigate("../");
        } else {
            dataUser = JSON.parse(localStorage._user);
            setItems([dataUser]);
        }
        fetch("http://apimymovie.test/api/bill?user=" + dataUser.id, {
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

    function Keluar() {
        localStorage.clear();
        navigate("../");
    }

    const File = (e) => {
        Setfile(e.target.files[0]);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreviewUrl(reader.result);
        };
        reader.readAsDataURL(e.target.files[0]);
    };

    const Update = () => {
        const Form = new FormData();

        Form.append("status", "false");
        Form.append("image", file);
        Form.append("user_id", items[0].id);
        Form.append("film_id", IdFilm);
        Form.append("_method", "PUT");


        fetch("http://apimymovie.test/api/bill/" + IdBill, {
            method: "POST",
            body: Form
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
                        title: <strong>Data Bill</strong>,
                        html: <p>Bukti Pembayaran Berhasil Di Simpan Silahkan Tunggu Konfirmasi Dari Admin</p>,
                        icon: 'success'
                    }).then(() => {
                        window.location.reload();
                    })
                } else {
                    const MySwal = withReactContent(Swal)
                    MySwal.fire({
                        title: <strong>Error Di Bagian Server</strong>,
                        html: <p>{data.message}</p>,
                        icon: 'error'
                    })
                }
            })
    }


    if (loading || items.length == null || items.length == 0) {
        return (
            <Bs.Container className="pt-5">
                <Bs.Spinner animation="border" className='mx-auto d-block' variant="primary" />
            </Bs.Container>
        );
    }


    return (
        <>
            <Bs.Container className="pt-5">
                <div className='shadow-sm border p-4 rounded-4 bg-white'>
                    <Bs.Row>
                        <Bs.Col md={6}>
                            <Bs.Row>
                                <Bs.Col md={6}><h5>Nama Lengkap</h5></Bs.Col>
                                <Bs.Col md={6}><p>{items[0].name}</p></Bs.Col>
                                <Bs.Col md={6}><h5>Email</h5></Bs.Col>
                                <Bs.Col md={6}><p>{items[0].email}</p></Bs.Col>
                            </Bs.Row>
                        </Bs.Col>
                        <Bs.Col md={3}>
                            <Bs.Button className='w-100 my-3' variant='danger' onClick={Keluar}>Keluar Akun</Bs.Button>
                            {items[0].is_admin === 1 ? <Link to={"/admin"}><Bs.Button className='w-100 my-3'>Akun Admin</Bs.Button></Link> : <></>}
                        </Bs.Col>
                    </Bs.Row>
                    <p className='text-center text-muted opacity-25'>{items[0].token}</p>
                    <Bs.Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Kode Pembelian</th>
                                <th>Nama Film</th>
                                <th>Total Tagihan</th>
                                <th>Status</th>
                                <th style={{ width: "150px" }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                film.map((index) => (
                                    <tr>
                                        <td>{index.created_at}</td>
                                        <td>{index.films.name}</td>
                                        <td>{formatRupiah(index.films.price)}</td>
                                        <td><Bs.Badge className={'bg-' + Status[index.status].color}>{Status[index.status].text}</Bs.Badge></td>
                                        <td>{(index.image == null || index.image == "") ? <Bs.Button onClick={OpenBukti} value={index.id}>Upload Bukti</Bs.Button> : <Bs.Badge className='bg-primary'>Bukti Sudah Di Upload</Bs.Badge>}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Bs.Table>
                </div>
            </Bs.Container>

            <Bs.Modal show={Show} onHide={handleClose}>
                <Bs.Modal.Header closeButton>
                    <Bs.Modal.Title>Upload Bukti</Bs.Modal.Title>
                </Bs.Modal.Header>
                <Bs.Modal.Body>
                    <Bs.FormGroup>
                        <Bs.FormLabel>Upload File</Bs.FormLabel>
                        <Bs.FormControl type="file" size="md" onChange={(e) => { File(e) }} />
                    </Bs.FormGroup>
                    {imagePreviewUrl && (
                        <img src={imagePreviewUrl} alt="Preview Gambar" className='mt-4 w-100 rounded-3 border' height={"200px"} style={{ objectFit: "cover" }, { objectPosition: "center" }} />
                    )}
                </Bs.Modal.Body>
                <Bs.Modal.Footer>
                    <Bs.Button variant="primary" onClick={Update}>
                        Save Changes
                    </Bs.Button>
                </Bs.Modal.Footer>
            </Bs.Modal>
        </>
    );
}

export default App;
