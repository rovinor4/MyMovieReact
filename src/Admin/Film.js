import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation, Form, useSearchParams, useParams, } from "react-router-dom";
import * as Bs from 'react-bootstrap';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import "../../node_modules/video-react/dist/video-react.css";
import { Player } from 'video-react';

function App() {
    let { id } = useParams();
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [itemsSelect, setItemsSelect] = useState([]);
    const [loadingSelect, setloadingSelect] = useState(true);
    const [imagePreviewUrl, setImagePreviewUrl] = useState("");
    const [VideoPreviewUrl, setVideoPreviewUrl] = useState("");

    const [name, Setname] = useState("");
    const [harga, Setharga] = useState("");
    const [file, Setfile] = useState(null);
    const [Video, SetVideo] = useState(null);
    const [deskripsi, Setdeskripsi] = useState("");
    const [Kategori, SetKategori] = useState("");

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


        fetch("http://apimymovie.test/api/kategori", {
            method: "GET",
        })
            .then(
                (response) => {
                    return response.json();
                }
            )
            .then((data) => {
                if (data.status == true) {
                    setloadingSelect(false);
                    setItemsSelect([data.data]);
                }
            })

        if (id && id != "") {
            fetch("http://apimymovie.test/api/film/" + id, {
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
                        Setharga(data.data.price)
                        Setdeskripsi(data.data.deskripsi);
                        if (data.data.kategori_film_id != null) {
                            SetKategori(data.data.kategori_film_id);
                        }
                        if (data.data.image != "") {
                            setImagePreviewUrl("http://apimymovie.test/storage/" + data.data.image.replaceAll('public/', ''))
                        }
                        if (data.data.video != "null" || data.data.video != "" || data.data.video != null) {
                            setVideoPreviewUrl("http://apimymovie.test/storage/" + data.data.video.replaceAll('public/', ''))
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
        Data.append("video", Video);
        Data.append("price", harga);
        Data.append("image", file);
        Data.append("deskripsi", deskripsi);
        if (Kategori != "") {
            Data.append("kategori_film_id", Kategori);
        }

        var urlApiPost = "http://apimymovie.test/api/film";
        if (id && id != "") {
            Data.append("_method", "PUT");
            urlApiPost = "http://apimymovie.test/api/film/" + id;
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
                        title: <strong>Data Film</strong>,
                        html: <p>Data film berhasil {(id && id != "") ? "diupdate" : "ditambahkan"}</p>,
                        icon: 'success'
                    }).then(() => {
                        navigate("/admin/");
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

    const VideoUpload = (e) => {
        SetVideo(e.target.files[0]);
        const reader = new FileReader();
        reader.onloadend = () => {
            setVideoPreviewUrl(reader.result);
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
                                <Bs.FormLabel>Nama Film</Bs.FormLabel>
                            </Bs.FormFloating>
                        </Bs.Col>

                        <Bs.Col md={6}>
                            <Bs.FormFloating>
                                <Bs.FormControl placeholder=' ' type='number' value={harga} onInput={(e) => { Setharga(e.target.value) }} />
                                <Bs.FormLabel>Harga Film</Bs.FormLabel>
                            </Bs.FormFloating>
                        </Bs.Col>
                        <Bs.Col md={12}>
                            <Bs.FormFloating>
                                <Bs.FormSelect value={Kategori} onChange={(e) => { SetKategori(e.target.value) }}>
                                    <option selected disabled value={""}>Pilih Kategori</option>
                                    {
                                        (!loadingSelect) ?
                                            itemsSelect[0].map((xc) => (
                                                <option value={xc.id}>{xc.name}</option>
                                            )) :
                                            (<option>Loading..</option>)
                                    }
                                </Bs.FormSelect>
                                <Bs.FormLabel>Kategori Film</Bs.FormLabel>
                            </Bs.FormFloating>
                        </Bs.Col>
                        <Bs.Col md={4}>
                            <Bs.FormGroup>
                                <Bs.FormLabel>Upload Video</Bs.FormLabel>
                                <Bs.FormControl type="file" size="md" onChange={(e) => { VideoUpload(e) }} />
                            </Bs.FormGroup>
                        </Bs.Col>
                        <Bs.Col md={8}>
                            {VideoPreviewUrl && (
                                <Player
                                    playsInline
                                    src={VideoPreviewUrl}
                                />
                            )}
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
                        <Bs.Col md={12}>
                            <Bs.FormGroup>
                                <Bs.FormLabel>Deskripsi</Bs.FormLabel>
                                <Bs.Form.Control
                                    as="textarea"
                                    placeholder={"Deskirpsi Untuk Film : " + name}
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
