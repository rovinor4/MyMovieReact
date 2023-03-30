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

    const [name, Setname] = useState("");
    const [file, Setfile] = useState(null);
    const [deskripsi, Setdeskripsi] = useState("");

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

        if (id && id != "") {
            fetch("http://apimymovie.test/api/kategori/" + id, {
                method: "GET",
            })
                .then(
                    (response) => {
                        return response.json();
                    }
                )
                .then((data) => {
                    if (data.status == true) {
                        Setname(data.data.name)
                        Setdeskripsi(data.data.deskripsi);
                        if (data.data.image != "") {
                            setImagePreviewUrl("http://apimymovie.test/storage/" + data.data.image.replaceAll('public/', ''))
                        }
                    } else {
                        navigate("/admin/");
                    }
                })
                .catch(() => {
                    navigate("/admin/");
                })
        }



    }, []);


    const handleSubmit = (e) => {
        var Data = new FormData();
        Data.append("name", name);
        Data.append("image", file);
        Data.append("deskripsi", deskripsi);
        var urlApiPost = "http://apimymovie.test/api/kategori";
        if (id && id != "") {
            urlApiPost = "http://apimymovie.test/api/kategori/" + id;
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
                        title: <strong>Data Kategori</strong>,
                        html: <p>Data Kategori berhasil {(id && id != "") ? "diupdate" : "ditambahkan"}</p>,
                        icon: 'success'
                    }).then(() => {
                        navigate("/admin/kategori");
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
                        <Bs.Col md={6}>
                            <Bs.FormFloating>
                                <Bs.FormControl placeholder=' ' value={name} onInput={(e) => { Setname(e.target.value) }} />
                                <Bs.FormLabel>Nama Kategori</Bs.FormLabel>
                            </Bs.FormFloating>
                        </Bs.Col>
                        <Bs.Col md={6}>
                            <Bs.FormGroup>
                                <Bs.FormLabel>Upload File</Bs.FormLabel>
                                <Bs.FormControl type="file" size="md" onChange={(e) => { File(e) }} />
                            </Bs.FormGroup>
                        </Bs.Col>
                        {imagePreviewUrl && (
                            <Bs.Col md={12}>
                                <img src={imagePreviewUrl} alt="Preview Gambar" className='w-100 rounded-3 border' height={"200px"} style={{ objectFit: "cover" }, { objectPosition: "center" }} />
                            </Bs.Col>
                        )}
                        <Bs.Col md={12}>
                            <Bs.FormGroup>
                                <Bs.FormLabel>Deskripsi</Bs.FormLabel>
                                <Bs.Form.Control
                                    as="textarea"
                                    placeholder={"Deskirpsi Untuk Kategori : " + name}
                                    style={{ height: '100px' }}
                                    value={deskripsi} onInput={(e) => { Setdeskripsi(e.target.value) }}
                                />
                            </Bs.FormGroup>
                        </Bs.Col>
                    </Bs.Row>
                    <Bs.Button className='float-end mt-3' type='submit'>Submit</Bs.Button>
                </form>
            </div>
        </Bs.Container>
    );
}

export default App;
