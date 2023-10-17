import { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
} from "@mui/material";
//!Importante entender que el modo claro/oscuro lo hace posible en esta aplicacion material ui
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "../../state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "../../components/FlexBetween";

const Navbar = () => {
	//Estado para desplegar o guardar el menu de responsibe en la navbar
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
	//Accedemos al estado global user
  const user = useSelector((state) => state.user);
	//variable que determina el tamano de la pantalla para dispositivos responsives mediante un elemento useMediaQuery de material ui
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme();
	//variable donde guardamos los colores claros del modo claro
  const neutralLight = theme.palette.neutral.light;
	//variable donde guardamos los colores oscuros del modo oscuro
  const dark = theme.palette.neutral.dark;
	//variale que guarda los colores por defectto
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

	//variable que guarda el primer y segundo nombre del usuario logeado
  const fullName = user ? `${user.firstName} ${user.lastName}` : '';


	//Casi todo el  return del componente condiciona y alterna una vista responsiva con la aparicion del menu de navbar de responsive dependiendo de la query de isNommobilescreen que determina el tamano de la pantalla con la participacion de setTogleMenu para la apertura/cierre de dicho menu responsive
  return (
		// el Componente principal sera un flex, ya viene estilisado con unasreglas de css
    <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      <FlexBetween gap="1.75rem">
				{/*  tag que contiene en el nav el nombre de la app y que al ahcer click dirige a la home junto con las letras del nombre de la app y un efecto hover al ponerse sobre ella*/}
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="primary"
          onClick={() => navigate("/home")}
          sx={{
            "&:hover": {
              color: primaryLight,
              cursor: "pointer",
            },
          }}
        >
          Social Media
        </Typography>
				{/*  Si el ancho de la pantalla mediante el query de material determina que no es el de movil muestra  la interfaz de una manera para dispositivios de escritorio*/}
        {isNonMobileScreens && (
					//Contiene la franja gris del input, practicamente contiene todo el input menos el placeholder y el icono de search que estan dentro 
          <FlexBetween
            backgroundColor={neutralLight}
            borderRadius="9px"
            gap="3rem"
            padding="0.1rem 1.5rem"
          >

            <InputBase placeholder="Search..." />
            <IconButton>
							{/* Icono de busqueda traido material ui para el input de busqueda*/}
              <Search />
            </IconButton>
          </FlexBetween>
        )}
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
					{/* Al hacer click aqui cambiamos del modo oscuro al modo claro y viceversa */}
					{/* El setMode es lo que esta cambiando el modo claro/oscuro de la app  */}
          <IconButton onClick={() => dispatch(setMode())}>
						{/* <DarkMode/>  y <LightMode/> solo son los iconos del modo claro y oscuro no cambian como tal a ese modo la app eso lo hace el action global setMode()*/}
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>
					{/* Este es el icono de mensaje en la aplicacion pienso usarla para iniciar un chat con los demas usuarios que tengas como amigos */}
          <Message sx={{ fontSize: "25px" }} />
					{/* Este es el icono de notificaciones pieso usar socket io al igual que en los mensajes para que parescan notificaciones cuando un amigo suba un post nuevo , le de like a una publicacion tuya o comente una publicacion*/}
          <Notifications sx={{ fontSize: "25px" }} />
					{/* Icono de ayuda, no tengo ni idea de que funcionalidad voy a colocar aqui pero algo se me ocurrira */}
          <Help sx={{ fontSize: "25px" }} />
          <FormControl variant="standard" value={fullName}>
						{/* Modal que abre una ventana con el nombre completo del usuario, y la opcion de deslogeo pienso colocar una opcion para settings o un dashboard de opciones de usuario */}
            <Select
              value={fullName}
              sx={{
                backgroundColor: neutralLight,
                width: "150px",
                borderRadius: "0.25rem",
                p: "0.25rem 1rem",
                "& .MuiSvgIcon-root": {
                  pr: "0.25rem",
                  width: "3rem",
                },
                "& .MuiSelect-select:focus": {
                  backgroundColor: neutralLight,
                },
              }}
              input={<InputBase />}
            >
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>
							{/* Aqui llamamos a la action global de redux que deslogea al usuario  se encuantra dentro del modal*/}
              <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
            </Select>
          </FormControl>
        </FlexBetween>
      ) : (
				// Aqui aperturamos/cerramos el menu de navbar que solo se muestra en dispositivos moviles por su diseno de responsive
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu />
        </IconButton>
      )}

      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}
        >
          {/* CLOSE ICON */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem"
          >
            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: "25px" }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>
            <Message sx={{ fontSize: "25px" }} />
            <Notifications sx={{ fontSize: "25px" }} />
            <Help sx={{ fontSize: "25px" }} />
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Log Out
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;