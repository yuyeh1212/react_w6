import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const useCart = () => {
  const [cart, setCart] = useState([]);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);

  // 取得購物車內容
  const getCart = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
      setCart(res.data.data.carts);
      setCartTotal(res.data.data.total);
    } catch (error) {
      alert("取得購物車失敗");
    } finally {
      setIsLoading(false);
    }
  };

  // 加入購物車
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
      await getCart();
      alert("成功加入購物車！");
    } catch (error) {
      alert("加入購物車失敗");
    } finally {
      setLoadingProductId(null);
    }
  };

  // 更新購物車商品數量
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

  // 移除購物車內的商品
  const removeFromCart = async (cart_id) => {
    setIsLoading(true);
    try {
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/cart/${cart_id}`);
      await getCart();
    } catch (error) {
      alert("刪除商品失敗");
    } finally {
      setIsLoading(false);
    }
  };

  // 清空購物車
  const clearCart = async () => {
    setIsLoading(true);
    try {
      const res = await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/carts`);
      if (res.data.success) {
        setCart([]); // 直接設置空陣列
        setCartTotal(0); // 重置購物車總額
        console.log("購物車已清空");
      }
    } catch (error) {
      if (error.response?.data?.message === "購物車無內容") {
        console.warn("購物車已經是空的，忽略錯誤");
        setCart([]);
        setCartTotal(0);
      } else {
        alert("清空購物車失敗");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 提交訂單
  const submitOrder = async (data, resetForm) => {
    setIsLoading(true);
    try {
      const orderRes = await axios.post(
        `${BASE_URL}/v2/api/${API_PATH}/order`,
        { data }
      );
      if (orderRes.data.success) {
        await clearCart(); 
        resetForm(); 
        alert("訂單已送出！");
        await getCart();
      }
    } catch (error) {
      alert("送出訂單失敗");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  return {
    cart,
    cartTotal,
    loadingProductId,
    isLoading,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    submitOrder,
  };
};

export default useCart;
