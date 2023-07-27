// importação de elementos
import {NavLink} from "react-router-dom";

// CSS
import styles from "./Navbar.module.css";

// hook
import { useAuthentication } from "../hooks/useAuthentication";

// context
import {AuthValue} from "../context/AuthContext";

const Navbar = () => {
  const {user} = AuthValue();

  const {logout} = useAuthentication();  // importando a função do hook 

    return (
     <nav className = {styles.navbar}>
          <NavLink to = "/" className = {styles.brand}> Mini <span> Blog </span> </NavLink>

          <ul className = {styles.links_list}>   
             <li> <NavLink to = "/" className = {({isActive}) => (isActive ? styles.active : "")}>  Home </NavLink>  </li>

              {!user && (
              <>  {/* fragments por causa de 2 elementos pais estarem sendo exibidos */}
                 <li> <NavLink to = "/Cadastro" className = {({isActive}) => (isActive ? styles.active : "")}> Cadastro </NavLink> </li>

                 <li> <NavLink to = "/Login" className = {({isActive}) => (isActive ? styles.active : "")}> Entrar </NavLink> </li>

              </> 
              )}

              {user && (
                <>
                   <li> <NavLink to = "/Dashboard" className = {({isActive}) => (isActive ? styles.active : "")}> Dashboard </NavLink> </li>

                   <li> <NavLink to = "/posts/create" className = {({isActive}) => (isActive ? styles.active : "")}> Novo post </NavLink> </li>
                </>
              )}
              
             <li> <NavLink to = "/About" className = {({isActive}) => (isActive ? styles.active : "")}> Sobre </NavLink> </li>  

             {user && (<li> <button onClick = {logout}> Sair </button> </li>
             )}    {/* simulando link */}


         </ul> 
      </nav>
    ) 
};

export default Navbar;