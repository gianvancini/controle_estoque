import { useEffect, useState } from "react";
import Link from "next/link";
import { Nav, Collapse } from "react-bootstrap";
import { FaTachometerAlt, FaUsers, FaBars, FaWarehouse, FaShoppingCart, FaChartBar, FaBook, FaUserAlt, FaProductHunt, FaCreditCard, FaShoppingBag, FaHistory, FaUserShield } from "react-icons/fa";
import styles from "@/styles/sidebar.module.css";
import { FaCirclePlus, FaFileCirclePlus } from "react-icons/fa6";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isCadastrosOpen, setIsCadastrosOpen] = useState(false);
  const [isVendasOpen, setIsVendasOpen] = useState(false);
  const [isComprasOpen, setIsComprasOpen] = useState(false);
  const [usuarioTipo, setUsuarioTipo] = useState<string | null>(null);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCadastros = () => setIsCadastrosOpen(!isCadastrosOpen);
  const toggleVendas = () => setIsVendasOpen(!isVendasOpen);
  const toggleCompras = () => setIsComprasOpen(!isComprasOpen);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tipo = localStorage.getItem('usuarioTipo');
      setUsuarioTipo(tipo);
    }
  }, []);

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
      <div className={isOpen ? styles.expandedSidebar : styles.collapsedSidebar}>
        <div onClick={toggleSidebar} className={styles.sidebarLink} style={{ backgroundColor: "#212529", height: "55px" }}>
          {isOpen ? 'Painel Gerencial' : <FaBars className={styles.iconStyle} />}
        </div>
        <Nav className="flex-column">
          <Nav.Link as={Link} href="/" className={styles.sidebarLink}>
            <FaTachometerAlt className={styles.iconStyle} />
            {isOpen && "Dashboard"}
          </Nav.Link>

          <div onClick={toggleVendas} aria-controls="vendas-collapse" aria-expanded={isVendasOpen} className={styles.sidebarLink}>
            <FaShoppingCart className={styles.iconStyle} />
            {isOpen && "Vendas"}
          </div>
          <Collapse in={isVendasOpen}>
            <div id="vendas-collapse">
              <Nav.Link as={Link} href="/vendas/novaVenda" className={`${styles.sidebarLink} ${styles.childLink}`}>
                <FaCirclePlus className={styles.iconStyle} />
                {isOpen && "Nova"}
              </Nav.Link>
              <Nav.Link as={Link} href="/vendas/historicoVenda" className={`${styles.sidebarLink} ${styles.childLink}`}>
                <FaHistory className={styles.iconStyle} />
                {isOpen && "Histórico"}
              </Nav.Link>
            </div>
          </Collapse>

          <div onClick={toggleCompras} aria-controls="compras-collapse" aria-expanded={isComprasOpen} className={styles.sidebarLink}>
            <FaShoppingBag className={styles.iconStyle} />
            {isOpen && "Compras"}
          </div>
          <Collapse in={isComprasOpen}>
            <div id="compras-collapse">
              <Nav.Link as={Link} href="/compras/novaCompra" className={`${styles.sidebarLink} ${styles.childLink}`}>
                <FaCirclePlus className={styles.iconStyle} />
                {isOpen && "Nova"}
              </Nav.Link>
              <Nav.Link as={Link} href="/compras/historicoCompra" className={`${styles.sidebarLink} ${styles.childLink}`}>
                <FaHistory className={styles.iconStyle} />
                {isOpen && "Histórico"}
              </Nav.Link>
            </div>
          </Collapse>

          <Nav.Link as={Link} href="/estoque" className={styles.sidebarLink}>
            <FaWarehouse className={styles.iconStyle} />
            {isOpen && "Estoque"}
          </Nav.Link>

          <Nav.Link as={Link} href="/catalogo" className={styles.sidebarLink}>
            <FaBook className={styles.iconStyle} />
            {isOpen && "Catálogo"}
          </Nav.Link>

          <Nav.Link as={Link} href="/simulador" className={styles.sidebarLink}>
            <FaCreditCard className={styles.iconStyle} />
            {isOpen && "Parcelamento"}
          </Nav.Link>

          <div onClick={toggleCadastros} aria-controls="cadastros-collapse" aria-expanded={isCadastrosOpen} className={styles.sidebarLink}>
            <FaFileCirclePlus className={styles.iconStyle} />
            {isOpen && "Cadastros"}
          </div>

          <Collapse in={isCadastrosOpen}>
            <div id="cadastros-collapse">
              <Nav.Link as={Link} href="/cadastros/produtos" className={`${styles.sidebarLink} ${styles.childLink}`}>
                <FaProductHunt className={styles.iconStyle} />
                {isOpen && "Produtos"}
              </Nav.Link>
              <Nav.Link as={Link} href="/cadastros/clientes" className={`${styles.sidebarLink} ${styles.childLink}`}>
                <FaUsers className={styles.iconStyle} />
                {isOpen && "Clientes"}
              </Nav.Link>
              <Nav.Link as={Link} href="/cadastros/vendedores" className={`${styles.sidebarLink} ${styles.childLink}`}>
                <FaUserAlt className={styles.iconStyle} />
                {isOpen && "Vendedores"}
              </Nav.Link>
              {usuarioTipo === "Administrador" && (
                <Nav.Link as={Link} href="/cadastros/usuarios" className={`${styles.sidebarLink} ${styles.childLink}`}>
                  <FaUserShield className={styles.iconStyle} />
                  {isOpen && "Usuários"}
                </Nav.Link>)}
            </div>
          </Collapse>

          <Nav.Link as={Link} href="/relatorios" className={styles.sidebarLink}>
            <FaChartBar className={styles.iconStyle} />
            {isOpen && "Relatórios"}
          </Nav.Link>

        </Nav>
      </div>
    </div>
  );
};

export default SideBar;