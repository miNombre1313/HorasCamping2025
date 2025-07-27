// src/components/LayoutConFooter.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';

export default function LayoutConFooter() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
