import { createContext, useContext, useEffect, useState } from "react";
import {API_VERSION, BASE_URL} from "../utils/utils.js";

// создаём контекст
export const UserContext = createContext(null);
export const UserLoadingContext = createContext(true);

// удобные хуки
export const useUser = () => useContext(UserContext);
export const useUserLoading = () => useContext(UserLoadingContext);

// провайдер
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        let isMounted = true; // Флаг для отслеживания, смонтирован ли компонент
        const controller = new AbortController(); // Для отмены запроса

        const fetchUser = async () => {
            try {
                let token = localStorage.getItem("access_token");
                if (!token) {
                    if (isMounted) {
                        setUser(null);
                        setLoading(false);
                    }
                    return;
                }
                const res = await fetch(`${BASE_URL}/${API_VERSION}/accounts/users/me/`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    signal: controller.signal,
                });

                if (!isMounted) return; // Отменяем обновление, если компонент размонтирован

                if (!res.ok) {
                    console.log(res.text())
                    setUser(null);
                    setLoading(false);
                    return;
                }

                const data = await res.json();
                console.log('data: ', data);
                if (isMounted) {
                    setUser(data.data);
                    setLoading(false);
                }
            } catch (error) {
                if (error.name !== 'AbortError' && isMounted) {
                    console.error('Failed to fetch user:', error);
                    setUser(null);
                    setLoading(false);
                }
            }
        };

        fetchUser();

        // Cleanup функция для отмены обновлений и запроса при размонтировании
        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    return (
        <UserLoadingContext.Provider value={loading}>
            <UserContext.Provider value={user}>
                {children}
            </UserContext.Provider>
        </UserLoadingContext.Provider>
    );
};