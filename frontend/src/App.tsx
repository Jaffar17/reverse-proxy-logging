import React from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import {AuthContext} from "./context/auth-context.tsx";
import DashboardPage from "./pages/dashboard-page.tsx";
import LoginPage from "./pages/login-page.tsx";

export default function App() {
    const auth = React.useContext(AuthContext);

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route
                path="/dashboard"
                element={
                    auth?.token ?
                        <DashboardPage/>
                        : <Navigate to="/login" replace/>
                }
            />
        </Routes>
    );
}