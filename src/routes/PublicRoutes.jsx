import React from 'react'
import { Navigate } from 'react-router-dom'

const PublicRoutes = ({children}) => {
    const user = localStorage.getItem("user")
    console.log(user);
    
    if (user){
        return <Navigate to={'/home'} replace />
    }
  return children
}

export default PublicRoutes
