import {db} from "../firebase/config";  // importação de const  

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut
} from "firebase/auth"; 

import {useState, useEffect} from "react";

export const useAuthentication = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  // clean up
  // deal with memory leak (para impedir vazamento de memória)

  const [cancelled, setCancelled] = useState(false);
  const auth = getAuth();  // para podermos usar as funções de autenticação. 

  const checkIfIsCancelled = () => {
    if(cancelled) {
        return;
    }
  }

  // Registrando user no sistema

  const createUser = async (data) => {  // pois está indo para um BD externo. 
    checkIfIsCancelled();

    setLoading(true);
    setError(null);

    try {
      const {user} = await createUserWithEmailAndPassword(  // precisa-se esperar esse 'user' chegar.
        auth,
        data.email,
        data.password   
      );
      
      await updateProfile(user, {displayName: data.displayName})

      setLoading(false);
      return user;

    }

    catch (error) {
      console.log(error.message);
      console.log(typeof error.message);

      let systemErrorMessage; // tratando erros de autenticação
      if(error.message.includes("Password")) {
        systemErrorMessage = "A senha precisa possuir pelo menos 6 caracteres.";
      } else if(error.message.includes("email-already")) {
        systemErrorMessage = "E-mail já cadastrado.";
      } else {
        systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde.";
      }

      setLoading(false);
      setError(systemErrorMessage);
    }

  };

   // Logout - sign out

   const logout = () => {
    checkIfIsCancelled();

    signOut(auth);
   }

   useEffect(() => {
     return () => setCancelled(true);
   }, []);


   // Login - sign in

   const login = async (data) => {
     checkIfIsCancelled();
     setLoading(true);
     setError(false);

     try {
       await signInWithEmailAndPassword(auth, data.email, data.password);
       setLoading(false);
     }

     catch (error) {
       let systemErrorMessageLog;

       if(error.message.includes("user-not-found")) {
         systemErrorMessageLog = "Usuário não encontrado.";

       } else if(error.message.includes("wrong-password")) {
         systemErrorMessageLog = "Senha incorreta.";
       }

       else {
         systemErrorMessageLog = "Ocorreu um erro, por favor tente mais tarde";
       }

       setError(systemErrorMessageLog);
       setLoading(false);
     }

   }

  return {  // exportando itens do hook
    auth,
    createUser,
    error,
    loading,
    logout,
    login,
  };

}