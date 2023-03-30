import React, { useState } from 'react';
import "../node_modules/bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";
import { BrowserRouter, Routes, Route, useParams, Link } from "react-router-dom";
import * as Bs from 'react-bootstrap';
import "../node_modules/video-react/dist/video-react.css";
import { Player } from 'video-react';
import "./index.css";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

function formatRupiah(angka) {
    return angka.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR'
    });
}

function App() {
    let { id } = useParams();
    const [Akun, setAkun] = useState([]);
    const [AkunLod, setAkunLod] = useState(true);
    const [statusBeli, setstatusBeli] = useState(false);

    const [Loading, SetLoading] = useState(true);
    const [Name, SetName] = useState("");
    const [Price, SetPrice] = useState("");
    const [Image, SetImage] = useState("");
    const [Deskripsi, SetDeskripsi] = useState("");
    const [Kategori, SetKategori] = useState("");
    const [RatingAll, SetRatingAllAdd] = useState(0);
    const [Ulasan, SetUlasanAdd] = useState(0);
    const [VideoPreviewUrl, setVideoPreviewUrl] = useState("");

    const [Rating, SetRatingAdd] = useState(0);
    const [commentar, SetcommentarAdd] = useState("");
    const [Editcommentar, SetEditcommentarAdd] = useState(false);
    const [IdRating, SetIdRating] = useState("");

    const SetRating = (e) => {
        SetRatingAdd(e.target.value);
    };


    React.useEffect(() => {

        if (localStorage._token && localStorage._user) {
            var dataUser = JSON.parse(localStorage._user);
            setAkunLod(false);
            setAkun([dataUser]);
        }

        if (AkunLod == false) {
            var UrlUtama = "http://apimymovie.test/api/film/" + id;
            if (localStorage._user && localStorage._token) {
                UrlUtama = "http://apimymovie.test/api/film/" + id + "?user=" + Akun[0].id;
            }


            fetch(UrlUtama, {
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
                        SetName(data.data.name);
                        SetDeskripsi(data.data.deskripsi)
                        SetPrice(formatRupiah(data.data.price));
                        SetRatingAllAdd(data.data.rating_utama);
                        SetUlasanAdd(data.data.jumlah_ulasan);
                        if (data.data.bill && data.data.bill[0].status == 1) {
                            setstatusBeli(true)
                        }
                        setVideoPreviewUrl("http://apimymovie.test/storage/" + data.data.video.replaceAll('public/', ''))
                        SetImage("http://apimymovie.test/storage/" + data.data.image.replaceAll('public/', ''))
                        if (data.data.kategori != null) {
                            SetKategori(data.data.kategori.name)
                        }
                    }
                })

            fetch(`http://apimymovie.test/api/commentar?film_id=${id}&user_id=${Akun[0].id}`, {
                method: "GET",
            })
                .then(
                    (response) => {
                        return response.json();
                    }
                )
                .then((data) => {
                    if (data.status == true) {
                        if (data.data != null) {
                            SetEditcommentarAdd(true);
                            SetRatingAdd(parseInt(data.data[0].rating));
                            SetcommentarAdd(data.data[0].commentar);
                            SetIdRating(data.data[0].id);
                        }
                    }
                })
        }

    }, [AkunLod]);

    React.useEffect(() => {
        setTimeout(() => {
            var allRating = document.querySelectorAll(`input[name="rating"] ~ i`);
            allRating.forEach((element) => {
                if (element.classList.contains("bi-star-fill")) {
                    element.classList.remove("bi-star-fill");
                    element.classList.add("bi-star");
                }
            });

            var val = Rating;

            for (let index = 1; index <= val; index++) {
                var x = document.querySelector(
                    `input[name="rating"][value="${index}"] ~ i`
                );
                x.classList.remove("bi-star");
                x.classList.add("bi-star-fill");
            }

        }, 100);
    }, [Rating]);

    if (Loading) {
        return (
            <Bs.Container className="pt-5">
                <Bs.Spinner animation="border" className='mx-auto d-block' variant="primary" />
            </Bs.Container>
        );
    }

    const AddBill = () => {
        var Data = new FormData();
        Data.append("user_id", Akun[0].id);
        Data.append("film_id", id);
        Data.append("status", "false");

        fetch("http://apimymovie.test/api/bill", {
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
                        html: <p>Data Bill berhasil ditambahkan</p>,
                        icon: 'success'
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

    const SaveRating = () => {
        if (Rating <= 0 || commentar == "") {
            const MySwal = withReactContent(Swal)
            MySwal.fire({
                title: <strong>Input Kosong</strong>,
                html: <i>Pastikan Input tidak kosong</i>,
                icon: 'error'
            })
            return false;
        }

        var Form = new FormData();
        Form.append("film_id", id);
        Form.append("user_id", Akun[0].id);
        Form.append("rating", Rating);
        Form.append("commentar", commentar);

        var url = "http://apimymovie.test/api/commentar";
        if (IdRating != "") {
            url = url + "/" + IdRating;
            Form.append("_method", "PUT");
        }

        fetch(url, {
            method: "POST",
            body: Form,
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
                        title: <strong>Rating Berhasil Di Simpan</strong>,
                        html: <p>Rating dan komentar kamu berhasil di simpan, jika kamu ingin mengubahnya kamu tinggal klik tombol edit</p>,
                        icon: 'success'
                    }).then(() => {
                        window.location.reload();
                    })
                } else {
                    const MySwal = withReactContent(Swal)
                    MySwal.fire({
                        title: <strong>Error</strong>,
                        html: <p>{data.message}</p>,
                        icon: 'error'
                    })
                }
            })
            .catch((error) => {
                const MySwal = withReactContent(Swal)
                MySwal.fire({
                    title: <strong>Error Di Bagian Server</strong>,
                    html: <p>{error.message}</p>,
                    icon: 'error'
                })
            })
    }


    return (
        <Bs.Container className={(statusBeli) ? "pb-5" : "py-5"}>
            <Bs.Row className='justify-content-center g-4'>
                <Bs.Col md={(statusBeli) ? 10 : 4}>
                    {
                        (statusBeli) ?
                            <Player
                                playsInline
                                src={VideoPreviewUrl}
                            />
                            :
                            <img src={Image} className="w-100 rounded-4" height={"500px"} />
                    }
                </Bs.Col>
                <Bs.Col md={(statusBeli) ? 12 : 8}>
                    <h1 className='fw-bold'>{Name}</h1>
                    <h5>{Price}</h5>
                    <div className='d-flex justify-content-start align-items-center gap-2 mb-3'>
                        {Kategori && (
                            <Bs.Badge className='bg-primary'>{Kategori}</Bs.Badge>
                        )}
                        <span>|</span>
                        <span className='d-flex gap-1'>
                            <i className='bi bi-star-fill text-warning'></i>
                            <b>{RatingAll}</b>
                        </span>
                        <span>|</span>
                        <span className='d-flex gap-1'>
                            <b>Jumlah Ulasan :</b>
                            <span>{Ulasan}</span>
                        </span>
                    </div>
                    <p>{Deskripsi}</p>
                    {
                        statusBeli == false && (
                            <Bs.Button className='px-5' onClick={AddBill}><i className='bi bi-wallet2 me-1'></i> Tambahkan Bill</Bs.Button>
                        )
                    }

                    {
                        statusBeli && (
                            <div className='clearfix shadow-sm p-4 border rounded-4' style={{ marginTop: "50px" }}>
                                <div className="d-flex justify-content-center align-item-center gap-4 rating">
                                    <label className="text-warning fs-4 position-relative">
                                        <input
                                            type={"radio"}
                                            name="rating"
                                            onChange={(e) => SetRating(e)}
                                            value={"1"}
                                            className="position-absolute start-50 opacity-0"
                                        />
                                        <i className="bi bi-star"></i>
                                    </label>
                                    <label className="text-warning fs-4 position-relative">
                                        <input
                                            type={"radio"}
                                            name="rating"
                                            onChange={(e) => SetRating(e)}
                                            value={"2"}
                                            className="position-absolute start-50 opacity-0"
                                        />
                                        <i className="bi bi-star"></i>
                                    </label>
                                    <label className="text-warning fs-4 position-relative">
                                        <input
                                            type={"radio"}
                                            name="rating"
                                            onChange={(e) => SetRating(e)}
                                            value={"3"}
                                            className="position-absolute start-50 opacity-0"
                                        />
                                        <i className="bi bi-star"></i>
                                    </label>
                                    <label className="text-warning fs-4 position-relative">
                                        <input
                                            type={"radio"}
                                            name="rating"
                                            onChange={(e) => SetRating(e)}
                                            value={"4"}
                                            className="position-absolute start-50 opacity-0"
                                        />
                                        <i className="bi bi-star"></i>
                                    </label>
                                    <label className="text-warning fs-4 position-relative">
                                        <input
                                            type={"radio"}
                                            name="rating"
                                            onChange={(e) => SetRating(e)}
                                            value={"5"}
                                            className="position-absolute start-50 opacity-0"
                                        />
                                        <i className="bi bi-star"></i>
                                    </label>
                                </div>
                                <Bs.FormGroup>
                                    <Bs.FormLabel>Berikan Ulasan</Bs.FormLabel>
                                    <Bs.Form.Control
                                        as="textarea"
                                        placeholder={"Komentar Atau Pendapat Anda Tentang : " + Name}
                                        style={{ height: '100px' }}
                                        value={commentar} onInput={(e) => { SetcommentarAdd(e.target.value) }}
                                    />
                                </Bs.FormGroup>
                                <Bs.Button className='float-end mt-3' onClick={SaveRating}>{(Editcommentar == true) ? "Edit" : "Save"}</Bs.Button>
                            </div>
                        )
                    }
                </Bs.Col>
            </Bs.Row>

        </Bs.Container>
    );
}

export default App;
