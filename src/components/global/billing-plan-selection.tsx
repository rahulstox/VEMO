// src/components/global/billing-plan-selection.tsx
"use client";

import React, { useState } from "react";
import BillingToggle, { ToggleTab } from "@/components/ui/billing-toggle";
import { useSubscription } from "@/hooks/useSubscription";
import Squishy3DButton from "../ui/squishy-3d-button";
import Loader from "./loader";

const TABS: [ToggleTab, ToggleTab] = [
  { label: "Monthly", value: "monthly" },
  { label: "Annually", value: "annually" },
];

const prices = {
  monthly: 15,
  annually: 120,
};

const BillingPlanSelection = () => {
  const [activeTab, setActiveTab] = useState(TABS[0].value);
  const { onSubscribe, isProcessing } = useSubscription();

  const isMonthly = activeTab === "monthly";
  const currentPrice = isMonthly ? prices.monthly : prices.annually / 12; // Price per month for annual
  const billingCycle = isMonthly ? "month" : "year";
  const totalPrice = isMonthly
    ? ""
    : `(Billed as $${prices.annually} per year)`;

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <h3 className="text-2xl font-bold">Choose Your Plan</h3>

      <BillingToggle tabs={TABS} tab={activeTab} setTab={setActiveTab} />

      <div className="text-center">
        <p className="text-4xl font-bold">
          ${currentPrice}
          <span className="text-lg font-normal text-muted-foreground">
            {" "}
            / month
          </span>
        </p>
        <p className="text-sm text-muted-foreground">{totalPrice}</p>
      </div>

      <Squishy3DButton
        className="w-full bg-white text-black font-bold"
        onClick={() => onSubscribe(activeTab as "monthly" | "annually")}
      >
        <Loader state={isProcessing}>Upgrade to Pro</Loader>
      </Squishy3DButton>
    </div>
  );
};

export default BillingPlanSelection;
