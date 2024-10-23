import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../Context/UseAuth';
import { jwtDecode } from "jwt-decode";

type Props = { children: React.ReactNode }

const ProtectedRoute = ({children}: Props) => {
    const location = useLocation();
    
    const isAdmin = () => {
      const token = sessionStorage.getItem("token");
      if(token){
          const role = Object.entries(jwtDecode(token))[0][1];
          return role === 'ADMIN';
      }
      return false;
      
  };

  const isLoggedIn = () => {
    const userId = sessionStorage.getItem("user");
    return !!userId;
};
    


  return isLoggedIn() && isAdmin() ? (
    <>{children}</> ) 
    : 
    (
        <Navigate to="/" state={{ from: location }} replace />
    );
};

export default ProtectedRoute;