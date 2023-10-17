import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import HomePage from './scenes/homePage'
import ProfilePage from './scenes/profilePage'
import LoginPage from './scenes/loginPage'
//hook de react que sera escencial en el modo oscuro/claro de la app
import { useMemo } from "react";
//Traeremos el estado global mode de redux para modificarlo
import { useSelector} from "react-redux";
//Necesario traer de material ui
import { CssBaseline, ThemeProvider } from "@mui/material";
//Necesario  de material ui para el modo claro/oscuro 
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";


function App() {

  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

 

  return (
    <div className='App'>
      <BrowserRouter>
      {/* Aqui guardamos todos los estilos de los temas claro/oscuro lo programamos tipo provider para que se establescan a lo largo de toda la app */}
        <ThemeProvider theme={theme}>
          {/* Necesario  de material ui para el modo claro/oscuro*/}
          <CssBaseline />
          <Routes>
          <Route
          //Proteccion de rutas, privamos el acceso a rutas protegidas agregando un condicional si isAuth es true pasa el componente si no reedirecciona a register
              path="/home"
              element={isAuth ? <HomePage /> : <Navigate to="/" />}
            />
            <Route
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
            />

            <Route path="/" element={<LoginPage />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
