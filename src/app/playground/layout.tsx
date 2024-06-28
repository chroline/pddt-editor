"use client";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={"flex-grow"}>
      <div className={"w-full flex justify-center h-full"}>{children}</div>
    </div>
  );
}
