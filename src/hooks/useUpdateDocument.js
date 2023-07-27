// hooks
import {useState, useEffect, useReducer} from "react";

//elementos
import {db} from "../firebase/config";
import {updateDoc, doc} from "firebase/firestore";  // importando função do Firebase para atualizar dados

const initialState = {
    loading: null,
    error: null,
};

const updateReducer = (state, action) => {  // função para tratar eventos do reducer
   switch(action.type) {
    case "LOADING": return {loading: true, error: null};
    case "UPDATED_DOC": return {loading: false, error: null};
    case "ERROR": return {loading: false, error: action.payload};
    default: return state;
   }
}

export const useUpdateDocument = (docCollection) => { // 'docCollection' é o parâmetro do hook
    const [response, dispatch] = useReducer(updateReducer, initialState);

    // deal with memory leak 
    const [cancelled, setCancelled] = useState(false);

    const checkCancelBeforeDispatch = (action) => {
      if(!cancelled) {
         dispatch(action);
      }
    }

    const updateDocument = async (id, data) => {
        checkCancelBeforeDispatch({
            type: "LOADING",
          });      

        try {
          const docRef = await doc(db, docCollection, id);
          const updatedDocument = await updateDoc(docRef, data);  // essa e a linha acima poderiam ter ficado em uma linha única (como no 'deleteDocument').

          checkCancelBeforeDispatch({
            type: "UPDATED_DOC",
            payload: updatedDocument  // dado em si
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

    return {updateDocument, response};
}; 

