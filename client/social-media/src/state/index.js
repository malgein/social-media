import { createSlice } from "@reduxjs/toolkit";

//Estados globales
const initialState = {
	//modo luminoso/oscuro
  mode: "light",
	//deberia representar el usuario que esta logeado coomo el user del context
  user: null,
	//representa en token de acceso del usuario deberia ser proporcionado por la llamada al endpoint
  token: null,
	//representa los posts
  posts: [],
};

//forma de redux toolkit de administrar las acciones del estado global mezcla las actions y los reducers en un solo archivo dentro de una funcion que cotiene objetos donde cda uno tiene como valo una funcion anonima que modifica cada estado global (user, posts, token, mode , etc)
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
		//el set mode mofifica el state mode cambiandolo si esta en claro lo modifica en oscuro si no lo modifica en claro
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
		//el setLogout modifica el estado de login del user eliminando su estado de logged a deslogeado eliminando el token y los datos del usuario del estado global
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
  },
});

//finalmente exportamos todas las "actions" como se haria en un actions.jsde redux tradicional  y tambien exportamos por defecto el authSlice la funcion contenedora que contiene todos lo actions
export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost } =
  authSlice.actions;
export default authSlice.reducer;