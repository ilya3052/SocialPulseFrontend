import { Navigate, Route, Routes, useLocation, Outlet } from 'react-router-dom';

import LoginForm from './features/auth/login/pages/Login.jsx';
import ProfileSection from './features/profile/pages/ProfileSection.jsx';
import RegistrationForm from "./features/auth/registration/pages/Registration.jsx";
import Header from "./components/header/Header.jsx";
import Footer from "./components/footer/Footer.jsx";
import EmailActivation from "./features/auth/emailActivate/pages/EmailActivation.jsx";
import AddGroup from "./features/groups/pages/addGroup/addGroup.jsx";
import AdminPage from "./features/admin/pages/AdminPage.jsx";

import { useUser } from "./context/UserContext.jsx";

// --- Guards ---

const ProtectedLayout = () => {
    const { user, loading } = useUser();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

const AdminRoute = () => {
    const { user } = useUser();

    if (!user?.is_staff) {
        return <Navigate to="/profile" replace />;
    }

    return <Outlet />;
};

const UserRoute = () => {
    const { user } = useUser();

    if (user?.is_staff) {
        return <Navigate to="/admin" replace />;
    }

    return <Outlet />;
};

const RoleRedirect = () => {
    const { user, loading } = useUser();

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

                        <Route path="/email/activate" element={<EmailActivation />} />

                    </Route>

                </Routes>
            </main>

            {!isAuthPage && <Footer />}
        </div>
    );
};

export default App;