import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const ProtectedRoute = () => {
    const token = Cookies.get("token"); // Lấy token từ cookie

    console.log("TOKEN: ", token);

    if (!token) {
        toast.info("Bạn chưa đăng nhập");
        return <Navigate to="/auth/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
