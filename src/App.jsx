import {Routes, Route, useLocation} from 'react-router-dom';
import LoginForm from './pages/login/Login.jsx';
import ProfileSection from './pages/profile/ProfileSection.jsx';

import RegistrationForm from "./pages/registration/Registration.jsx";
import ProtectedLayout from "./components/protectedLayout/protectedLayout.jsx";
import Header from "./components/header/Header.jsx";
import Footer from "./components/footer/Footer.jsx";
import EmailActivation from "./pages/emailActivation/EmailActivation.jsx";

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
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/registration" element={<RegistrationForm />} />

                    {/* Protected */}
                    <Route element={<ProtectedLayout />}>
                        <Route path="/" element={<ProfileSection />} />
                        <Route path="/profile" element={<ProfileSection />} />
                        <Route path="/email/activate" element={<EmailActivation />} />

                    </Route>
                </Routes>
            </main>

            {!isAuthPage && <Footer />}
            </div>
    );
}

export default App;

