import Link from "next/link";
import { Navbar, Container } from "react-bootstrap";
import styles from "@/styles/footer.module.css";

const Footer = () => {
  return (
    <Navbar bg="dark" fixed="bottom" className={styles.footerBar}>
      <Container className="justify-content-center">
        <Navbar.Brand>
          <Link href="/" passHref>
            Gian Vancini © {new Date().getFullYear()}
          </Link>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default Footer;
