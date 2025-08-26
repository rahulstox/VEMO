"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const useSubscription = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const onSubscribe = async (plan: "monthly" | "annually") => {
    setIsProcessing(true);
    try {
      // The API call is correct
      const response = await axios.post("/api/billing", { plan });

      // **THE FIX IS HERE:** We now check the response and use the data
      if (response.data && response.data.subscriptionId) {
        const options = {
          key: response.data.razorpayKey,
          subscription_id: response.data.subscriptionId,
          name: "VEMO Pro Plan",
          description: `VEMO Pro ${plan} subscription`,
          handler: function (res: any) {
            toast.success("Payment Successful!", {
              description:
                "Your account will be upgraded shortly. Please refresh.",
            });
            setTimeout(() => {
              window.location.href = "/dashboard";
            }, 2000);
          },
          prefill: {
            email: response.data.userEmail,
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Show an error if the API call failed
        toast.error("Failed to create subscription.", {
          description: response.data.message || "Please try again later.",
        });
      }
    } catch (error) {
      console.error("Subscription Error:", error);
      toast.error("An error occurred.", {
        description: "Could not process your subscription. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  return { onSubscribe, isProcessing };
};
