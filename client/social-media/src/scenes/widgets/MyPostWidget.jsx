//Este componente es la seccion de crear un post
//Monton de iconos para nuestra seccion de crear un post
import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "../../components/UserImage";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state";

const MyPostWidget = ({ picturePath }) => { //eslint-disable-line
  const dispatch = useDispatch();
	//Estado que representa si hay una imagen cargada en 
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
	//Representa el post que estamos creando
  const [post, setPost] = useState("");
	//La paleta de colores
  const { palette } = useTheme();
	//Nos traemos el id  del usuario global
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
	//Medidas del tamano de la pantalla
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  const handlePost = async () => {
		//formData es la informacion del value
    const formData = new FormData();
    formData.append("userId", _id);
    formData.append("description", post);
    if (image) {
      formData.append("picture", image);
      formData.append("picturePath", image.name);
    }

//Ruta del backend que crea los posts
    const response = await fetch(`http://localhost:3001/posts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const posts = await response.json();
    dispatch(setPosts({ posts }));
		console.log(posts)
    setImage(null);
    setPost("");
  };

	return(
		<WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage image={picturePath} />
        <InputBase
				// Aqui el input donde escribiremos nuestro post
          placeholder="What's on your mind..."
          onChange={(e) => setPost(e.target.value)}
          value={post}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
        />
      </FlexBetween>
			{/* Esto hace que si hay una imagen se abra el recuadro para adjuntar imagenes, si queremos que alla una imagen hay que clickear en la opcion de imagen entonces torna isImage en true habilitando el siguiente recuadro de html para adjuantar imagenes  */}
      {isImage && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}
            onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!image ? (
                    <p>Add Image Here</p>
                  ) : (
                    <FlexBetween>
                      <Typography>{image.name}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {image && (
                  <IconButton
									// este onclick ejecuta el borrado de la imgen que estamos cargando  seteando setImage en null
                    onClick={() => setImage(null)}
                    sx={{ width: "15%" }}
                  >
										{/* El icono de borrar la ima gen en el widget */}
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      <Divider sx={{ margin: "1.25rem 0" }} />

      <FlexBetween>
				{/* Si le damos click a este icono permitimos la opcion de agregar imagenes tornamos por dentro setIsImage a true y se abre el recuadro para agregar imagenes */}
        <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Image
          </Typography>
        </FlexBetween>
				{/* Aqui se habilita la opcion de panatalas responsives haciendo que i estamos en una pantalla mas pequena los de mas iconos se vean como tres puntittos ... */}
        {isNonMobileScreens ? (
          <>
						{/* Este es el icnon para agregar videos por ahora sin funcionalidad */}
            <FlexBetween gap="0.25rem">
              <GifBoxOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Clip</Typography>
            </FlexBetween>
            {/* este es el para agregar archivos por ahora sin funcioalidad */}
            <FlexBetween gap="0.25rem">
              <AttachFileOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Attachment</Typography>
            </FlexBetween>
						{/* Opcion para agregar audios por ahora sin funcionalidad */}
            <FlexBetween gap="0.25rem">
              <MicOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Audio</Typography>
            </FlexBetween>
          </>
					// Aqui termina la vista de elementos que se muestran si la pantalla es del tamano de pc
        ) : (
          <FlexBetween gap="0.25rem">
            <MoreHorizOutlined sx={{ color: mediumMain }} />
          </FlexBetween>
        )}
					{/* /Boton para postear si no hay ningun post bloquea el boton */}
        <Button
          disabled={!post}
          onClick={handlePost}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
          }}
        >
          POST
        </Button>
      </FlexBetween>
    </WidgetWrapper>
	)
}

export default MyPostWidget;