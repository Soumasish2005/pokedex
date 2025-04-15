import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Zap } from 'lucide-react';
import { Pokemon } from '../types';
import { PokemonCard } from './PokemonCard';
import { PokemonLoader } from './PokemonLoader';

// Cache to store fetched Pokemon data
const pokemonCache = new Map<string, Pokemon>();

export function PokemonList() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  const fetchPokemon = useCallback(async (pageNumber: number) => {
    try {
      setLoading(true);
      const limit = 20;
      const offset = (pageNumber - 1) * limit;
      
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
      const data = await response.json();
      
      // Check if there are more Pokemon to load
      setHasMore(data.next !== null);
      
      const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon: { name: string }) => {
          // Check cache first
          if (pokemonCache.has(pokemon.name)) {
            return pokemonCache.get(pokemon.name);
          }
          
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
          const details = await response.json();
          // Store in cache
          pokemonCache.set(pokemon.name, details);
          return details;
        })
      );
      
      setPokemon(prev => pageNumber === 1 ? pokemonDetails : [...prev, ...pokemonDetails]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Pokemon:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPokemon(page);
  }, [page, fetchPokemon]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100 &&
      !loading &&
      hasMore
    ) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (!loading && hasMore && pokemon.length < 100) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore, pokemon.length]);

  const filteredPokemon = pokemon.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="inset-0 bg-black/30 fixed"></div>
      <div className="flex items-center justify-center gap-3 mb-8">
        <Zap className="w-10 h-10 text-yellow-300 animate-pulse" />
        <h1 className="text-5xl font-bold z-10 text-white text-center" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPokemon.map((p) => (
          <PokemonCard
            key={p.id}
            pokemon={p}
            onClick={() => navigate(`/pokemon/${p.id}`)}
          />
        ))}
      </div>

      {loading && <PokemonLoader />}
    </div>
  );
}