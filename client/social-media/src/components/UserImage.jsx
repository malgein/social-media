import { Box } from "@mui/material";

//Componnete de estilo que represneta el avatar del usuario

const UserImage = ({ image, size = "60px" }) => {
  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
				// busca la imagen en assets de la app hay que cambiarlo para que almacene los archivos en en una app
        src={`http://localhost:3001/assets/${image}`}
      />
    </Box>
  );
};

export default UserImage;