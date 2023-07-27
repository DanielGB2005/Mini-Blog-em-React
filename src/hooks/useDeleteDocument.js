// hooks
import {useState, useEffect, useReducer} from "react";

//elementos
import {db} from "../firebase/config";
import {doc, deleteDoc} from "firebase/firestore";  // importando métodos de 'exclusão' do Firebase 

const initialState = {
    loading: null,
    error: null,
};

const deleteReducer = (state, action) => {  // função para tratar eventos do reducer
   switch(action.type) {
    case "LOADING": return {loading: true, error: null};
    case "DELETED_DOC": return {loading: false, error: null};
    case "ERROR": return {loading: false, error: action.payload};
    default: return state;
   }
}

export const useDeleteDocument = (docCollection) => { // 'docCollection' é o parâmetro do hook
    const [response, dispatch] = useReducer(deleteReducer, initialState);

    // deal with memory leak 
    const [cancelled, setCancelled] = useState(false);

    const checkCancelBeforeDispatch = (action) => {
      if(!cancelled) {
         dispatch(action);
      }
    }

    const deleteDocument = async (id) => {    // apaga com base no id do post
        checkCancelBeforeDispatch({
            type: "LOADING",
          });      

        try {
          const deletedDocument = await deleteDoc(doc(db, docCollection, id));  // aqui, ele pega tipo a referência do documento também. 

          checkCancelBeforeDispatch({
            type: "DELETED_DOC",
            payload: deletedDocument  // dado em si
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

    return {deleteDocument, response};
}; 

