import axios from "axios";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Global from "../../Global/Global";
import "./Login.css";

const spoty_url = `https://accounts.spotify.com/authorize?client_id=${Global.client_id}&response_type=code&redirect_uri=${Global.redirect_uri}&scope=${Global.scopes}`;

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const spotyCode = urlParams.get("code");
    if (spotyCode) {
      authenticateUser(spotyCode);
    }
  }, [location.search]);

  const authenticateUser = async (spotyCode) => {
    try {
      const searchParams = new URLSearchParams({
        code: spotyCode,
        grant_type: "authorization_code",
        redirect_uri: Global.redirect_uri,
        client_id: Global.client_id,
        client_secret: Global.client_secret,
      });
      const res = await axios.post("https://accounts.spotify.com/api/token", searchParams);
      localStorage.setItem('access_token', res.data.access_token);
      localStorage.setItem('refresh_token', res.data.refresh_token);
      navigate('/music'); 
    } catch (error) {
      console.error('Error al autenticar usuario:', error.response);

      if (error.response && error.response.status === 400) {
        console.log('Error 400: Bad Request');
        
      } else {
        console.error('Error desconocido:', error);
      }
    }
  };

  const login = () => {
    window.location.replace(spoty_url);
  };

  return (
    <div>
      <div className="login-box">
        <h3 style={{ color: 'white' }}>Inicia sesión con tu cuenta de Spotify</h3>
        <button onClick={login} className="btn btn-primary" style={{ backgroundColor: 'green', borderColor: 'green' }}>
          INICIAR SESIÓN
        </button>
      </div>
    </div>
  );
}

export default Login;