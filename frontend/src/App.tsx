import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Hero from './pages/home/Hero/Hero';
import CategoryList from './pages/home/Category_List/CategoryList';
import ProductList from './pages/home/ProductList/ProductList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <CategoryList />
                <div id="products" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                  <ProductList />
                </div>
              </>
            } />
            <Route path="/cart" element={<div style={{ padding: '2rem' }}><h1>Cart</h1></div>} />
            <Route path="/login" element={<div style={{ padding: '2rem' }}><h1>Login</h1></div>} />
            {/* Add other routes here */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
