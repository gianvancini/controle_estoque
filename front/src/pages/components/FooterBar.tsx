import Link from "next/link";
import { Navbar, Nav, Container } from "react-bootstrap";
 
const Footer = () => {
  return (
    <Navbar bg="dark" data-bs-theme="dark" fixed="bottom">
      <Container className="justify-content-center">
        <Navbar.Brand>
          <Nav.Link as={Link} passHref href="/">
            Gian Vancini © {new Date().getFullYear()}
          </Nav.Link>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default Footer;