import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { OrderTrackingView } from "@/components/ViewOrder/OrderTrackingView";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Track Order | Lobango",
  description: "Track the real-time status of your food order.",
};

export interface OrderTrackingPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

async function OrderTrackingContent({ searchParams }: OrderTrackingPageProps) {
  const params = await searchParams;
  const searchOrderId = params.orderId || null;

  return <OrderTrackingView searchOrderId={searchOrderId} />;
}

export default function OrderTrackingPage({
  searchParams,
}: OrderTrackingPageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-(--smoky-black-1)">
          <LoadingSpinner />
        </div>
      }
    >
      <OrderTrackingContent searchParams={searchParams} />
    </Suspense>
  );
}
