// CSS
import styles from "./Search.module.css";

// hooks
import {useFetchDocuments} from "../../hooks/useFetchDocuments";
import {useQuery} from "../../hooks/useQuery";

// components
import PostDetails from "../../components/PostDetails";

// elements 
import {Link} from "react-router-dom";

const Search = () => {
  const query = useQuery();
  const search = query.get("q");  // por meio do hook, pegamos 'q'. O método 'get' pertence ao URLSearchParams.

  const {documents: posts} = useFetchDocuments("posts", search); 

    return (
        <div>
           <h2> Search </h2>

           {posts && posts.length === 0 && (
            <>
              <p> Não foram encontrados posts a partir da sua busca... </p>
              <Link to = "/" className = "btn btn-dark"> Voltar </Link>
            </>
           )}
           {posts && posts.map((post) => (
              <PostDetails key = {post.id} post = {post} />
           ))}

        </div>
    )
};

export default Search;