import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import * as Bs from 'react-bootstrap';
import { useEffect, useState } from "react";
function App() {
    const [Loading, SetLoading] = useState(true);
    const [Items, SetItems] = useState([]);

    useEffect(() => {
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
                    SetLoading(false);
                    SetItems(data.data);
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
        <Bs.Container className="pt-5">
            <h2 className="text-center text-primary fw-bold">Kategori</h2>
            <Bs.Row>
                {
                    Items.map((item) => (
                        <Bs.Col md={3}>
                            <Link to={"/kategori/"+item.id} className="text-decoration-none">
                                <Bs.Card className="text-center shadow-sm border-0 rounded-4 overflow-hidden">
                                    <Bs.Card.Img variant="top" height={"200px"} src={"http://apimymovie.test/storage/" + item.image.replaceAll('public/', '')} />
                                    <Bs.Card.Body>
                                        <h4>{item.name}</h4>
                                    </Bs.Card.Body>
                                </Bs.Card>
                            </Link>
                        </Bs.Col>
                    ))}
            </Bs.Row>
        </Bs.Container>
    );
}

export default App;
