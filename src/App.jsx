import React from "react"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import PublicRoutes from "./routes/PublicRoutes";
import ProtectedRoutes from "./routes/ProtectedRoutes";


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicRoutes><LoginPage/></PublicRoutes> } />
        <Route path="/register" element={<PublicRoutes><RegisterPage/></PublicRoutes> } />
        <Route path="/home" element={<ProtectedRoutes><HomePage/></ProtectedRoutes>} />
      </Routes>
    </Router>
  )
}

export default App
