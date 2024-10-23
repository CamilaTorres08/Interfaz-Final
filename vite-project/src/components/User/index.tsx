import React, { useEffect,useState } from 'react'
import NavBar  from '../NavBar/NavBar'; 
import { Outlet } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";


function UserRouter ()  {

  const [userName, setUserName] = useState('');

  const [idUser, setIdUser ] = useState<string | null>(null);

  useEffect(() => {
    const id = sessionStorage.getItem("user");
    if (id) {
      setIdUser(id);
      getUserTask();
    }
  }, [idUser]);

  const getUserTask = async () => {
    const token = sessionStorage.getItem("token");
    if(idUser && token) {
      const username = Object.entries(jwtDecode(token))[1][1];
      setUserName(username);
    }   
  };
  

  return (
    <>
      <NavBar username={userName} />
      <Outlet  />
    </>
  )
}

export default UserRouter