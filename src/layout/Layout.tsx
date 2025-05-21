import { ReactNode } from "react";

interface LayoutProps {
  headerContent: ReactNode;
  children: ReactNode;
}

export default function Layout({ headerContent, children }: LayoutProps) {
  return (
    <div className="w-full min-h-screen flex flex-col bg-white text-gray-900">
      <header className="w-full border-b border-gray-200 px-4 py-3 bg-gray-100 shadow-sm">
        {headerContent}
      </header>

      <main className="flex-1 w-full px-4 py-6">{children}</main>
    </div>
  );
}
