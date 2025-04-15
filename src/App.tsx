import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PokemonList } from './components/PokemonList';
import { PokemonDetails } from './components/PokemonDetails';

function App() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-red-600 to-red-700">
      <Routes>
        <Route path="/" element={<PokemonList />} />
        <Route path="/pokemon/:id" element={<PokemonDetails />} />
      </Routes>
    </div>
  );
}

export default App;