import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingLeadWidget } from '@/components/ui/FloatingLeadWidget';

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#080808]">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingLeadWidget />
    </div>
  );
}

