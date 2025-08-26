"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import Loader from "../loader";
import { useSubscription } from "@/hooks/useSubscription";

type Props = {
  plan: "monthly" | "annually";
};

const PaymentButton = ({ plan }: Props) => {
  const { onSubscribe, isProcessing } = useSubscription();
  return (
    <Button
      className="text-sm w-full"
      // Pass the plan to the onSubscribe function
      onClick={() => onSubscribe(plan)}
    >
      <Loader color="#000" state={isProcessing}>
        Upgrade
      </Loader>
    </Button>
  );
};

export default PaymentButton;
