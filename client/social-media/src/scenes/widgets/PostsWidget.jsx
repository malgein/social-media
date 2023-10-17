//Este componente consiste en mostrar todos los posts de los usuarios sean amigos o no

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }) => { // eslint-disable-line 
	const dispatch = useDispatch();
	//Trae los esl estado global posts
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

	//Esta funcion llama al endpoint del backend que muestra todos los posts de la red social
	//Se carga al principio del componente si no hay unn  usuario logeado
	const getPosts = async () => {
    const response = await fetch("http://localhost:3001/posts", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

	//Este metodo llama al backend y trae todos los posts de; usuario en espefico con el id
  const getUserPosts = async () => {
    const response = await fetch(
      `http://localhost:3001/posts/${userId}/posts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

	useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

	return(
		<>
		{posts.map(
			({
				_id,
				userId,
				firstName,
				lastName,
				description,
				location,
				picturePath,
				userPicturePath,
				likes,
				comments,
			}) => (
				// Renderiza el componente pasandole por props  los elementos desestructurados de los posts del estado global que al mismo tiempo son los posts de la base de datos
				<PostWidget
					key={_id}
					postId={_id}
					postUserId={userId}
					name={`${firstName} ${lastName}`}
					description={description}
					location={location}
					picturePath={picturePath}
					userPicturePath={userPicturePath}
					likes={likes}
					comments={comments}
				/>
			)
		)}
	</>
	)
}

export default PostsWidget