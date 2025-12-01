import PaymentCancelled from "@/components/user/CancelPayment";
import React, { Suspense } from "react";

const OrderCancelled = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        </div>
      }
    >
      <PaymentCancelled/>
    </Suspense>
  );
};

export default OrderCancelled;
