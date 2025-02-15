import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ReactLoading from "react-loading";
import "../saaets/ProductDetail.scss";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const ProductDetail = ({ addToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loadingProductId, setLoadingProductId] = useState(null);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/v2/api/${API_PATH}/product/${id}`)
      .then((res) => setProduct(res.data.product))
      .catch(() => alert("取得產品詳細資訊失敗"));
  }, [id]);

  if (!product) return <p>載入中...</p>;

  return (
    <div className="product-detail d-flex flex-column align-items-center text-center">
      <h1>{product.title}</h1>
      <img src={product.imageUrl} alt={product.title} className="img-fluid" />
      <p>{product.description}</p>
      <p>價格: {product.price} 元</p>

      <div className="d-flex align-items-center gap-3 mt-3">
        <label htmlFor="quantity">數量：</label>
        <select
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          className="form-select"
        >
          {[...Array(10).keys()].map((num) => (
            <option key={num + 1} value={num + 1}>
              {num + 1}
            </option>
          ))}
        </select>

        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => {
            setLoadingProductId(product.id);
            addToCart(product.id, quantity).finally(() =>
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
      </div>
    </div>
  );
};

export default ProductDetail;
