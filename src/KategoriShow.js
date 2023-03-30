import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import * as Bs from 'react-bootstrap';
import { useEffect, useState } from "react";
function App() {
    const [Loading, SetLoading] = useState(true);
    const [Items, SetItems] = useState([]);
    let { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://apimymovie.test/api/kategori/" + id, {
            method: "GET",
        })
            .then(
                (response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        navigate("../");
                    }

                }
            )
            .then((data) => {
                if (data.status == true) {
                    SetLoading(false);
                    SetItems(data.data);
                } else {
                    navigate("../");
                }
            })
    }, [])

    if (Loading) {
        return (
            <Bs.Container className="pt-5">
                <Bs.Spinner animation="border" className='mx-auto d-block' variant="primary" />
            </Bs.Container>
        );
    }

    if (Items.length == 0) {
        return (
            <Bs.Container className="pt-5">
                <h5>Kosong</h5>
            </Bs.Container>
        );
    }


    return (
        <Bs.Container className="py-5">
            <h2 className="text-center text-primary fw-bold">Kategori : {Items.name}</h2>
            <p className="my-2 text-center">{Items.deskripsi}</p>
            <img className="w-100 rounded-4 mb-5" height={"200px"} src={"http://apimymovie.test/storage/" + Items.image.replaceAll('public/', '')} />

            <Bs.Row className='g-5'>
                {
                    Items.film.map((item) => (
                        <Bs.Col md="2">
                            <Link to={"/show/" + item.id} className="hoverCard rounded-4">
                                <img src={"http://apimymovie.test/storage/" + item.image.replaceAll('public/', '')} className='w-100 shadow border' height={"300px"}></img>
                            </Link>
                        </Bs.Col>
                    ))
                }
            </Bs.Row>
        </Bs.Container>
    );
}

export default App;
