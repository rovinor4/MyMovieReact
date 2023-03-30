import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation, Form, useSearchParams, useParams, } from "react-router-dom";
import * as Bs from 'react-bootstrap';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

function App() {
    let { id } = useParams();
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [imagePreviewUrl, setImagePreviewUrl] = useState("");

    const [file, Setfile] = useState(null);
    const [UserID, SetUserID] = useState("");
    const [FilmID, SetFilmID] = useState("");
    const [Status, SetStatus] = useState("");


    const [FilmControll, SetFilmControll] = useState([]);
    const [UserControll, SetUserControll] = useState([]);
    const [UserLoading, SetUserLoading] = useState(true);
    const [FIlmLoading, SetFIlmLoading] = useState(true);

    const StController = [
        {
            text: "Proses Pembayaran",
            color: "warning",
            st: "false"
        },
        {
            text: "Pembayaran Selesai",
            color: "success",
            st: "true"
        },
    ];


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


        fetch("http://apimymovie.test/api/bill-user", {
            method: "POST",
        })
            .then(
                (response) => {
                    return response.json();
                }
            )
            .then((data) => {
                if (data.status == true) {
                    SetUserLoading(false);
                    SetUserControll([data.data]);
                }
            })

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
                    SetFIlmLoading(false);
                    SetFilmControll([data.data]);
                }
            })


        if (id && id != "") {
            fetch("http://apimymovie.test/api/bill/" + id, {
                method: "GET",
            })
                .then(
                    (response) => {
                        return response.json();
                    }
                )
                .then((data) => {
                    if (data.status == true) {
                        SetUserID(data.data.user_id)
                        SetFilmID(data.data.film_id)
                        SetStatus((data.data.status == 1) ? "true" : "false")
                        if (data.data.image != "") {
                            setImagePreviewUrl("http://apimymovie.test/storage/" + data.data.image.replaceAll('public/', ''))
                        }
                    } else {
                        navigate("/admin/");
                    }
                })
        }



    }, []);


    const handleSubmit = (e) => {
        var Data = new FormData();
        Data.append("user_id", UserID);
        Data.append("film_id", FilmID);
        Data.append("status", Status);
        Data.append("image", file);
        var urlApiPost = "http://apimymovie.test/api/bill";
        if (id && id != "") {
            Data.append("_method", "PUT");
            urlApiPost = "http://apimymovie.test/api/bill/" + id;
        }


        fetch(urlApiPost, {
            method: "POST",
            body: Data
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
                        html: <p>Data Bill berhasil {(id && id != "") ? "diupdate" : "ditambahkan"}</p>,
                        icon: 'success'
                    }).then(() => {
                        navigate("/admin/transaksi");
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

        e.preventDefault();
    }

    const File = (e) => {
        Setfile(e.target.files[0]);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreviewUrl(reader.result);
        };
        reader.readAsDataURL(e.target.files[0]);
    };

    return (
        <Bs.Container className="py-5">
            <div className='shadow-sm border p-4 rounded-4 bg-white clearfix'>
                <Link to={"/admin"}>
                    <Bs.Button variant='dark'>Back To Admin</Bs.Button>
                </Link>
                <form onSubmit={(e) => { handleSubmit(e) }} >
                    <Bs.Row className='mt-5 g-4'>
                        <Bs.Col md={4}>
                            <Bs.FormFloating>
                                <Bs.FormSelect value={UserID} onChange={(e) => { SetUserID(e.target.value) }}>
                                    <option selected disabled value={""}>Pilih User</option>
                                    {
                                        (!UserLoading) ?
                                            UserControll[0].map((xc) => (
                                                <option value={xc.id}>{xc.email}</option>
                                            )) :
                                            (<option>Loading..</option>)
                                    }
                                </Bs.FormSelect>
                                <Bs.FormLabel>Akun</Bs.FormLabel>
                            </Bs.FormFloating>
                        </Bs.Col>
                        <Bs.Col md={4}>
                            <Bs.FormFloating>
                                <Bs.FormSelect value={FilmID} onChange={(e) => { SetFilmID(e.target.value) }}>
                                    <option selected disabled value={""}>Pilih Status</option>
                                    {
                                        (!FIlmLoading) ?
                                            FilmControll[0].map((xc) => (
                                                <option value={xc.id}>{xc.name}</option>
                                            )) :
                                            (<option>Loading..</option>)
                                    }
                                </Bs.FormSelect>
                                <Bs.FormLabel>Film</Bs.FormLabel>
                            </Bs.FormFloating>
                        </Bs.Col>
                        <Bs.Col md={4}>
                            <Bs.FormFloating>
                                <Bs.FormSelect value={Status} onChange={(e) => { SetStatus(e.target.value) }}>
                                    <option selected disabled value={""}>Pilih Status</option>
                                    {
                                        StController.map((xc) => (
                                            <option value={xc.st}>{xc.text}</option>
                                        ))
                                    }
                                </Bs.FormSelect>
                                <Bs.FormLabel>Status Pembayaran</Bs.FormLabel>
                            </Bs.FormFloating>
                        </Bs.Col>
                        <Bs.Col md={4}>
                            <Bs.FormGroup>
                                <Bs.FormLabel>Upload File</Bs.FormLabel>
                                <Bs.FormControl type="file" size="md" onChange={(e) => { File(e) }} />
                            </Bs.FormGroup>
                        </Bs.Col>
                        <Bs.Col md={8}>
                            {imagePreviewUrl && (
                                <img src={imagePreviewUrl} alt="Preview Gambar" className='w-100 rounded-3 border' height={"200px"} style={{ objectFit: "cover" }, { objectPosition: "center" }} />
                            )}
                        </Bs.Col>
                    </Bs.Row>
                    <Bs.Button className='float-end mt-3' type='submit'>Submit</Bs.Button>
                </form>
            </div>
        </Bs.Container>
    );
}

export default App;
