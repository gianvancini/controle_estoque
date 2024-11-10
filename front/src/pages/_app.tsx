import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import type { AppProps } from "next/app";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import Footer from "./components/FooterBar";
import { Container } from "react-bootstrap";
import { useState } from "react";
import { AuthProvider } from "../context/authContext";
import { useRouter } from 'next/router';
import { ProtectedRoute } from "./components/protectedRoute";

export default function App({ Component, pageProps }: AppProps) {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const router = useRouter();

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    const isLoginPage = router.pathname === '/login';

    return (
        <AuthProvider>
            <div className="d-flex" style={{ backgroundColor: '#e3e3e3', paddingTop: "70px", minHeight: "100vh" }}>
                {sidebarVisible && !isLoginPage && <SideBar toggleSidebar={toggleSidebar} />}
                <div style={{ flexGrow: 1, marginLeft: sidebarVisible && !isLoginPage ? '250px' : '0', transition: 'margin-left 0.3s' }}>
                    {!isLoginPage && <NavBar onToggleSidebar={toggleSidebar} />}
                    <Container className="flex-grow-1 d-flex justify-content-center align-items-center">
                        {isLoginPage ? (
                            <Component {...pageProps} />
                        ) : (
                            <ProtectedRoute>
                                <Component {...pageProps} />
                            </ProtectedRoute>
                        )}
                    </Container>
                    {!isLoginPage && <Footer />}
                </div>
            </div>
        </AuthProvider>
    );
}