// CSS
import styles from "./Cadastro.module.css";

// importação de hooks
import {useState, useEffect} from "react";
import {useAuthentication} from "../../hooks/useAuthentication";

const Cadastro = () => {
   const [displayName, setDisplayName] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [confirmPassword, setConFirmPassword] = useState("");
   const [error, setError] = useState("");

   const {createUser, error: authError, loading} = useAuthentication();  // trazendo elementos do hook useAuthentication.

   const handleSubmit = async (e) => {  // pois é preciso esperar uma resposta
    e.preventDefault();
    setError("");

    const user = {
        displayName,
        email,
        password
    }

    if(password != confirmPassword) {
        setError("As senhas precisam ser iguais!");
        return;
    }

    const res = await createUser(user); 

    console.log(user);
   }

   useEffect(() => {
     if(authError){  // se houver erro de autenticação, o valor do state 'error' daqui é substituído pelo authError.
        setError(authError);
     }
   }, [authError]);

    return (
        <div className = {styles.register}>
            <h1> Cadastre-se para postar </h1>
            <p> Crie seu usuário e compartilhe suas histórias </p>
            <form onSubmit = {handleSubmit}>
                <label> 
                    <span> Nome: </span>
                    <input type = "text" name = "displayName" placeholder = "Nome do usuário" value = {displayName} onChange = {(e) => setDisplayName(e.target.value)} required />
                </label>

                <label>
                    <span> E-mail: </span>
                    <input type = "email" name = "email" placeholder = "E-mail do usuário" value = {email} onChange = {(e) => setEmail(e.target.value)} required />
                </label>

               <label>
                  <span> Senha: </span>
                  <input type = "password" name = "password" placeholder = "Informe sua senha" value = {password} onChange = {(e) => setPassword(e.target.value)} required />
               </label>

               <label>
                  <span> Confirme sua senha: </span>
                  <input type = "password" name = "confirmpassword" placeholder = "Confirme sua senha" value = {confirmPassword} onChange = {(e) => setConFirmPassword(e.target.value)} required />
               </label>

               

               {!loading && <button className = "btn"> Cadastrar </button> }
               {loading && <button className = "btn" disabled> Aguarde... </button> }
               {error && <p className = "error"> {error} </p>}

            </form>
        </div>
    )
};

export default Cadastro;