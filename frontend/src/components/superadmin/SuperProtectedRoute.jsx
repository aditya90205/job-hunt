import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SuperProtectedRoute = ({ children }) => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "superadmin") {
      // pass a flag so Home can avoid immediately redirecting recruiters to their admin dashboard
      navigate("/", { state: { skipRoleRedirect: true } });
    }
  }, [user, navigate]);

  return <>{children}</>;
};

export default SuperProtectedRoute;
