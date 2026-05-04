"use client";

import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Player from './components/Player';
import Identity from './components/Identity';
import Footer from './components/Footer';

export default function App() {
  const [autorizado, setAutorizado] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('p') === 'ercilla423') {
      setAutorizado(true);
    }
    setCargando(false);
  }, []);

  // Mientras la web "piensa" si hay clave, mostramos fondo negro
  if (cargando) {
    return <div className="min-h-screen bg-black"></div>;
  }

  // Si no hay clave, pantalla de error falsa para los bots
  if (!autorizado) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-2xl font-mono">404 Not Found</h1>
      </div>
    );
  }

  // SI TODO ESTÁ BIEN, CARGA TU WEB ORIGINAL
  return (
    <div className="min-h-screen bg-[#292524]">
      <Navbar />
      <Hero />
      <Player />
      
      <Footer />
    </div>
  );
}
