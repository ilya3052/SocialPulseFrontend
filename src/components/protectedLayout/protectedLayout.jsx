import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {sendForDebug} from "../../utils/utils.js";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;

export default function ProtectedLayout() {
    const [checking, setChecking] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {

        let aborted = false;

        async function verifyAndRefresh() {
            const access = localStorage.getItem('access_token');
            const refresh = localStorage.getItem('refresh_token');

            if (!access || !refresh) {
                if (!aborted) {
                    setChecking(false);
                    setIsAuth(false);
                }
                return;
            }

            try {
                const verifyAccessRes = await fetch(`${BASE_URL}/${API_VERSION}/accounts/token/verify/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: access }),
                });

                if (verifyAccessRes.ok) {
                    if (!aborted) {
                        setIsAuth(true);
                        return;
                    }
                }

                const verifyRefreshRes = await fetch(`${BASE_URL}/${API_VERSION}/accounts/token/verify/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: refresh }),
                });

                if (!verifyRefreshRes.ok) {
                    if (!aborted) {
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        setIsAuth(false);
                    }

                    return;
                }

                const refreshRes = await fetch(`${BASE_URL}/${API_VERSION}/accounts/token/refresh/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${refresh}` },
                    body: JSON.stringify({ refresh: refresh }),
                });

                if (!refreshRes.ok) {
                    throw new Error('Refresh token request failed');
                }

                // Важно: await для распарсивания JSON
                const data = await refreshRes.json();
                const newAccess = data.access;
                if (!newAccess) {
                    throw new Error('No access token in refresh response');
                }
                localStorage.setItem('access_token', newAccess);
                if (!aborted) {
                    setIsAuth(true);
                }

            } catch (err) {
                await sendForDebug(err);
                localStorage.clear();
                if (!aborted) {
                    setIsAuth(false);
                }
            } finally {
                if (!aborted) {
                    setChecking(false);
                }
            }
        }

        verifyAndRefresh();

        return () => {
            aborted = true;
        };
    }, []);

    if (checking) {
        return <div>Проверка авторизации...</div>; // ← спиннер, скелетон, etc.
    }

    if (!isAuth) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}