import { lusitana } from "@/app/ui/fonts";
import {
  CardSkeleton,
  LatestInvoicesSkeleton,
  RevenueChartSkeleton,
} from "@/app/ui/skeletons";
import clsx from "clsx";
import { Suspense } from "react";
import { fetchCardData } from "../../lib/data";
import LatestInvoices from "../../ui/dashboard/latest-invoices";
import RevenueChart from "../../ui/dashboard/revenue-chart";
import CardWrapper from "@/app/ui/dashboard/cards";
import InvoicesPage from "../invoices/page";

const DashboardPage = async () => {
  return (
    <main>
      <h1
        className={clsx(
          lusitana.className,
          "mb-4 text-xl md:text-2xl text-blue-400 font-bold"
        )}
      >
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <InvoicesPage />
        </Suspense>
      </div>
    </main>
  );
};

export default DashboardPage;
