// hooks
import {useState, useEffect, useReducer} from "react";

//elementos
import {db} from "../firebase/config";
import {collection, addDoc, Timestamp} from "firebase/firestore";  /* importando função do Firebase (no Firebase, os locais onde salvamos os dados são chamados de 'collections'). 'addDoc' é para inserir o doc. no banco e 'Timestamp' marca o horário de sua criação. */

const initialState = {
    loading: null,
    error: null,
};

const insertReducer = (state, action) => {  // função para tratar eventos do reducer
   switch(action.type) {
    case "LOADING": return {loading: true, error: null};
    case "INSERTED_DOC": return {loading: false, error: null};
    case "ERROR": return {loading: false, error: action.payload};
    default: return state;
   }
}

export const useInsertDocument = (docCollection) => { // 'docCollection' é o parâmetro do hook
    const [response, dispatch] = useReducer(insertReducer, initialState);

    // deal with memory leak 
    const [cancelled, setCancelled] = useState(false);

    const checkCancelBeforeDispatch = (action) => {
      if(!cancelled) {
         dispatch(action);
      }
    }

    const insertDoc = async (document) => {
        checkCancelBeforeDispatch({
            type: "LOADING",
          });      

        try {
          const newDocument = {...document, createdAt: Timestamp.now()};
          const insertedDocument = await addDoc(  // function com o resultado da inserção
           collection(db, docCollection), 
           newDocument
          )

          checkCancelBeforeDispatch({
            type: "INSERTED_DOC",
            payload: insertedDocument  // dado em si
          });
        } catch (error) {
            checkCancelBeforeDispatch({
                type: "ERROR",
                payload: error.message,
              });
        }
    };

    useEffect(() => {
      return () => setCancelled(true); 
    }, []);

    return {insertDoc, response};
}; 

