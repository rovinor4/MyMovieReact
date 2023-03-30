import React from 'react';
import { BrowserRouter, Routes, Route, Link, Form, useNavigate } from "react-router-dom";
import * as Bs from 'react-bootstrap';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

function App() {

    const [name, Setname] = React.useState("");
    const [email, Setemail] = React.useState("");
    const [password, Setpassword] = React.useState("");
    const navigate = useNavigate();


    React.useEffect(() => {
        if (localStorage._token && localStorage._user) {
            navigate("/");
        }
    }, []);

    function kirim(e) {
        e.preventDefault();
        if (name == "" || password == "" || email == "") {
            const MySwal = withReactContent(Swal)
            MySwal.fire({
                title: <strong>Kesalahan Input</strong>,
                html: <i>Pastikan Input tidak kosong</i>,
                icon: 'error'
            })
            return false;
        }

        var Form = new FormData();
        Form.append("name", name);
        Form.append("email", email);
        Form.append("password", password);

        fetch("http://apimymovie.test/api/register", {
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
                        title: <strong>Email Terdaftar</strong>,
                        html: <p>Email sudah berhasil terdaftar coba masuk ke halaman login sekarang</p>,
                        icon: 'success'
                    }).then(() => {
                        navigate("/login");
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
            .catch((error) => {
                const MySwal = withReactContent(Swal)
                MySwal.fire({
                    title: <strong>Error Di Bagian Server</strong>,
                    html: <p>{error.message}</p>,
                    icon: 'error'
                })
            });
    }



    return (
        <Bs.Container className="pt-5">
            <Bs.Row className="justify-content-center">
                <Bs.Col md={5}>
                    <Bs.Card className="shadow">
                        <Bs.Card.Body className="p-4">
                            <h4 className="text-center">Sign Up Akun</h4>
                            <Bs.FormFloating className="mt-4">
                                <Bs.FormControl placeholder=" " value={name} onInput={(e) => { Setname(e.target.value) }} />
                                <Bs.FormLabel>Nama</Bs.FormLabel>
                            </Bs.FormFloating>
                            <Bs.FormFloating className="mt-4">
                                <Bs.FormControl placeholder=" " value={email} onInput={(e) => { Setemail(e.target.value) }} />
                                <Bs.FormLabel>Buat Email</Bs.FormLabel>
                            </Bs.FormFloating>
                            <Bs.FormFloating className="mt-4">
                                <Bs.FormControl placeholder=" " type="password" value={password} onInput={(e) => { Setpassword(e.target.value) }} />
                                <Bs.FormLabel>Password</Bs.FormLabel>
                            </Bs.FormFloating>
                            <Bs.Button className="float-end mt-4" onClick={(e) => { kirim(e) }}>Submit</Bs.Button>
                        </Bs.Card.Body>
                        <Bs.Card.Footer>
                            <Link className='w-100' to={"/login"}>
                                <Bs.Button variant='dark' className='w-100'>Login Saja</Bs.Button>
                            </Link>
                        </Bs.Card.Footer>
                    </Bs.Card>
                </Bs.Col>
            </Bs.Row>
        </Bs.Container>
    );
}

export default App;
