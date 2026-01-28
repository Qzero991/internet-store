import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Hero from './pages/home/Hero/Hero';
import CategoryList from './pages/home/Category_List/CategoryList';
import ProductList from './components/ProductList/ProductList';
import Cart from './pages/cart/Cart';
import LoginPage from './pages/login/LoginPage';
import SignUp from './pages/signup/SignUp';
import SearchPage from './pages/search/SearchPage';
import Profile from './pages/Profile/Profile';
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
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/profile" element={<Profile />} />
            {/* Add other routes here */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
