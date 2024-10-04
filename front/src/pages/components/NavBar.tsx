import Link from "next/link";
import { Navbar, Nav, Container } from "react-bootstrap";

const NavBar = () => {
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" fixed="top" style={navbarStyle}>
        <Container>
          <Nav className="ms-auto">
            <Nav.Link as={Link} passHref href="/login">
              Login
            </Nav.Link>
            <Nav.Link as={Link} passHref href="/sobre">
              Sobre
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

const navbarStyle = {
  zIndex: 500
};

export default NavBar;