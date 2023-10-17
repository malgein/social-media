//Representa el rcuadro de amigos de nuestra app donde podremos ver nuestros amigos y agregar/remover amigos

import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "../state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

const Friend = ({ friendId, name, subtitle, userPicturePath }) => {  // eslint-disable-line 
  const dispatch = useDispatch();
  const navigate = useNavigate();
	//Extrae el solo el id del usuario
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
	//Nos trae los amigos de friends del estado global
  const friends = useSelector((state) => state.user.friends);

	//Colores paltea de colores
  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

	//Constante que guarda un bolleano de acuerdo a si hay amigos o no
  const isFriend = friends.find((friend) => friend._id === friendId);

	//Handle que agrega/elimina amigos
  const patchFriend = async () => {
		// Este endpoint del backend retira/agrega amigos dependiendo si lo tengo agregado o no
    const response = await fetch(
      `http://localhost:3001/users/${_id}/${friendId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
		
    const data = await response.json();
		//Actualiza la lista de amigos y los guarda en el estado global
    dispatch(setFriends({ friends: data }));
  };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
				{/* Si le damos click a este recuadro  iremos al profile del usuario, este recuadro contiene el nombre del amigo del usuario y al darle click vamos a su perfil*/}
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0);
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
						{/* Nombre del amigo que es un suario */}
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
			{/* Aqui va tag que enciarra el icno de agregar/eliminar amigo */}
			{_id !== friendId && (
				<IconButton
				//!Aqui llamamos la funcion de agregar/eliminar amigo que dentro llama al endpoint del backend que agrega/elimina amigo 
					onClick={() => patchFriend()}
					sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
				>
					{/* El icono cambia dependiendo de si es amigo de nosotros o no para agreagrar/eliminar amigo */}
					{isFriend ? (
						<PersonRemoveOutlined sx={{ color: primaryDark }} />
					) : (
						<PersonAddOutlined sx={{ color: primaryDark }} />
					)}
				</IconButton>
			)}
			{/* {	console.log(_id)} */}
      
    </FlexBetween>
  );
};

export default Friend;