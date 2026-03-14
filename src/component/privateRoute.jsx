import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";


export const PrivateRoute = ({ children }) => {
   const auth = useSelector((state) => state.auth);
   const token = auth?.token;

  return token ? children : <Navigate to={"/login"}/>;
 

  


};
