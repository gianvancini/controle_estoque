import Link from "next/link";
import { Navbar, Nav, Container } from "react-bootstrap";
 
const Footer = () => {
  return (
    <Navbar bg="dark" data-bs-theme="dark" fixed="bottom" style={footerBarStyle}>
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

const footerBarStyle = {
  zIndex: 500
};

export default Footer;