import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import * as Bs from 'react-bootstrap';

function App() {

  const [Loading, SetLoading] = useState(true);
  const [Items, SetItems] = useState([]);


  React.useEffect(() => {
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
          SetItems([data.data]);
        }
      })
  }, []);

  if (Loading) {
    return (
      <Bs.Container className="pt-5">
        <Bs.Spinner animation="border" className='mx-auto d-block' variant="primary" />
      </Bs.Container>
    );
  }

  return (
    <>
      <Bs.Container className='my-5 py-5'>
        <Bs.Row className='g-5'>
          {
            Items[0].map((item) => (
              <Bs.Col md="2">
                <Link to={"show/"+item.id} className="hoverCard rounded-4">
                  <img src={"http://apimymovie.test/storage/" + item.image.replaceAll('public/', '')} className='w-100 shadow border' height={"300px"}></img>
                </Link>
              </Bs.Col>
            ))
          }
        </Bs.Row>
      </Bs.Container>

    </>
  );
}

export default App;
