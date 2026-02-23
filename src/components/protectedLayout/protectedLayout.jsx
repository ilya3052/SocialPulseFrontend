import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { verifyAndRefreshToken } from "../../utils/utils.js";

export default function ProtectedLayout() {
    const [checking, setChecking] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        let aborted = false;

        const checkAuth = async () => {
            const isValid = await verifyAndRefreshToken();
            if (!aborted) {
                setIsAuth(isValid);
                setChecking(false);
            }
        };

        checkAuth();

        return () => {
            aborted = true;
        };
    }, []);

    if (checking) {
        return <div>Проверка авторизации...</div>;
    }

    if (!isAuth) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}