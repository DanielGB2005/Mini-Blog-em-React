// De maneira indireta, programamos para o 'PostDetails' ser exibido na home. Acontece que, ao clicar em 'ler', vamos para o componente 'Post'. No componente 'Dashboard', ao clicarmos em 'ver', o componente 'Post' é exibido também.

// CSS
import styles from "./Home.module.css";

// hooks
import {useNavigate, Link} from "react-router-dom";
import {useState} from "react";
import {useFetchDocuments} from "../../hooks/useFetchDocuments";

// components
import PostDetails from "../../components/PostDetails";

const Home = () => {
  const [query, setQuery] = useState("");
  const {documents: posts, loading} = useFetchDocuments("posts");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if(query) {
        return navigate(`/search?q=${query}`);  // é enviado para o path '/search' e passamos o parâmetro 'q' ao lado do valor de 'query'. 
    }
  };

    return (
        <div className = {styles.home}>
            <h1> Veja os nossos posts mais recentes </h1>

            <form onSubmit = {handleSubmit} className = {styles.search_form}>
                <input type = "text" placeholder = "Ou busque por mais tags..." onChange = {(e) => setQuery(e.target.value)} />
                <button className = "btn btn-dark"> Pesquisar </button>
            </form>

            <div>
                <h1> Publicações </h1>
                {loading && <p> Carregando... </p>} 
                {posts && posts.map((dados) => (  // 'dados' uma hora será o title, outra hora, a image, etc.
                    <PostDetails key = {dados.id} dados = {dados} />  // 'dados' está sendo passado como prop.
                ))}

                {posts && posts.length === 0 && (
                    <div className = {styles.nopost}> 
                        <p> Não foram encontrados posts </p> 
                        <Link to = "/posts/create" className = "btn"> Criar primeiro post </Link>
                    </div>
                )}
            </div>
        </div>
    )
};

export default Home;