import logo from './logo.svg';
import './App.css';
import { Link, Route, BrowserRouter as Router, Routes, Switch } from "react-router-dom";
import { Main } from './pages/main';
import { Detail } from './pages/detail';
import { CreatePost } from './pages/createpost';
import './App.css';

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/detail/:id" element={<Detail />} />
      <Route path="/create" element={<CreatePost />} />
    </Routes>
    </>
  );
}

export default App;
