import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
//yu lo usamos para las validaciones
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state";
import Dropzone from "react-dropzone";
import FlexBetween from "../../components/FlexBetween";
import Swal from 'sweetalert2'

//Nos aseguramos de que el usuario introduzca cierta informacion
const registerSchema = yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required"),
    location: yup.string().required("required"),
    occupation: yup.string().required("required"),
    picture: yup.string().required("required"),
  });
  
	//Noss aseguramos de que el usuario introduzca cierta informacion en el login
  const loginSchema = yup.object().shape({
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required"),
  });

	//Los valores iniciales en el formulario de registro
  const initialValuesRegister = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    location: "",
    occupation: "",
    picture: "",
  };

//Valores iniciales en el formulario de login
  const initialValuesLogin = {
    email: "",
    password: "",
  };
  
	const Form = () => {

		const [pageType, setPageType] = useState("login");
		const { palette } = useTheme();
		const dispatch = useDispatch();
		const navigate = useNavigate();
		//variable para determinar el tamano de las pantallas estblecemos el valor en 600 px a diferencias de otrS confuguraciones responsives por el hecho de ser un formulario
		const isNonMobile = useMediaQuery("(min-width:600px)");
		//Si esta logeado el usuario
		const isLogin = pageType === "login";
		//Si esta registrado el usuario
		const isRegister = pageType === "register";
	
    //Funcion que hace posible el registro del usuario mediante una llamada al endpoint
    const register = async (values, onSubmitProps) => {
      // this allows us to send form info with image
      //Hacemos en loop para enviar las imagenes a traves de un request body al backend esta es una forma de hacer eso
      //creo que formData es  una propiedad de material ui para guardar data de los inputs
      const formData = new FormData();
      for (let value in values) {
        //En este caso formdata tendra el valor de los inputs
        formData.append(value, values[value]);
      }
      //Despues del loop guardaremos el archivo en nuestra carpeta local de assets a traves del nombre eso es lo que hacee esta linea de codigo
      //Y aqui formData tendra el valor de las pictures de los archivos
      formData.append("picturePath", values.picture.name);
      //Endpoint  del backend que se encarga del registro de usuarios
      const savedUserResponse = await fetch(
        "http://localhost:3001/auth/register",
        {
          method: "POST",
          //Aqui le pasamos el valor de los inputs icluyendo los archivos para registrar el usuario en el backend y en la bd
          body: formData,
        }
      );
      //Aqui convertimos la constante 
      const savedUser = await savedUserResponse.json();
      Swal.fire(
        'Registro de usuario exitoso!',
        '',
        'success'
      )
      onSubmitProps.resetForm();
  
      if (savedUser) {
        setPageType("login");
      }
    };
  
    //funcion que hace posible el loggin del usuario mediante una llamada al endpoint
    const login = async (values, onSubmitProps) => {
      const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const loggedIn = await loggedInResponse.json();
      onSubmitProps.resetForm();
      console.log(loggedIn)
      if(loggedIn.msg === 'Invalid credentials. '){
        Swal.fire(
          'Invalid password',
          '',
          'error'
        )
      } else if(loggedIn.msg === 'User does not exist. '){
        Swal.fire(
          'This email is not registered',
          '',
          'error'
        )
      } else if (loggedIn) {
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
          })
        );
        Swal.fire(
          'Login successfully',
          '',
          'success'
        )
        navigate("/home");
      }
    };
  
    //Esto nos va a permitir enviar la informacion con la imagen
    const handleFormSubmit = async (values, onSubmitProps) => {
      if (isLogin) await login(values, onSubmitProps);
      if (isRegister) await register(values, onSubmitProps);
    };
	

    return(
			<Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        // establece el valor del campo lo usaremos para setear el valor de picture al archivo que subamos
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {/* Todo este jsx esta establecido si no estamos registrando recordemos que este input renderiza condicionalmente de acuerdo a si estamos haciendo login o si nos estamos registrando  */}
            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />
                {/* Aqui va el input con el campo de apellido del usuario */}
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
                {/* Aqui va el input con el campo de localizacion del usuario */}
                <TextField
                  label="Location"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.location}
                  name="location"
                  error={Boolean(touched.location) && Boolean(errors.location)}
                  helperText={touched.location && errors.location}
                  sx={{ gridColumn: "span 4" }}
                />
                {/* Aqui va el input con el campo de ocupacion del usuario */}
                <TextField
                  label="Occupation"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.occupation}
                  name="occupation"
                  error={
                    Boolean(touched.occupation) && Boolean(errors.occupation)
                  }
                  helperText={touched.occupation && errors.occupation}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                label="LinkedIn"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.linkedInProfile}
                name="linkedInProfile"
                error={Boolean(touched.linkedInProfile) && Boolean(errors.linkedInProfile)}
                helperText={touched.linkedInProfile && errors.linkedInProfile}
                sx={{ gridColumn: "span 4" }}
                />
                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  {/* Recuadro para cargar archivos adjuntos coomo la imagen de perfil */}
                  <Dropzone
                  // se colocan los formtatos que admite los archivois adjuntos
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    // Hace que setFieldValue establezca el valor de picture del initial value al valor del archivo adjunto que agreguemos
                    onDrop={(acceptedFiles) =>
                      setFieldValue("picture", acceptedFiles[0])
                    }
                  >
                    {/* Dentro de esta sintaxis rara eesta el estilizado de la casilla para adjuntar archivos, notese que hay un hover y un placeholder de arroja tus archivos aqui */}
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {/* Aqui va el placeholder del recuadro para adjuntar archivos */}
                        {!values.picture ? (
                          <p>Add Picture Here</p>
                        ) : (
                          <FlexBetween>
                            {/* Aqui se ve el nombre del archivo cuando lo adjuntamos */}
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
              </>
            )}
            {/* Esta porcion de jsx se renderizara cuando cuando nos logeemos notese que contiene los campos para email y password y mas abajo botones de login */}
            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password"
              // esconde el valor que introduzcmos en dicho input
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              // Setea los errores del password
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>

          {/* BUTTONS */}
          {/* Reutilizacion de botones los botones estan renderizado muy inteligentemente para enviar el contenido del formulario ya sea de registro o de login no importa , lo unico que cambia es que si nos estamos logeando se renderizara condicionalmente el nombre de login para el boton y de register si nos estamos registrando */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              {isLogin ? "LOGIN" : "REGISTER"}
            </Button>
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {/* Al igual que renderizar el nombre de los botones que envia el formulario tenemos tambien el renderizado condicional de las opciones de logearse si tienes una cuenta o registrarse si no tienes una */}
              {isLogin
                ? "Don't have an account? Sign Up here."
                : "Already have an account? Login here."}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
		)
	}

	export default Form