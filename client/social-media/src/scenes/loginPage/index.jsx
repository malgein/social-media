import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
//importamos en formulario de login como tal
import Form from "./Form";

const LoginPage = () => {
	//importamos el useTheme que nos trae el tema e ocuro/claro usando material ui
  const theme = useTheme();
	//Determina el tamano de la pantalla para establecer ciertas reglas de css
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  return (
    <Box>
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          Social-media
        </Typography>
      </Box>

      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
          Welcome to Social-media a social app with great features made by malgein 
        </Typography>
				{/* Aqui va insertado el componente de form que np es mas que el formulario per se de login, con laas validaciones y campos par qiue usuario introduzca su informgacion de aceeso a la app */}
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;