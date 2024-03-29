// CSS
import styles from "./Dashboard.module.css";

// elements
import {Link} from "react-router-dom";

// hooks
import {AuthValue} from "../../context/AuthContext";
import {useFetchDocuments} from "../../hooks/useFetchDocuments";
import {useDeleteDocument} from "../../hooks/useDeleteDocument";

const Dashboard = () => {
  const {user} = AuthValue();
  const uid = user.uid;

   const {documents: posts, loading} = useFetchDocuments("posts", null, uid);

   const {deleteDocument} = useDeleteDocument("posts");


   if(loading) {
    return <p> Carregando... </p>
   }

    return ( 
    <div className = {styles.dashboard}>
        <h2> Dashboard </h2>
        <p> Gerencie os seus posts</p>

        {posts && posts.length === 0 ? (
         <div className = {styles.nopost}> 
           <p> Não foram encontradas publicações. Você pode começar quando quiser! </p>
           <Link to = "/posts/create" className = "btn"> Criar primeiro post </Link>
          </div>
        ) : (
          <> 
            <div className = {styles.postHeader}> 
              <span> Título </span>
              <span> Ações </span>
             </div>

            {posts && posts.map((post) => 
               <div key = {post.id} className = {styles.postRow}> 
                 <p> {post.title} </p> 
                 <div key = {post.id} > 
                   <Link to = {`/posts/${post.id}`} className = "btn btn-outline"> Ver </Link>
                   <Link to = {`/posts/edit/${post.id}`} className = "btn btn-outline"> Editar </Link>

                   <button onClick = {() => deleteDocument(post.id)} className = "btn btn-outline btn-danger">
                     Excluir
                   </button>
                 </div>
               </div> 
           )}

         </> 
        )} 

    </div>
 ) 
};

export default Dashboard;