import React from 'react';
import ReactDOM from 'react-dom/client';
import { Home } from './components/home';
import { Products } from './components/products';
import { Navbar, Footer } from './components/layout';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={ <Home /> }></Route>
          <Route path='/products' element={ <Products /> }></Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

