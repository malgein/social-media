/* eslint-disable react/prop-types */
import {
    ChatBubbleOutlineOutlined,
    FavoriteBorderOutlined,
    FavoriteOutlined,
    ShareOutlined,
  } from "@mui/icons-material";
  import { Box, Divider, IconButton, Typography, useTheme, InputBase, Button} from "@mui/material";
  import FlexBetween from "../../components/FlexBetween";
  import Friend from "../../components/Friend";
  import WidgetWrapper from "../../components/WidgetWrapper";
  import { useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { setPost } from "../../state";

  const PostWidget = ({ postId, postUserId, name, description, location, picturePath, userPicturePath, likes, comments,}) => { //eslint-disable-line

		//Estado local que determina si va a mostrar los comentarios o no 
		const [isComments, setIsComments] = useState(false);
		const [myComment , setMyComment] = useState('')
		const dispatch = useDispatch();
		const token = useSelector((state) => state.token);
		//Representa el id del usuario que esta logeado
		const loggedInUserId = useSelector((state) => state.user._id);
		//Determina si el current user le dio like o  no al post
		const isLiked = Boolean(likes[loggedInUserId]);
		//Lleva el conteno de likes de los posts
		const likeCount = Object.keys(likes).length;
	
		const { palette } = useTheme();
		const main = palette.neutral.main;
		const primary = palette.primary.main;

		//funcion que modifica el numero de likes de unpost mediante una llamada al backend
		const patchLike = async () => {
			// endpoint que modifica el post y le da like o quita el like del post
			const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ userId: loggedInUserId }),
			});
			const updatedPost = await response.json();
			//Establece el valor del resultado del endpoint que deberia ser el post con sus likes actualizados para pasarselos al estado global de posts
			dispatch(setPost({ post: updatedPost }));
		};

		const createComment = async(input) => {
			console.log(input)
			
			const response = await fetch(`http://localhost:3001/posts/${postId}/${loggedInUserId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({text: input})
			});
			const updatedPost = await response.json();
			//Establece el valor del resultado del endpoint que deberia ser el post con sus likes actualizados para pasarselos al estado global de posts
			dispatch(setPost({ post: updatedPost }));
			setMyComment('')
		}
	

    return(
      <WidgetWrapper m="2rem 0">
				{/* llamamos al widget de amigos es decir al recuadro de friends le pasamos los props que pide de nombre, localizacion, postUserId y el userPicturePath para la imagen*/}
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
			{/* descrupion del post que se recibe por prop aqui va la descripcion */}
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
			{/* Si esxiste picturePath quiere decir que el post viene con imagen por eso se renderiza una tag de img */}
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
					// Busca en la  arpeta de la aplicacion en pulblc los archivos de las imagnes que se guardan hay que modificarlo para usar un servicio de la nube y que busque ahi el elemento que queremos mostrar en el post
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
						{/* Icono y boton de like  que denpendiedo del estado local isLiked sea true o false  cambia el icno del corazon de un corazon gris a un corazon rojo */}
						{/* llama a la funcuonque hace la llamada al backend oara quitar/dar like */}
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
						{/* Conteo de likes  */}
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
						{/* Al presionar este boton se muestran o no los comentarios y el input de escribir comentarios mediante el boolean de un estado de comentarios */}
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
						{/* conteo de comentarios */}
            <Typography>{comments.length}</Typography> 
          </FlexBetween>
        </FlexBetween>
        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>

      {isComments && (
        <Box mt="0.5rem">
					{/* Si existe es estado local de que se tienen que mostrar los comentarios del post mapaenado y mostrandolo uno por uno */}
					<FlexBetween>
						<InputBase
						// Aqui el input donde escribiremos nuestro post
						// placeholder="What's on your mind..."
						onChange={(e) => setMyComment(e.target.value)}
						sx={{
							width: "100%",
							// backgroundColor: palette.neutral.light,
							// borderRadius: "2rem",
							// padding: "1rem 2rem",
						}}
						value={myComment}
						/>
						<Button
							onClick={() => createComment(myComment)}
							disabled={!myComment}
						>Comment</Button>
					</FlexBetween>
          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                {comment.text}
								{comment.userId === loggedInUserId && (
									<Button
									onClick={() => createComment(myComment)}
									>Edit</Button>
								)}
              </Typography>
            </Box>
          ))}
          <Divider />
        </Box>
      )}
    </WidgetWrapper>
    )
  }  

	export default PostWidget

