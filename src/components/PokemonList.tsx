import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Zap } from 'lucide-react';
import { Pokemon } from '../types';
import { PokemonCard } from './PokemonCard';
import { PokemonLoader } from './PokemonLoader';

export function PokemonList() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();
        
        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon: { name: string }) => {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
            return response.json();
          })
        );
        
        setPokemon(pokemonDetails);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Pokemon:', error);
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  const filteredPokemon = pokemon.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center gap-3 mb-8">
        <Zap className="w-10 h-10 text-yellow-300 animate-pulse" />
        <h1 className="text-5xl font-bold text-white text-center" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
          Pokédex
        </h1>
        <Zap className="w-10 h-10 text-yellow-300 animate-pulse" />
      </div>
      
      <div className="relative max-w-md mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search Pokémon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-lg text-lg"
          />
        </div>
      </div>

      {loading ? (
        <PokemonLoader />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPokemon.map((p) => (
            <PokemonCard
              key={p.id}
              pokemon={p}
              onClick={() => navigate(`/pokemon/${p.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}