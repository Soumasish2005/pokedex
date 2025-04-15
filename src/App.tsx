import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PokemonList } from './components/PokemonList';
import { PokemonDetails } from './components/PokemonDetails';

function App() {
  return (
    <div className="min-h-screen w-full 
  bg-[url('./assets/pokedex_mobile_bg.jpg')] 
  sm:bg-[url('./assets/pokedex_mobile_bg.jpg')] 
  md:bg-[url('./assets/pokedex_desktop_bg.jpg')] 
  lg:bg-[url('./assets/pokedex_bg.jpg')] 
  bg-cover bg-fixed select-none">
      
      <Routes>
        <Route path="/" element={<PokemonList />} />
        <Route path="/pokemon/:id" element={<PokemonDetails />} />
      </Routes>
    </div>
  );
}

export default App;