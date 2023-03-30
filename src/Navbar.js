import * as React from 'react';
import * as Bs from 'react-bootstrap';
import { Link, NavLink, useLocation } from 'react-router-dom';

function Navigation() {
    var dataURL = {
        "Home": "/",
        "Kategori": "/kategori",
    }
    const objEntries = Object.entries(dataURL);
    const location = useLocation();
    const items = objEntries.map(([key, value]) => {

        var x;
        if (location.pathname === value) {
            x = <Bs.Nav.Link key={key} as={NavLink} to={value} className="fw-bold text-white bg-primary rounded-pill px-4">{key}</Bs.Nav.Link>
        } else {
            x = <Bs.Nav.Link key={key} as={NavLink} to={value} className="text-secondary opacity-75 rounded-pill px-4">{key}</Bs.Nav.Link>
        }

        return (x);
    });

    return items;
}


function Navbar() {

    const [myComponent, setMyComponent] = React.useState(null);
    const [Admin, setAdmin] = React.useState(false);
    const location = useLocation();

    React.useEffect(() => {

        if (localStorage._token && localStorage._user) {
            setMyComponent(<Link to={"/akun"}><Bs.Button variant='outline-primary'>Open My Account</Bs.Button></Link>)
        } else {
            setMyComponent(<Link to={"/login"}><Bs.Button variant='outline-primary'>Login Or Register</Bs.Button></Link>)
        }

    }, [location.pathname]);


    return (
        <Bs.Navbar bg="light" style={{ height: "80px" }} className="shadow border-bottom " fixed="top" expand="lg">
            <Bs.Container>
                <Bs.Navbar.Brand href="/" className="text-primary fw-bold fs-4">My Movie </Bs.Navbar.Brand>
                <Bs.Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Bs.Navbar.Collapse id="basic-navbar-nav">
                    <Bs.Nav className="me-auto gap-2">
                        <Navigation />
                    </Bs.Nav>
                    {myComponent}
                </Bs.Navbar.Collapse>
            </Bs.Container>
        </Bs.Navbar>
    );
}

export default Navbar;
