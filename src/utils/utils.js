const sendForDebug = async (debug_message) => {
        await fetch('/api/v2/accounts/debug/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                debug_message: debug_message,
            }),
        });
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;

/**
 * Проверяет валидность переданного токена через API
 * @param {string} token - токен для проверки
 * @returns {Promise<boolean>} true если токен валиден, false если невалиден или ошибка
 */
const _verifyToken = async (token) => {
    try {
        const response = await fetch(`${BASE_URL}/${API_VERSION}/accounts/token/verify/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
        });
        return response.ok;
    } catch (err) {
        await sendForDebug(`_verifyToken error: ${err.message}`);
        return false;
    }
};

/**
 * Обновляет access_token используя refresh_token
 * @param {string} refreshToken - refresh токен для обновления
 * @returns {Promise<string | null>} новый access_token или null при ошибке
 */
const _refreshAccessToken = async (refreshToken) => {
    try {
        const response = await fetch(`${BASE_URL}/${API_VERSION}/accounts/token/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${refreshToken}`,
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!response.ok) {
            await sendForDebug(`_refreshAccessToken failed with status ${response.status}`);
            return null;
        }

        const data = await response.json();
        const newAccess = data.access;

        if (!newAccess) {
            await sendForDebug('_refreshAccessToken: no access token in response');
            return null;
        }

        return newAccess;
    } catch (err) {
        await sendForDebug(`_refreshAccessToken error: ${err.message}`);
        return null;
    }
};

/**
 * Удаляет оба токена из localStorage
 */
const _clearAuthTokens = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};

/**
 * Проверяет валидность access_token.
 * Если он невалиден - автоматически обновляет через refresh_token (скрыто).
 * Если оба токена просрочены - очищает localStorage.
 * @returns {Promise<boolean>} true если токены валидны/обновлены, false если нужно на логин
 */
const verifyAndRefreshToken = async () => {
    try {
        const access = localStorage.getItem('access_token');
        const refresh = localStorage.getItem('refresh_token');

        // Если нет токенов вообще
        if (!access || !refresh) {
            return false;
        }

        // Шаг 1: Проверить access_token
        const accessIsValid = await _verifyToken(access);
        if (accessIsValid) {
            return true; // Access токен ещё валиден
        }

        // Шаг 2: Access невалиден, проверить refresh_token
        const refreshIsValid = await _verifyToken(refresh);
        if (!refreshIsValid) {
            // Оба токена невалидны, очищаем
            _clearAuthTokens();
            return false;
        }

        // Шаг 3: Refresh валиден, пытаемся обновить access
        const newAccess = await _refreshAccessToken(refresh);
        if (!newAccess) {
            // Ошибка при обновлении, очищаем
            _clearAuthTokens();
            return false;
        }

        // Шаг 4: Успешно обновили access_token
        localStorage.setItem('access_token', newAccess);
        return true;

    } catch (err) {
        await sendForDebug(`verifyAndRefreshToken error: ${err.message}`);
        _clearAuthTokens();
        return false;
    }
};

const logout = async (navigate) => {
    const res = await fetch(`${BASE_URL}/${API_VERSION}/accounts/token/blacklist/`, {
        method: "POST" ,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: localStorage.getItem("refresh_token") }),
    });
    if (res.ok) {
        localStorage.clear();
    }
    else if (res.status === 400) {
        const err = await res.text();
        await sendForDebug(err);
    }
    navigate('/login');
}

export { sendForDebug, BASE_URL, API_VERSION, verifyAndRefreshToken, logout};
