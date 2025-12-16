import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { removeFromCart } from "@/reduxStore/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true;
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// const cartItems = [
//   {
//     id: "course_001",
//     title: "Mastering React.js ",
//     thumbnail: "https://i.ytimg.com/vi/SoQf8tLTODI/maxresdefault.jpg",
//     price: 2999,
//     instructor: "Om Prakash",
//   },
//   {
//     id: "course_002",
//     title: "Node.js for Backend",
//     thumbnail:
//       "https://coursevania.com/wp-content/uploads/2024/03/2776760_f176_10.jpg",
//     price: 1999,
//     instructor: "Raj Kumar",
//   },
// ];

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.cartItems);
  const user = useSelector((state) => state.user.user);
  let cartItem;
  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    setCartItems(cart);
    console.log("cartItem", cart);
  }, [user, cart]);

  let total = cart?.reduce((total, item) => total + Number(item.price), 0);
  const stringTotal = String(total);
  console.log("string total:", stringTotal);
  const arrayTotal = stringTotal.split("");
  let count = 0;
  let finalTotal = "";

  for (let i = arrayTotal.length - 1; i >= 0; i--) {
    finalTotal = stringTotal[i] + finalTotal;
    count++;
    if (i > 0) {
      if (count == 3) {
        finalTotal = "," + finalTotal;
      } else if (count > 3 && (count - 3) % 2 === 0) {
        finalTotal = "," + finalTotal;
      }
    }
  }
  const handleCheckout = async () => {
    console.log(cartItems);
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/course/course-payment`,
      {
        courseItems: JSON.stringify(cartItems),
      }
    );
    const stripe = await stripePromise;

    await stripe.redirectToCheckout({ sessionId: response.data.sessionId });
  };

  const handleRemove = async (id) => {
    console.log("course id:", id);
    await axios
      .post(`${import.meta.env.VITE_API_URL}/api/student/removeFromCart`, {
        courseId: id,
      })
      .then((response) => {
        dispatch(removeFromCart({ userId: user?.id, courseId: id }));
      });
  };

  return (
    <div className="max-w-5xl mx-auto min-h-[50vh] p-6 dark:bg-gray-900 rounded mt-0">
      <h2 className="text-[30px] font-bold mb-6">My Cart</h2>

      {cart?.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart?.map((item) => (
              <div
                key={item?.id}
                className=" dark:bg-gray-800 relative px-4 py-4 rounded shadow-sm"
              >
                <div
                  className="absolute right-2 top-2 cursor-pointer"
                  onClick={() => handleRemove(item?.id)}
                >
                  <RxCross2 size={21} />
                </div>
                <div className="flex items-center gap-4">
                  <img
                    src={item?.thumbnail}
                    alt={item?.title}
                    className="w-28 rounded"
                  />
                  <div>
                    <h2 className="text-[16px] font-semibold">
                      {item.title.slice(0, 15)}...
                    </h2>
                    <p className="text-[13px] text-gray-600">
                      {/* Instructor: {item?.instructor.name} */}
                    </p>
                    <p className="text-green-600 font-bold">₹{item?.price}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-6 border-t pt-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">Total: ₹{finalTotal}</h3>
              <button
                onClick={handleCheckout}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
