// CSS
import styles from "./CreatePost.module.css";

// hooks
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useInsertDocument} from "../../hooks/useInsertDocument";

// context
import {AuthValue} from "../../context/AuthContext.js";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState([]);  // pois é uma lista de valores
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);

  const {insertDoc, response} = useInsertDocument("posts");  // pegando valores do hook

  const navigate = useNavigate();

  const {user} = AuthValue();
  
  const handlePost = (e) => {
    e.preventDefault();
    setFormError("");

    // validate image URL
     try {
       new URL(image); 
     } catch (error) {
        setFormError("A imagem precisa ser uma URL.");
     }

    // criar o array de tags
    const tagsArray = tags.split(",").map((tag) => tag.trim().toLowerCase());

    // checar todos os valores
    if(!title || !image || !body || !tags) {
        setFormError("Por favor, preencha todos os campos!");
    }

    if(formError) {
        return;   // paralisar avanço na inserção do post
    }
    
    insertDoc({
        title, 
        image,
        body,
        tagsArray,
        uid: user.uid,  // user id
        createdBy: user.displayName
    });

    // redirect to Home page
    navigate("/");

  };

    return (
        <div className = {styles.create_post}>
            <h2> Criar post </h2>
            <p> Escreva sobre o que quiser e compartilhe o seu conhecimento !</p>

            <form onSubmit = {handlePost}>
                <label> 
                    <span> Título: </span>
                    <input type = "text" name = "title" placeholder = "Adicione um título..." value = {title} onChange = {(e) => setTitle(e.target.value)} required />
                </label>

                <label>
                    <span> URL da Imagem:</span>
                    <input type = "text" name = "image" placeholder = "Insira uma imagem para o seu post" value = {image} onChange = {(e) => setImage(e.target.value)} required />
                </label>

                <label>
                    <span> Conteúdo: </span>
                    <textarea type = "text" name = "body" placeholder = "Conteúdo do post" value = {body} onChange = {(e) => setBody(e.target.value)} required />
                </label>

                <label>
                    <span> Tags: </span>
                    <input type="text" name = "tags" placeholder = "Insira as tags separadas por vírgula" value = {tags} onChange = {(e) => setTags(e.target.value)} />
                </label>

                {!response.loading && (<button className = "btn"> Postar </button>)} {/* vem do response */}
                {response.loading && (<button className = "btn" disabled> Publicando... </button>)}

                {response.error && <p className = "error"> {response.error} </p>}  {/* vem do response */}
                {formError && <p className = "error"> {formError} </p>}

            </form>
        </div>
    )
};

export default CreatePost;