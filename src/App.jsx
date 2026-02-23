import { Routes, Route } from 'react-router-dom';
import LoginForm from './pages/login/Login.jsx';
import ProfileSection from './pages/profile/ProfileSection.jsx';

import RegistrationForm from "./pages/registration/Registration.jsx";
import ProtectedLayout from "./components/protectedLayout/protectedLayout.jsx";
import Header from "./components/header/Header.jsx";
import Footer from "./components/footer/Footer.jsx";

const App = () => {
    return (
        <div className="app">

            {/* Public routes — без хедера и футера */}
            <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/registration" element={<RegistrationForm />} />
            </Routes>

            {/* Protected routes — с хедером и футером */}
            <div className="protected-wrapper">
                <Header />
                <main className="main">
                    <Routes>
                        <Route element={<ProtectedLayout />}>
                            <Route path="/" element={<ProfileSection />} />
                            <Route path="/profile" element={<ProfileSection />} />
                        </Route>
                    </Routes>
                </main>
                <Footer />
            </div>

        </div>
    );
}

export default App;

