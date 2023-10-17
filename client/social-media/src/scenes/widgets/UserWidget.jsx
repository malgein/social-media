import {
    ManageAccountsOutlined,
    EditOutlined,
    LocationOnOutlined,
    WorkOutlineOutlined,
  } from "@mui/icons-material";
  import { Box, Typography, Divider, useTheme } from "@mui/material";
  import UserImage from "../../components/UserImage";
  import FlexBetween from "../../components/FlexBetween";
  import WidgetWrapper from "../../components/WidgetWrapper";
  import { useSelector } from "react-redux";
  import { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";

	//Este componente es el cuadro con el avatar y la info del usuario logeado

  const UserWidget = ({ userId, picturePath }) => { //eslint-disable-line

    //Usuario que esta logeado
    const [user, setUser] = useState(null);
    const { palette } = useTheme();
    const navigate = useNavigate();
		//Nos traemos el estado global token
    const token = useSelector((state) => state.token);
		//Para configurar el modo claro/oscuro
    const dark = palette.neutral.dark;
    const medium = palette.neutral.medium;
    const main = palette.neutral.main;

		//Llamamos al endpoint de traer un usuario por id
		const getUser = async () => {
			const response = await fetch(`http://localhost:3001/users/${userId}`, {
				method: "GET",
				headers: { Authorization: `Bearer ${token}` },
			});
			const data = await response.json();
			setUser(data);
		};
	
		//Al 
		useEffect(() => {
			getUser();
		}, []); // eslint-disable-line react-hooks/exhaustive-deps
	
		if (!user) {
			return null;
		}
	
		const {
			firstName,
			lastName,
			location,
			occupation,
			viewedProfile,
			impressions,
			friends,
      linkedInProfile
		} = user;

    return(
      <WidgetWrapper>
      {/* FIRST ROW */}
			{/* Dentro va la imagn del usuario que reedirecciona a su perfil */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        onClick={() => navigate(`/profile/${userId}`)}
      >
        <FlexBetween gap="1rem">
					{/* Widget que le pasamos su imagen y tambien recibe su imagen*/}
          <UserImage image={picturePath} />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
							// aqui va nombre y apellido
            >
              {firstName} {lastName}
            </Typography>
						{/* La cantidad de amigos que tiene */}
            <Typography color={medium}>{friends.length} friends</Typography>
          </Box>
        </FlexBetween>
        <ManageAccountsOutlined />
      </FlexBetween>

      <Divider />

      {/* SECOND ROW */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{location}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
					{/* Aqui va la ocupacion del usuario */}
          <Typography color={medium}>{occupation}</Typography>
        </Box>
      </Box>

      <Divider />

      {/* THIRD ROW */}
      <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Who is viewed your profile</Typography>
					{/* Aqui van quienes han visto tu perfil de viewedProfile del user de la base de datos */}
          <Typography color={main} fontWeight="500">
            {viewedProfile}
          </Typography>
        </FlexBetween>
        <FlexBetween>
					{/* Impresiones de los */}
          <Typography color={medium}>Impressions of your post</Typography>
          <Typography color={main} fontWeight="500">
            {impressions}
          </Typography>
        </FlexBetween>
      </Box>

      <Divider />

      {/* FOURTH ROW */}
      <Box p="1rem 0">
        {/* Aqui van las redes sociales de los users */}
        <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
          Social Profiles
        </Typography>

        <FlexBetween gap="1rem" mb="0.5rem">
          <FlexBetween gap="1rem">
            <img src="../assets/twitter.png" alt="twitter" />
            {/* /Ccomo lo sin twitter */}
            <Box>
              <Typography color={main} fontWeight="500">
                Twitter
              </Typography>
              <Typography color={medium}>Social Network</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: main }} />
        </FlexBetween>

        <FlexBetween gap="1rem">
          <a href={linkedInProfile} target='_blank' rel='noreferrer'>
            <FlexBetween gap="1rem">
              <img src="../assets/linkedin.png" alt="linkedin" />
              {/* LinkedIn */}
              <Box>
                <Typography color={main} fontWeight="500">
                  Linkedin
                </Typography>
                <Typography color={medium}>Network Platform</Typography>
              </Box>
            </FlexBetween>
          </a>
          <EditOutlined sx={{ color: main }} />
        </FlexBetween>
      </Box>
    </WidgetWrapper>
    )
  } 

	export default UserWidget;