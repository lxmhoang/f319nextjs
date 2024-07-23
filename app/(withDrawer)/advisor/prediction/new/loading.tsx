import { Spinner } from "flowbite-react";

export default function Loading() {
  return <div className="p-5">
    <Spinner />
  </div>;
  // return <DashboardSkeleton />;
}