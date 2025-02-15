import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactLoading from "react-loading";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const Products = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [loadingProductId, setLoadingProductId] = useState(null);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/v2/api/${API_PATH}/products`)
      .then((res) => setProducts(res.data.products))
      .catch(() => alert("取得產品失敗"));
  }, []);

  return (
    <div className="products">
      <h1>產品列表</h1>
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-md-4 product-card">
            <h3>{product.title}</h3>
            <img
              src={product.imageUrl}
              alt={product.title}
              className="img-fluid"
            />
            <p>特價 {product.price} 元</p>
            <div className="d-flex justify-content-center gap-2">
              <button
                type="button"
                className="btn btn-primary d-flex align-items-center gap-2"
                onClick={() => {
                  setLoadingProductId(product.id);
                  addToCart(product.id, 1).finally(() =>
                    setLoadingProductId(null)
                  );
                }}
                disabled={loadingProductId === product.id}
              >
                加入購物車
                {loadingProductId === product.id && (
                  <ReactLoading
                    type={"spin"}
                    color={"#000"}
                    height={"1.5rem"}
                    width={"1.5rem"}
                  />
                )}
              </button>
              <Link to={`/products/${product.id}`} className="btn btn-warning">
                查看更多
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
