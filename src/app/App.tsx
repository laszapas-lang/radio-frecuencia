import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Player from './components/Player';
import Identity from './components/Identity';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#292524]">
      <Navbar />
      <Hero />
      <Player />
      <Identity />
      <Footer />
    </div>
  );
}