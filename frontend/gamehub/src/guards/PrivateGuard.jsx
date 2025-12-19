import { Navigate, Outlet } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";


const PrivateGuard = () => {

    const { token } = useAuthContext();

    return token ? <Outlet /> : <Navigate to="/welcome" replace />;
}

export default PrivateGuard