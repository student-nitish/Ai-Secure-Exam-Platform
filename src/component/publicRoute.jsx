import { Navigate } from "react-router-dom";

import { useSelector } from "react-redux";

export const PublicRoute = ({ children }) => {
  const auth = useSelector((state) => state.auth);
   const token = auth?.token;

  return token ? <Navigate to="/" /> : children;
};

export default PublicRoute;