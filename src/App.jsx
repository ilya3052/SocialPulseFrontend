import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
import EmailActivate from './pages/EmailActivate.jsx';
import LoginForm from './components/login/Login.jsx';
import Profile from './components/profile/Profile.jsx';
import * as VKID from '@vkid/sdk';

import RegistrationForm from "./components/registration/Registration.jsx";
import ProtectedLayout from "./components/protectedLayout/protectedLayout.jsx";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/registration" element={<RegistrationForm />} />
                <Route path="/login" element={<LoginForm />}/>

                <Route element={<ProtectedLayout/>}>
                    <Route path="/" element={<Profile />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>

            </Routes>
        </Router>
    )
}

export default App;

// function App() {
//     const [inputValue, setInputValue] = useState('');
//     const [loading, setLoading] = useState(false);
//
//     // Предполагаемый URL для привязки — при необходимости замените на нужный
//     const BIND_URL = '';
//
//     // Если текущий путь - страница активации email, показываем отдельный компонент
//     if (typeof window !== 'undefined' && window.location.pathname === '/email/activate') {
//         return <EmailActivate />;
//     }
//
//     const sendForDebug = async (elem) => {
//         await fetch('/api/v1/accounts/debug/', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 elem: elem,
//             }),
//         });
//     }
//
//     useEffect(() => {
//         localStorage.setItem('access_token', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzcwODIwNzM0LCJpYXQiOjE3NzA4MTg5MzQsImp0aSI6IjFmYTcyN2E3NWZiMTQ3ZDNhNGJlNWVhMzNiNjE2Y2I0IiwidXNlcl9pZCI6IjIifQ.C76ecvBnKtMbEbUIffKEQZaE9QYt0pM5ZX57CFIHVRw");
//     }, []);
//
//
//
//
//
//     useEffect(() => {
//         VKID.Config.init({
//             app: 54438538,
//             redirectUrl: 'https://socialpulse.sandbox.com',
//             source: VKID.ConfigSource.LOWCODE,
//             responseMode: 'callback',
//             scope: 'email phone',
//         });
//         const oneTap = new VKID.OneTap();
//
//         const container = document.getElementById('VkIdSdkOneTap');
//
//         if (container) {
//             oneTap.render({
//                 container: container,
//                 showAlternativeLogin: true,
//                 styles: {
//                     width: 310,
//                     height: 38
//                 }
//             })
//         }
//
//         oneTap.on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, onVKIDSuccess);
//
//         return () => {
//             oneTap.close();
//         };
//     }, []);
//
//     const exchangeCode = async (code, deviceId) => {
//         const tokens = await VKID.Auth.exchangeCode(code, deviceId);
//         localStorage.setItem('vk_access_token', tokens.access_token);
//         localStorage.setItem('vk_refresh_token', tokens.refresh_token);
//         localStorage.setItem('vk_id_token', tokens.id_token);
//         return tokens;
//     }
//
//     const sendExchangedCodes = async (tokens) => {
//         const res = await fetch('/api/v1/accounts/vk/callback/', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 access_token: tokens.access_token,
//                 refresh_token: tokens.refresh_token ?? null,
//                 id_token: tokens.id_token ?? null,
//                 expires_in: tokens.expires_in,
//             }),
//         });
//
//         if (!res.ok) {
//             const errText = await res.text();
//             throw new Error(`Бэкенд: ${res.status} — ${errText}`);
//         }
//
//         const backendData = await res.json();
//
//         const access_token = backendData.request.access_token;
//         const refresh_token = backendData.request.refresh_token;
//         const vk_id = backendData.request.vk_id;
//
//         localStorage.setItem('access_token', access_token);
//         localStorage.setItem('refresh_token', refresh_token);
//         localStorage.setItem('vk_id', vk_id);
//     }
//
//     const bindVK = async (tokens) => {
//         const access_token = localStorage.getItem('access_token');
//
//         const res = await fetch(`/api/v1/accounts/vk/user/`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json' ,
//                 'Authorization': `Bearer ${access_token}`
//             },
//             body: JSON.stringify({
//                 'vk_token': tokens.access_token,
//             })
//
//         })
//         if (!res.ok) {
//             const errText = await res.text();
//             await sendForDebug(errText)
//             return;
//         }
//
//         const data = await res.json();
//         const username = data.username;
//
//         const result = await fetch(`/api/v1/accounts/users/me/`, {
//             method: 'PATCH',
//             headers: {
//                 'Content-Type': 'application/json' ,
//                 'Authorization': `Bearer ${access_token}`
//             },
//             body: JSON.stringify({
//                 "vk_id": tokens.user_id,
//                 "vk_link": `https://vk.ru/${username}`
//             })
//         })
//
//         if (!result.ok) {
//             const errText = await res.text();
//             await sendForDebug(errText)
//         }
//     }
//
//     const onVKIDSuccess = async (payload) => {
//
//         const code = payload.code;
//         const deviceId = payload.device_id;
//
//         if (!code || !deviceId) {
//             console.warn('Нет code или device_id');
//             return;
//         }
//         const tokens = await exchangeCode(code, deviceId);
//
//         await sendExchangedCodes(tokens);
//
//         window.location.replace('https://socialpulse.sandbox.com/profile');
//
//     }
//
//
//
//     const onVKBind = async (payload) => {
//         const code = payload.code;
//         const deviceId = payload.device_id;
//         if (!code || !deviceId) {
//             return;
//         }
//         const tokens = await exchangeCode(code, deviceId);
//         await bindVK(tokens);
//         await sendForDebug(tokens);
//
//     };
//
//     const handleBind = async (e) => {
//         e && e.preventDefault();
//         if (!inputValue) {
//             alert('Пожалуйста, введите значение в поле.');
//             return;
//         }
//         setLoading(true);
//         try {
//             const res = await fetch(BIND_URL, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${inputValue}`
//                 },
//                 body: JSON.stringify({ jwt_token: inputValue })
//             });
//
//             if (!res.ok) {
//                 const txt = await res.text();
//                 throw new Error(`Сервер вернул ошибку ${res.status}: ${txt}`);
//             }
//
//             // Попытаемся прочитать JSON, иначе текст
//             let token = null;
//             const contentType = res.headers.get('content-type') || '';
//             if (contentType.includes('application/json')) {
//                 const data = await res.json();
//                 // поддерживаем разные формы ответа
//                 token = data.short_token;
//             } else {
//                 token = await res.text();
//             }
//
//             if (!token) {
//                 throw new Error('Получен пустой токен от сервера');
//             }
//
//             const url = `https://t.me/socialpulsesandboxbot?start=${encodeURIComponent(token)}`;
//             // Открываем ссылку в новой вкладке
//             window.open(url, '_blank');
//         } catch (err) {
//             console.error(err);
//             alert('Ошибка при привязке: ' + err.message);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//
//     return (
//         <div style={{ padding: 20 }}>
//             <div id="telegram-login-container"></div>
//
//             <div style={{ marginTop: 12 }}>
//                 <input
//                     value={inputValue}
//                     onChange={(e) => setInputValue(e.target.value)}
//                     placeholder="Вставьте текст (param)"
//                     style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
//                 />
//                 <div style={{ marginTop: 8 }}>
//                     <a href="#" onClick={handleBind}>{loading ? 'Отправка...' : 'Привязать телеграм'}</a>
//                 </div>
//             </div>
//             <div id="VkIdSdkOneTap" style={{ minHeight: '44px' }}></div>
//             <div id="bindVKSdk" style={{ minHeight: '45px'}}></div>
//         </div>
//     );
// }
//
// export default App;