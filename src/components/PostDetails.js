// CSS
import styles from "./PostDetails.module.css";

// elements 
import {Link} from "react-router-dom";

const PostDetails = ({dados}) => {
    return (
        <div className = {styles.post_details}>
            <img src = {dados.image} alt = {dados.title} />
            <h2> {dados.title} </h2>
            <p className = {styles.createdby}> {dados.createdBy} </p>

            <div className = {styles.tags}>
                {dados.tagsArray.map((tag) => (
                    <p key = {tag}> <span>#</span> {tag} </p>
                ))}
            </div>

            <Link to = {`/posts/${dados.id}`} className = "btn btn-outline"> Ler </Link>        

        </div>
    )
};

export default PostDetails;