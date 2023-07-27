// se assemelha ao hook 'useFetchDocuments', mas ele está sendo usado para exibir os dados individuais de cada post e para também deixar o hook mencionado menos complexo.

// hooks
import {useState, useEffect} from "react";

// elements
import {db} from "../firebase/config";
import {doc, getDoc} from "firebase/firestore";  // importantes para a manipulação do documento.

export const useFetchDocument = (docCollection, id) => { 
    const [document, setDocument] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    // deal with memory leak 
    const [cancelled, setCancelled] = useState(false);

    useEffect(() => {

      async function loadDocument() {  // para termos o carregamento atualizado dos dados
        if(cancelled) {
            return;
        }

        setLoading(true);
        
        try{
            const docRef = await doc(db, docCollection, id)  // pegando referência do documento
            const docSnap = await getDoc(docRef);  // pegando Snap do documento (algo mais individual)

            setDocument(docSnap.data());
            setLoading(false);
        } catch(error) {
            console.log(error);
            setError(error.message);
            setLoading(true);
        }
        
      }  

      loadDocument();  // cada vez que ocorrer mudança no 'docColletion', essa função é chamada.

    }, [docCollection, id, cancelled]);

    useEffect(() => {
      return () => setCancelled(true);
    }, []);  // array de dependências vazio para, aqui, a função ser executada 1 vez só.
  
    return {document, error, loading};
};
