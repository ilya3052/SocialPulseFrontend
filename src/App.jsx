import { Navigate, Route, Routes, useLocation, Outlet } from 'react-router-dom';

import LoginForm from './pages/login/Login.jsx';
import ProfileSection from './pages/profile/ProfileSection.jsx';
import RegistrationForm from "./pages/registration/Registration.jsx";
import Header from "./components/header/Header.jsx";
import Footer from "./components/footer/Footer.jsx";
import EmailActivation from "./pages/emailActivation/EmailActivation.jsx";
import AddGroup from "./pages/addGroup/addGroup.jsx";
import AdminPage from "./pages/adminPanel/AdminPage.jsx";

import {UserContext, useUser, useUserLoading} from "./context/UserContext";

// --- Guards ---

const ProtectedLayout = () => {
    const user = useUser();
    const loading = useUserLoading();

    // 🔥 важно: ждём загрузку
    if (loading) {
        return <div>Loading...</div>;
    }

    // не авторизован
    if (user === null) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

const AdminRoute = () => {
    const user = useUser();
    console.log('admin: ', user.is_staff);
    if (!user?.is_staff) {
        return <Navigate to="/profile" replace />;
    }

    return <Outlet />;
};

const UserRoute = () => {
    const user = useUser();
    console.log('user: ', user.is_staff);
    if (user?.is_staff) {
        return <Navigate to="/admin" replace />;
    }

    return <Outlet />;
};

const RoleRedirect = () => {
    const user = useUser();
    const loading = useUserLoading();

    // Ждём загрузки данных перед редиректом
    if (loading) {
        return <div>Loading...</div>;
    }

    return user?.is_staff
        ? <Navigate to="/admin" replace />
        : <Navigate to="/profile" replace />;
};

// --- App ---

const App = () => {
    const location = useLocation();

    const isAuthPage =
        location.pathname === "/login" ||
        location.pathname === "/registration";

    return (
        <div className="app">
            {!isAuthPage && <Header />}

            <main className="main">
                <Routes>

                    {/* Public */}
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/registration" element={<RegistrationForm />} />

                    {/* Protected */}
                    <Route element={<ProtectedLayout />}>

                        {/* Редирект по роли */}
                        <Route path="/" element={<RoleRedirect />} />

                        {/* USER ONLY */}
                        <Route element={<UserRoute />}>
                            <Route path="/profile" element={<ProfileSection />} />
                            <Route path="/profile/groups/add" element={<AddGroup />} />
                        </Route>

                        {/* ADMIN ONLY */}
                        <Route element={<AdminRoute />}>
                            <Route path="/admin" element={<AdminPage />} />
                        </Route>

                        {/* Общие */}
                        <Route path="/email/activate" element={<EmailActivation />} />

                    </Route>

                </Routes>
            </main>

            {!isAuthPage && <Footer />}
        </div>
    );
};

export default App;