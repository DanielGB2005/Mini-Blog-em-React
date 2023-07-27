// hooks
import {useState, useEffect} from "react";

// elements
import {db} from "../firebase/config";
import {collection, query, orderBy, onSnapshot, where} from "firebase/firestore";

export const useFetchDocuments = (docCollection, search = null, uid = null) => { // 'search' está sendo usado para fazer a busca e 'uid' para pegar os dados do user e colocar na dashboard.
    const [documents, setDocuments] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    // deal with memory leak 
    const [cancelled, setCancelled] = useState(false);

    useEffect(() => {

      async function loadData() {  // para termos o carregamento atualizado dos dados
        if(cancelled) {
            return;
        }

        setLoading(true);
        const collectionRef = await collection(db, docCollection);

        try {
          let q;

          // busca
          // dashboard

          if(search) {
            // OBS: algumas querys precisam de um índice composto
            q = await query(collectionRef, where("tagsArray", "array-contains", search), orderBy("createdAt", "desc"));  // 'array-contains' é um parâmetro do firebase para verificar se há itens no array
            

          } else if(uid) {  // trazendo posts do user para a dashboard por meio do uid
            q = await query(collectionRef, where("uid", "==", uid), orderBy("createdAt", "desc"));  
          }
          
          else {  // trazendo dados do banco
            q = await query(collectionRef, orderBy("createdAt", "desc")); // solicitando à 'collectionRef' os dados em ordem decrescente de tempo (do mais novo ao mais velho).
          }

          await onSnapshot(q, (querySnapshot) => { // função que mapeia as alterações feitas nos dados. 'querySnapshot' é um argumento do próprio firebase.
          setDocuments(querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()})));  // 'documents' pode ser entendido como os dados a serem trazidos. 'doc' é cada elemento a ser percorrido. obs: o 'id' está separado dos próprios dados, é algo do firebase.
          setLoading(false);
          
          })
        } catch(error) {
           console.log(error);
           setError(error.message);
           setLoading(false);
        }
      }  

      loadData();  // cada vez que ocorrer mudança no 'docColletion', essa função é chamada.

    }, [docCollection, search, uid, cancelled]);

    useEffect(() => {
      return () => setCancelled(true);
    }, []);  // array de dependências vazio para, aqui, a função ser executada 1 vez só.
  
    return {documents, error, loading};
};
