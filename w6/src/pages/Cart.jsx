import useCart from "../hooks/useCart";
import CheckoutForm from "../components/CheckoutForm";
import ReactLoading from "react-loading";

const Cart = () => {
  const {
    cart,
    cartTotal,
    isLoading,
    updateCartQty,
    removeFromCart,
    clearCart,
    submitOrder,
  } = useCart();

  const handleCheckout = (data, resetForm) => {
    if (cart.length === 0) {
      alert("購物車內沒有商品，無法提交訂單！");
      return;
    }
    submitOrder(data, resetForm); // ✅ 傳入 `resetForm()` 來清空表單
  };

  return (
    <div className="cart">
      <h1>購物車</h1>

      {isLoading && (
        <div className="text-center">
          <ReactLoading type="spin" color="black" height={50} width={50} />
          <p>載入中...</p>
        </div>
      )}

      {cart.length > 0 ? (
        <>
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
                      disabled={isLoading || item.qty <= 1}
                    >
                      -
                    </button>
                    <span className="mx-2">{item.qty}</span>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => updateCartQty(item.id, item.qty + 1)}
                      disabled={isLoading}
                    >
                      +
                    </button>
                  </td>
                  <td>{item.total} 元</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => removeFromCart(item.id)}
                      disabled={isLoading}
                    >
                      刪除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 總金額 & 清空購物車 */}
          <div className="d-flex justify-content-between align-items-center">
            <h4>總金額：{cartTotal} 元</h4>
            <button
              className="btn btn-outline-danger"
              onClick={clearCart}
              disabled={isLoading}
            >
              清空購物車
            </button>
          </div>

          {/* 結帳表單 */}
          <CheckoutForm onSubmit={handleCheckout} />
        </>
      ) : (
        <p>購物車內無商品</p>
      )}
    </div>
  );
};

export default Cart;
