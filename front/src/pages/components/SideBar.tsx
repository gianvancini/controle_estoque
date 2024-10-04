import { useState } from "react";
import Link from "next/link";
import { Nav, Collapse } from "react-bootstrap";
import { FaTachometerAlt, FaBox, FaUsers, FaBars, FaWarehouse, FaShoppingCart, FaChartBar, FaBook, FaUserAlt, FaProductHunt } from "react-icons/fa";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isCadastrosOpen, setIsCadastrosOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCadastros = () => setIsCadastrosOpen(!isCadastrosOpen);

  return (
    <div className={`d-flex ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`} style={sidebarStyle}>
      <div style={isOpen ? expandedSidebarStyle : collapsedSidebarStyle}>
      <div style={{ ...linkContentStyle, padding: '20px', backgroundColor: "#212529", height: "55px"}} onClick={toggleSidebar} className="sidebar-link">
        {isOpen ? 'Painel Gerencial' : <FaBars style={iconStyle} />}
      </div>


        <Nav className="flex-column">

          <Nav.Link as={Link} href="/dashboard" className="sidebar-link">
            <div style={linkContentStyle}>
              <FaTachometerAlt style={iconStyle} />
              {isOpen && "Dashboard"}
            </div>
          </Nav.Link>

          <div
            onClick={toggleCadastros}
            aria-controls="cadastros-collapse"
            aria-expanded={isCadastrosOpen}
            className="sidebar-link"
            style={{ ...linkContentStyle, paddingLeft: '15px' }}
          >
            <div style={linkContentStyle}>
              <FaBox style={iconStyle} />
              {isOpen && "Cadastros"}
            </div>
          </div>

          <Collapse in={isCadastrosOpen}>
            <div id="cadastros-collapse" style={{ paddingLeft: '20px' }}>
              <Nav.Link as={Link} href="/produtos" className="sidebar-link">
                <div style={linkContentStyle}>
                  <FaProductHunt style={iconStyle} />
                  {isOpen && "Produtos"}
                </div>
              </Nav.Link>
              <Nav.Link as={Link} href="/clientes" className="sidebar-link">
                <div style={linkContentStyle}>
                  <FaUsers style={iconStyle} />
                  {isOpen && "Clientes"}
                </div>
              </Nav.Link>
              <Nav.Link as={Link} href="/vendedores" className="sidebar-link">
                <div style={linkContentStyle}>
                  <FaUserAlt style={iconStyle} />
                  {isOpen && "Vendedores"}
                </div>
              </Nav.Link>
            </div>
          </Collapse>

          <Nav.Link as={Link} href="/estoque" className="sidebar-link">
            <div style={linkContentStyle}>
              <FaWarehouse style={iconStyle} />
              {isOpen && "Estoque"}
            </div>
          </Nav.Link>

          <Nav.Link as={Link} href="/vendas" className="sidebar-link">
            <div style={linkContentStyle}>
              <FaShoppingCart style={iconStyle} />
              {isOpen && "Vendas"}
            </div>
          </Nav.Link>

          <Nav.Link as={Link} href="/relatorios" className="sidebar-link">
            <div style={linkContentStyle}>
              <FaChartBar style={iconStyle} />
              {isOpen && "Relatórios"}
            </div>
          </Nav.Link>

          <Nav.Link as={Link} href="/catalogo" className="sidebar-link">
            <div style={linkContentStyle}>
              <FaBook style={iconStyle} />
              {isOpen && "Catálogo"}
            </div>
          </Nav.Link>
          
        </Nav>
      </div>
    </div>
  );
};

const sidebarStyle = {
  position: "fixed",
  top: "0",
  bottom: "0",
  left: "0",
  backgroundColor: "#343a40",
  color: "white",
  transition: "width 0.3s",
  zIndex: 1000,
};

const expandedSidebarStyle = {
  width: "250px",
};

const collapsedSidebarStyle = {
  width: "70px",
};

const linkContentStyle = {
  display: 'flex',
  alignItems: 'center',
  color: "white",
  fontSize: "15px",
  padding: "5px",
  cursor: "pointer",
  textDecoration: "none",
};

const iconStyle = {
  marginRight: "10px"
};

const styles = `
  .sidebar-link {
    text-decoration: none;
    transition: box-shadow 0.3s ease;
  }
  
  .sidebar-link:hover {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }

  .sidebar-link.active, .sidebar-link:active {
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
`;

if (typeof window !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default SideBar;
