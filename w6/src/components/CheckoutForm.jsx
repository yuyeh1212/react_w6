import { useForm } from "react-hook-form";

const CheckoutForm = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // ✅ 取得 `reset()` 方法
  } = useForm();

  return (
    <div className="checkout-form">
      <h2>結帳</h2>
      <form onSubmit={handleSubmit((data) => onSubmit(data, reset))}>
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

        <div className="mb-3">
          <label className="form-label">留言</label>
          <textarea
            {...register("message")}
            className="form-control"
            placeholder="留言 (選填)"
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary">
          送出訂單
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
