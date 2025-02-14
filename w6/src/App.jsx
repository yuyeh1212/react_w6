import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { useForm } from "react-hook-form";
import ReactLoading from "react-loading";
import "./styles.scss";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(null);
  const productModalRef = useRef(null);
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartFinalTotal, setCartFinalTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProductId, setLoadingProductId] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (productModalRef.current && !productModalRef.currentInstance) {
      productModalRef.currentInstance = new Modal(productModalRef.current);
    }
    getProducts();
    getCart();
  }, [tempProduct]);

  const getProducts = async () => {
    setIsLoading(true); // 顯示全螢幕 Loading
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products`);
      setProducts(res.data.products);
    } catch (error) {
      alert("取得產品失敗");
    } finally {
      setIsLoading(false); // 隱藏全螢幕 Loading
    }
  };

  const getProduct = async (product_id) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/v2/api/${API_PATH}/product/${product_id}`
      );
      setTempProduct(res.data.product);
      setQuantity(1); // 每次打開 Modal 時，數量重設為 1
      if (productModalRef.currentInstance) {
        productModalRef.currentInstance.show();
      }
    } catch (error) {
      console.log(error);
      alert("取得產品詳細資訊失敗");
    }
  };

  const getCart = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
      setCart(res.data.data.carts);
      setCartTotal(res.data.data.total);
      setCartFinalTotal(res.data.data.final_total);
    } catch (error) {
      alert("取得購物車失敗");
    }
  };

  const addToCart = async (product_id, qty = 1) => {
    if (!product_id) {
      alert("發生錯誤：產品 ID 無效");
      return;
    }

    setLoadingProductId(product_id);
    try {
      await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`, {
        data: { product_id, qty },
      });
      getCart();
      if (productModalRef.currentInstance) {
        productModalRef.currentInstance.hide(); // 加入購物車後自動關閉 Modal
      }
    } catch (error) {
      alert("加入購物車失敗");
    } finally {
      setLoadingProductId(null);
    }
  };

  const removeFromCart = async (cart_id) => {
    setIsLoading(true); // 顯示全螢幕 Loading
    try {
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/cart/${cart_id}`);
      getCart();
    } catch (error) {
      alert("刪除失敗");
    } finally {
      setIsLoading(false); // 隱藏全螢幕 Loading
    }
  };

  const clearCart = async () => {
    setIsLoading(true); // 顯示全螢幕 Loading
    try {
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/carts`);
      getCart();
    } catch (error) {
      alert("清空購物車失敗");
    } finally {
      setIsLoading(false); // 隱藏全螢幕 Loading
    }
  };

  const updateCartQty = async (cart_id, qty) => {
    if (qty < 1) return;
    setIsLoading(true); // 顯示全螢幕 Loading
    try {
      const cartItem = cart.find((item) => item.id === cart_id);
      if (!cartItem) throw new Error("購物車項目未找到");
      await axios.put(`${BASE_URL}/v2/api/${API_PATH}/cart/${cart_id}`, {
        data: { product_id: cartItem.product.id, qty: Number(qty) },
      });
      await getCart();
    } catch (error) {
      alert("更新數量失敗");
    } finally {
      setIsLoading(false); // 隱藏全螢幕 Loading
    }
  };

  const submitOrder = async (data) => {
    setIsLoading(true); // 顯示全螢幕 Loading
    try {
      await axios.post(`${BASE_URL}/v2/api/${API_PATH}/order`, { data });
      alert("訂單已送出");
      reset(); // 清空表單
      getCart();
    } catch (error) {
      alert("送出訂單失敗");
    } finally {
      setIsLoading(false); // 隱藏全螢幕 Loading
    }
  };

  return (
    <div className="container">
      <h1>購物網站</h1>
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-md-4">
            <h3>{product.title}</h3>
            <del className="h6">原價 {product.origin_price} 元</del>
            <div className="h5">特價 {product.price}元</div>
            <img
              src={product.imageUrl}
              alt={product.title}
              className="img-fluid"
            />
            <div className="d-flex justify-content-center gap-2">
              <button
                type="button"
                className="btn btn-primary d-flex align-items-center gap-2"
                onClick={() => addToCart(product.id, 1)}
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
              <button
                onClick={() => getProduct(product.id)}
                className="btn btn-warning"
              >
                查看更多
              </button>
            </div>
          </div>
        ))}
      </div>
      <h2>購物車</h2>
      {cart.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>產品</th>
              <th>數量</th>
              <th>價格</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id}>
                <td>{item.product.title}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => updateCartQty(item.id, item.qty - 1)}
                  >
                    -
                  </button>
                  <span className="mx-2">{item.qty}</span>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => updateCartQty(item.id, item.qty + 1)}
                  >
                    +
                  </button>
                </td>
                <td>{item.total} 元</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => removeFromCart(item.id)}
                  >
                    刪除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>購物車內無商品</p>
      )}
      {cart.length > 0 && (
        <div className="d-flex justify-content-between align-items-center">
          <h4>總金額：{cartTotal} 元</h4>
          <button className="btn btn-outline-danger" onClick={clearCart}>
            清空購物車
          </button>
        </div>
      )}

      <h2>結帳</h2>
      <form onSubmit={handleSubmit(submitOrder)}>
        {/* 姓名 */}
        <div className="mb-3">
          <label className="form-label">姓名</label>
          <input
            {...register("user.name", { required: "姓名必填" })}
            className="form-control"
            placeholder="請輸入姓名"
          />
          {errors.user?.name && (
            <p className="text-danger">{errors.user.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            {...register("user.email", {
              required: "Email 必填",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Email 格式錯誤",
              },
            })}
            className="form-control"
            placeholder="請輸入 Email"
          />
          {errors.user?.email && (
            <p className="text-danger">{errors.user.email.message}</p>
          )}
        </div>

        {/* 電話 */}
        <div className="mb-3">
          <label className="form-label">電話</label>
          <input
            {...register("user.tel", {
              required: "電話必填",
              pattern: {
                value: /^(0[2-8]\d{7}|09\d{8})$/,
                message: "請輸入正確的市內電話或手機號碼",
              },
            })}
            className="form-control"
            placeholder="請輸入電話"
          />
          {errors.user?.tel && (
            <p className="text-danger">{errors.user.tel.message}</p>
          )}
        </div>

        {/* 地址 */}
        <div className="mb-3">
          <label className="form-label">住址</label>
          <input
            {...register("user.address", { required: "地址必填" })}
            className="form-control"
            placeholder="請輸入地址"
          />
          {errors.user?.address && (
            <p className="text-danger">{errors.user.address.message}</p>
          )}
        </div>

        {/* 留言 */}
        <div className="mb-3">
          <label className="form-label">留言</label>
          <textarea
            {...register("message")}
            className="form-control"
            placeholder="留言 (選填)"
          ></textarea>
        </div>

        {/* 送出按鈕 */}
        <button type="submit" className="btn btn-primary">
          送出訂單
        </button>
      </form>

      {/* 產品詳情 Modal */}
      {tempProduct && (
        <div className="modal fade" ref={productModalRef} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{tempProduct.title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>
              <div className="modal-body">
                <img
                  src={tempProduct.imageUrl || ""}
                  className="img-fluid"
                  alt={tempProduct.title || "產品圖片"}
                />
                <p>{tempProduct.description}</p>

                {/* 新增數量選擇 */}
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

                {/* 加入購物車按鈕 */}
                <button
                  className="btn btn-primary d-flex align-items-center gap-2 mt-3"
                  onClick={() =>
                    tempProduct && addToCart(tempProduct.id, quantity)
                  }
                  disabled={!tempProduct || loadingProductId === tempProduct.id}
                >
                  加入購物車
                  {loadingProductId === tempProduct?.id && (
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
          </div>
        </div>
      )}

      {isLoading && (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(255,255,255,0.3)",
            zIndex: 999,
          }}
        >
          <ReactLoading type="spin" color="black" width="4rem" height="4rem" />
        </div>
      )}
    </div>
  );
}

export default App;
