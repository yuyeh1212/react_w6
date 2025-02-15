import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          購物網站
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                首頁
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products">
                產品列表
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cart">
                購物車
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
