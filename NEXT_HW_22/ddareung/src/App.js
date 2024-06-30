import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/header';
import Main from './pages/main/main';
import About from './pages/about/about';
import Footer from './components/footer/footer';
import BikeSearch from './pages/bike/bike';
import './App.css';

function App() {
    return (
        <Router>
            <div>
                <Header />
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/bike" element={<BikeSearch />} />
                    <Route path="/about" element={<About />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
