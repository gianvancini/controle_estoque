import { useRouter } from "next/router";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useAuth } from "@/context/authContext";
import styles from "@/styles/navbar.module.css";

const NavBar = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" className={styles.navbar} fixed="top">
      <Container>
        <Nav className="ms-auto">
          <Nav.Link onClick={handleLogout} className={styles.navLink}>
            Logout
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
