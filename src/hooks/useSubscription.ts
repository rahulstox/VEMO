import { useState } from "react";
import axios from "axios";

export const useSubscription = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Ab yeh function plan ka naam lega
  const onSubscribe = async (plan: "monthly" | "annually") => {
    setIsProcessing(true);
    try {
      // GET se POST mein badla gaya
      const response = await axios.post("/api/payment", { plan });

      if (response.data.status === 200) {
        // Razorpay checkout ko open karein
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          subscription_id: response.data.subscription_id,
          name: "VEMO Pro",
          description: `VEMO Pro ${plan} subscription`,
          handler: function (res: any) {
            // Payment success par hum webhook par nirbhar karenge
            console.log(res);
            alert("Payment Successful! Your account will be upgraded shortly.");
          },
          prefill: {
            email: response.data.user_email,
          },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }
      setIsProcessing(false);
    } catch (error) {
      console.log(error, "🔴");
      setIsProcessing(false);
    }
  };
  return { onSubscribe, isProcessing };
};
