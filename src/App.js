import './App.css';

// importação de elementos

import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {onAuthStateChanged} from "firebase/auth"; // função que mapeia se a autenticação foi feita ou não.

// context 
import {AuthProvider} from "./context/AuthContext";

// hooks
import {useState, useEffect} from "react";
import {useAuthentication} from "./hooks/useAuthentication";

// Pages
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Cadastro from "./pages/Cadastro/Cadastro";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import CreatePost from "./pages/CreatePost/CreatePost";
import Search from "./pages/Search/Search";
import Post from "./pages/IndividualPost/Post";
import EditPost from "./pages/EditPost/EditPost";

// componentes
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  const [user, setUser] = useState(undefined);
  const {auth} = useAuthentication(); 

  const loadingUser = user === undefined;  // 'loadingUser' é o valor de 'user' comparado ao undefined

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    })
  }, [auth]);

  if(loadingUser) {
    return <p> Carregando... </p>;
  }

  return (
    <div className="App">
     <AuthProvider value = {{user}}> 
      <BrowserRouter>
       <Navbar />
        <div className = "container"> 
           <Routes>
             <Route path = "/" element = {<Home />} />
             <Route path = "/About" element = {<About />} />
             <Route path = "/search" element = {<Search />} />
             <Route path = "/posts/:id" element = {<Post />} />

             <Route path = "/Cadastro" element = {!user ? <Cadastro /> : <Navigate to = "/" />} /> 
             <Route path = "/Login" element = {!user ? <Login/> : <Navigate to = "/" />} />  {/* rota passível de bloqueio */}
             <Route path = "/Dashboard" element = {!user ? <Navigate to = "/Login" /> : <Dashboard />} />  
             <Route path = "/posts/create" element = {!user ? <Navigate to = "/Login" /> : <CreatePost />} />
             <Route path = "/posts/edit/:id" element = {!user ? <Navigate to = "/Login" /> : <EditPost />} />

           </Routes>
         </div>
         <Footer />
      </BrowserRouter>
     </AuthProvider>  
    </div>
  );
}

export default App;
