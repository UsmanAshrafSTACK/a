import './App.css';
import Login from './Componenets/Login';
import SignUp from './Componenets/SignUp';
import { Routes, Route, Link } from "react-router-dom"
import Home from './Home';
import {Provider} from 'react-redux'
import {store} from './Componenets/State/store'


function App() {
  return (
<Provider store={store}>
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/signup" element={<SignUp />}/>
    <Route path="/home" element={<Home />}/>
  </Routes>
</Provider>
  );
}

export default App;
