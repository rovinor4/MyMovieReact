import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Kategori from './Kategori';
import KategoriDetail from './KategoriShow';
import Error404 from './404';
import Navbar from './Navbar';
import Show from './Show';
import Login from './Page/Login';
import SignUp from './Page/SignUp';
import Akun from './Page/Akun';
import Admin from './Admin/index';
import AdminFilm from './Admin/Film';
import AdminKategori from './Admin/Kategori/index';
import AdminKategoriAdd from './Admin/Kategori/Controller';
import AdminBill from './Admin/Bill/index';
import AdminBillAdd from './Admin/Bill/Controller';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.min';

export default function Index() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/">
          <Route index element={<App />} />
          <Route path='kategori' element={<Kategori />} />
          <Route path='kategori/:id' element={<KategoriDetail />} />
          <Route path='show/:id' element={<Show />} />
          <Route path='login' element={<Login />} />
          <Route path='sign-up' element={<SignUp />} />
          <Route path='akun' element={<Akun />} />
          <Route path='*' element={<Error404 />} />
        </Route>
        <Route path="/admin">
          <Route index element={< Admin />} />
          <Route path='film' element={< AdminFilm />} />
          <Route path='film/:id' element={< AdminFilm />} />
          <Route path='kategori' element={< AdminKategori />} />
          <Route path='kategori/add' element={< AdminKategoriAdd />} />
          <Route path='kategori/edit/:id' element={< AdminKategoriAdd />} />
          <Route path='transaksi' element={< AdminBill />} />
          <Route path='transaksi/add' element={< AdminBillAdd />} />
          <Route path='transaksi/edit/:id' element={< AdminBillAdd />} />
          <Route path='*' element={<Error404 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Index />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
