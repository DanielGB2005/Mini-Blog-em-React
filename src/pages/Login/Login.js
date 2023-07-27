// CSS
import styles from "./Login.module.css";

// importação de hooks
import {useState, useEffect} from "react";
import {useAuthentication} from "../../hooks/useAuthentication";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
 
    const {login, error: authError, loading} = useAuthentication();  // trazendo elementos do hook useAuthentication.
 
    const handleSubmit = async (e) => {  // pois é preciso esperar uma resposta
     e.preventDefault();
     setError("");
 
     const user = {
         email,
         password,
     };
 
     const res = await login(user); 
 
     console.log(user);
    };
 
    useEffect(() => {
      if(authError){  // se houver erro de autenticação, o valor do state 'error' daqui é substituído pelo authError.
         setError(authError);
      }
    }, [authError]);


    return (
        <div className = {styles.login}> 
           
           <h1> Entrar </h1>
            <p> Faça o login para poder utilizar o sistema  </p>
            <form onSubmit = {handleSubmit}>

                <label>
                    <span> E-mail: </span>
                    <input type = "email" name = "email" placeholder = "E-mail do usuário" value = {email} onChange = {(e) => setEmail(e.target.value)} required />
                </label>

               <label>
                  <span> Senha: </span>
                  <input type = "password" name = "password" placeholder = "Informe sua senha" value = {password} onChange = {(e) => setPassword(e.target.value)} required />
               </label>
               

               {!loading && <button className = "btn"> Entrar </button> }
               {loading && <button className = "btn" disabled> Aguarde... </button> }
               {error && <p className = "error"> {error} </p>}

            </form>

        </div>
    )
}; 

export default Login;