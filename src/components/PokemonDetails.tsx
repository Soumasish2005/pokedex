import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Shield, Swords, Zap, GitBranch, Scroll, Egg, Dices, Book } from 'lucide-react';
import { Pokemon, EvolutionChain, PokemonSpecies } from '../types';
import { getTypeBackground } from './PokemonCard';
import { PokemonLoader } from './PokemonLoader';

interface EvolutionData {
  name: string;
  id: number;
  image: string;
}

const getTypeGradient = (types: { type: { name: string } }[]) => {
  const typeColors: { [key: string]: string } = {
    normal: 'from-gray-400/20 to-gray-500/20',
    fire: 'from-red-500/20 to-orange-500/20',
    water: 'from-blue-500/20 to-blue-600/20',
    electric: 'from-yellow-400/20 to-yellow-500/20',
    grass: 'from-green-400/20 to-green-500/20',
    ice: 'from-blue-200/20 to-blue-300/20',
    fighting: 'from-red-700/20 to-red-800/20',
    poison: 'from-purple-400/20 to-purple-500/20',
    ground: 'from-yellow-600/20 to-yellow-700/20',
    flying: 'from-indigo-400/20 to-indigo-500/20',
    psychic: 'from-pink-500/20 to-pink-600/20',
    bug: 'from-green-400/20 to-green-500/20',
    rock: 'from-yellow-700/20 to-yellow-800/20',
    ghost: 'from-purple-700/20 to-purple-800/20',
    dragon: 'from-indigo-600/20 to-indigo-700/20',
    dark: 'from-gray-800/20 to-gray-900/20',
    steel: 'from-gray-500/20 to-gray-600/20',
    fairy: 'from-pink-300/20 to-pink-400/20'
  };

  if (types.length === 1) {
    return typeColors[types[0].type.name] || 'from-red-500 to-red-600';
  } else {
    const firstType = types[0].type.name;
    const secondType = types[1].type.name;
    return `from-${typeColors[firstType].split('to-')[0].replace('from-', '')} to-${typeColors[secondType].split(' ')[1].replace('to-', '')}`;
    // return `${typeColors[firstType]}`;
  }
};
export function PokemonDetails() {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [evolutionChain, setEvolutionChain] = useState<EvolutionData[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPokemonAndEvolution = async () => {
      try {
        // Fetch Pokemon details
        const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const pokemonData = await pokemonResponse.json();
        setPokemon(pokemonData);
        
        // Fetch species data
        const speciesResponse = await fetch(pokemonData.species.url);
        const speciesData = await speciesResponse.json();
        setSpecies(speciesData);
        
        // Fetch evolution chain
        const evolutionResponse = await fetch(speciesData.evolution_chain.url);
        const evolutionData: EvolutionChain = await evolutionResponse.json();
        
        // Process evolution chain
        const processedEvolutions: EvolutionData[] = [];
        
        // Add first form
        const firstForm = await fetchPokemonBasicData(evolutionData.chain.species.name);
        if (firstForm) processedEvolutions.push(firstForm);
        
        // Add second form
        if (evolutionData.chain.evolves_to.length > 0) {
          const secondForm = await fetchPokemonBasicData(evolutionData.chain.evolves_to[0].species.name);
          if (secondForm) processedEvolutions.push(secondForm);
          
          // Add third form
          if (evolutionData.chain.evolves_to[0].evolves_to.length > 0) {
            const thirdForm = await fetchPokemonBasicData(evolutionData.chain.evolves_to[0].evolves_to[0].species.name);
            if (thirdForm) processedEvolutions.push(thirdForm);
          }
        }
        
        setEvolutionChain(processedEvolutions);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Pokemon:', error);
        setLoading(false);
      }
    };
    
    fetchPokemonAndEvolution();
  }, [id]);
  
  const fetchPokemonBasicData = async (name: string): Promise<EvolutionData | null> => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data = await response.json();
      return {
        name: data.name,
        id: data.id,
        image: data.sprites.other['official-artwork'].front_default
      };
    } catch (error) {
      console.error('Error fetching Pokemon data:', error);
      return null;
    }
  };
  
  const getEnglishFlavorText = () => {
    if (!species) return '';
    const englishEntry = species.flavor_text_entries.find(
      entry => entry.language.name === 'en'
    );
    return englishEntry ? englishEntry.flavor_text.replace(/\f/g, ' ') : '';
  };
  
  if (loading) {
    return <PokemonLoader />;
  }
  
  if (!pokemon || !species) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-white">
        <h2 className="text-2xl">Pokémon not found</h2>
        <Link to="/" className="text-white hover:text-red-200 mt-4 inline-block">
          Return to Pokédex
        </Link>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen `}>
      
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center text-white hover:text-red-200 mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2" />
          Back to Pokédex
        </Link>

        <div className="bg-white/95 rounded-3xl shadow-2xl overflow-hidden">
          <div className={`z-20 bg-gradient-to-br p-8 ${pokemon ? getTypeGradient(pokemon.types) : 'from-red-500 to-red-600'} `}>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/3">
                <img
                  src={pokemon.sprites.other['official-artwork'].front_default}
                  alt={pokemon.name}
                  className="w-full h-auto max-w-[300px] mx-auto drop-shadow-2xl"
                />
              </div>
              <div className="md:w-2/3 text-black">
                <div className="flex items-baseline gap-4">
                  <h1 className="text-4xl md:text-5xl font-bold capitalize">
                    {pokemon.name}
                  </h1>
                  <span className="text-2xl font-mono opacity-75">
                    #{String(pokemon.id).padStart(3, '0')}
                  </span>
                </div>
                <div className="flex gap-2 mt-4">
                  {pokemon.types.map((type) => (
                    <span
                      key={type.type.name}
                      className={`px-4 py-1 rounded-full text-sm font-semibold text-white shadow-md ${getTypeBackground(
                        type.type.name
                      )}`}
                    >
                      {type.type.name}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-black/90 italic">
                  {getEnglishFlavorText()}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gray-50 shadow-md rounded-2xl p-6">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                    <Heart className="text-red-500" />
                    Base Stats
                  </h2>
                  {pokemon.stats.map((stat) => (
                    <div key={stat.stat.name} className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="capitalize text-gray-700 font-medium">
                          {stat.stat.name.replace('-', ' ')}
                        </span>
                        <span className="font-mono">{stat.base_stat}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all duration-500"
                          style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 rounded-2xl shadow-md p-6">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                    <Zap className="text-yellow-500" />
                    Abilities
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {pokemon.abilities.map((ability) => (
                      <span
                        key={ability.ability.name}
                        className="px-4 py-2 bg-gradient-to-r from-red-100 to-red-50 rounded-full text-sm font-medium text-gray-700 shadow-sm"
                      >
                        {ability.ability.name.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl shadow-md p-6">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                    <Book className="text-purple-500" />
                    Species Details
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <h3 className="font-bold text-gray-600 mb-2">Generation</h3>
                      <p className="text-lg capitalize">{species.generation.name.replace('-', ' ')}</p>
                    </div>
                    {species.habitat && (
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <h3 className="font-bold text-gray-600 mb-2">Habitat</h3>
                        <p className="text-lg capitalize">{species.habitat.name}</p>
                      </div>
                    )}
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <h3 className="font-bold text-gray-600 mb-2">Color</h3>
                      <p className="text-lg capitalize">{species.color.name}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <h3 className="font-bold text-gray-600 mb-2">Growth Rate</h3>
                      <p className="text-lg capitalize">{species.growth_rate.name.replace('-', ' ')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl shadow-md p-6">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                    <Shield className="text-blue-500" />
                    Physical Characteristics
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                      <h3 className="font-bold text-gray-600 mb-1">Height</h3>
                      <p className="text-2xl font-mono">{(pokemon.height / 10).toFixed(1)}m</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                      <h3 className="font-bold text-gray-600 mb-1">Weight</h3>
                      <p className="text-2xl font-mono">{(pokemon.weight / 10).toFixed(1)}kg</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl shadow-md p-6">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                    <Egg className="text-pink-500" />
                    Breeding
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-gray-600 mb-2">Egg Groups</h3>
                      <div className="flex flex-wrap gap-2">
                        {species.egg_groups.map((group) => (
                          <span
                            key={group.name}
                            className="px-4 py-2 bg-gradient-to-r from-pink-100 to-pink-50 rounded-full text-sm font-medium text-gray-700 shadow-sm"
                          >
                            {group.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl shadow-md p-6">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                    <Scroll className="text-amber-500" />
                    Moves
                  </h2>
                  <div className="max-h-64 overflow-y-auto pr-2 space-y-2">
                    {pokemon.moves.slice(0, 10).map((moveData) => (
                      <div
                        key={moveData.move.name}
                        className="bg-white rounded-lg p-3 shadow-sm"
                      >
                        <div className="flex justify-between items-center">
                          <span className="capitalize font-medium text-gray-700">
                            {moveData.move.name.replace('-', ' ')}
                          </span>
                          <span className="text-sm text-gray-500">
                            Level {moveData.version_group_details[0]?.level_learned_at || '?'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl shadow-md p-6">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                    <Dices className="text-indigo-500" />
                    Battle Info
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <h3 className="font-bold text-gray-600 mb-2">Base Experience</h3>
                      <p className="text-2xl font-mono">{pokemon.base_experience}</p>
                    </div>
                    {pokemon.held_items.length > 0 && (
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <h3 className="font-bold text-gray-600 mb-2">Held Items</h3>
                        <div className="flex flex-wrap gap-2">
                          {pokemon.held_items.map((item) => (
                            <span
                              key={item.item.name}
                              className="text-sm bg-gray-100 px-2 py-1 rounded"
                            >
                              {item.item.name.replace('-', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {evolutionChain.length > 0 && (
              <div className="mt-8">
                <div className="bg-gray-50 rounded-2xl shadow-md p-6">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                    <GitBranch className="text-green-500" />
                    Evolution Chain
                  </h2>
                  <div className="flex flex-wrap justify-center items-center gap-4">
                    {evolutionChain.map((evo, index) => (
                      <React.Fragment key={evo.id}>
                        <Link
                          to={`/pokemon/${evo.id}`}
                          className={`group relative ${
                            evo.id.toString() === id ? 'ring-4 rounded-xl ring-red-500 ring-offset-2' : ''
                          }`}
                        >
                          <div className="bg-white rounded-xl p-4 shadow-md transition-transform transform hover:scale-105">
                            <img
                              src={evo.image}
                              alt={evo.name}
                              className="w-32 h-32 object-contain"
                            />
                            <p className="text-center mt-2 font-medium capitalize">{evo.name}</p>
                            <span className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs rounded-bl-lg rounded-tr-xl font-mono">
                              #{String(evo.id).padStart(3, '0')}
                            </span>
                          </div>
                        </Link>
                        {index < evolutionChain.length - 1 && (
                          <div className="text-gray-400">
                            <ArrowLeft className="rotate-180" />
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}