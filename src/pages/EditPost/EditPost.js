// CSS
import styles from "./EditPost.module.css";

// hooks
import {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useFetchDocument} from "../../hooks/useFetchDocument";
import {useUpdateDocument} from "../../hooks/useUpdateDocument";

// context
import {AuthValue} from "../../context/AuthContext.js";

const EditPost = () => {
  const {id} = useParams();
  const {document: post} = useFetchDocument("posts", id);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState([]);  // pois é uma lista de valores
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);

  const {updateDocument, response} = useUpdateDocument("posts");  // pegando valores do hook

  const navigate = useNavigate();

  useEffect(() => {  // preenche os dados do post para nós (viabilizando o início da edição)
    if(post) {
        setTitle(post.title); 
        setBody(post.body);
        setImage(post.image);

        const textTags = post.tagsArray.join(", ") // a tag tem que virar string de novo para podermos mudar ela. O método 'join' faz o oposto do 'split', ele une a cada vírgula e espaço encontrado.
        setTags(textTags);
    }
  }, [post]);

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
    
    const data = {
        title,
        image,
        body,
        tagsArray,
        uid: user.uid,
        createdBy: user.displayName
    }

    updateDocument(id, data);

    // redirect to Dashboard page
    navigate("/Dashboard");

  };

    return (
        <div className = {styles.edit_post}>
            {post && (
             <>
               <h2> Editando post: "{post.title}" </h2>
               <p> Altere os dados do post como desejar </p>

             <form onSubmit = {handlePost}>
                <label> 
                    <span> Título: </span>
                    <input type = "text" name = "title" placeholder = "Adicione um título..." value = {title} onChange = {(e) => setTitle(e.target.value)} required />
                </label>

                <label>
                    <span> URL da Imagem:</span>
                    <input type = "text" name = "image" placeholder = "Insira uma imagem para o seu post" value = {image} onChange = {(e) => setImage(e.target.value)} required />
                </label>

                <p className = {styles.previewTitle}> Preview da imagem atual: </p>  {/* ATENÇÃO */}
                <img className = {styles.image_preview} src = {post.image} alt = {post.title} />

                <label>
                    <span> Conteúdo: </span>
                    <textarea type = "text" name = "body" placeholder = "Conteúdo do post" value = {body} onChange = {(e) => setBody(e.target.value)} required />
                </label>

                <label>
                    <span> Tags: </span>
                    <input type="text" name = "tags" placeholder = "Insira as tags separadas por vírgula" value = {tags} onChange = {(e) => setTags(e.target.value)} />
                </label>

                {!response.loading && (<button className = "btn"> Editar </button>)} {/* vem do response */}
                {response.loading && (<button className = "btn" disabled> Editando... </button>)}

                {response.error && <p className = "error"> {response.error} </p>}  {/* vem do response */}
                {formError && <p className = "error"> {formError} </p>}

             </form>               
            </>
            )}
        </div>
    )
};

export default EditPost;