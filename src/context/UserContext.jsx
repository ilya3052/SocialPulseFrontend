import { createContext, useContext, useEffect, useState } from "react";
import { API_VERSION, BASE_URL } from "../utils/utils.js";

export const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        setLoading(true);

        try {
            const token = localStorage.getItem("access_token");

            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            const res = await fetch(`${BASE_URL}/${API_VERSION}/users/me/`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                setUser(null);
                setLoading(false);
                return;
            }

            const data = await res.json();
            setUser(data.data);

        } catch (e) {
            console.error("Failed to fetch user:", e);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, loading, refetchUser: fetchUser, setUser }}>
            {children}
        </UserContext.Provider>
    );
};