import { X } from 'lucide-react';
import { Pokemon } from '../types';

interface PokemonModalProps {
  pokemon: Pokemon;
  onClose: () => void;
}

export function PokemonModal({ pokemon, onClose }: PokemonModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-8 relative shadow-2xl border-4 border-red-500">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
        >
          <X size={28} />
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 shadow-inner">
              <img
                src={pokemon.sprites.other['official-artwork'].front_default}
                alt={pokemon.name}
                className="w-full h-64 object-contain"
              />
            </div>
            <div className="mt-4 text-center">
              <span className="text-lg text-gray-600 font-mono">
                #{String(pokemon.id).padStart(3, '0')}
              </span>
            </div>
          </div>

          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold capitalize mb-4 text-gray-800">
              {pokemon.name}
            </h2>

            <div className="flex gap-2 mb-6">
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

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-2xl p-4">
                <h3 className="font-bold text-xl mb-3 text-gray-800">Base Stats</h3>
                {pokemon.stats.map((stat) => (
                  <div key={stat.stat.name} className="mb-3">
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

              <div className="bg-gray-50 rounded-2xl p-4">
                <h3 className="font-bold text-xl mb-3 text-gray-800">Abilities</h3>
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

              <div className="flex gap-8">
                <div className="flex-1 bg-gray-50 rounded-2xl p-4 text-center">
                  <h3 className="font-bold text-gray-800">Height</h3>
                  <p className="text-2xl font-mono mt-1">{(pokemon.height / 10).toFixed(1)}m</p>
                </div>
                <div className="flex-1 bg-gray-50 rounded-2xl p-4 text-center">
                  <h3 className="font-bold text-gray-800">Weight</h3>
                  <p className="text-2xl font-mono mt-1">{(pokemon.weight / 10).toFixed(1)}kg</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getTypeBackground(type: string): string {
  const backgrounds: Record<string, string> = {
    normal: 'bg-gray-500',
    fire: 'bg-gradient-to-r from-red-500 to-orange-500',
    water: 'bg-gradient-to-r from-blue-500 to-blue-400',
    electric: 'bg-gradient-to-r from-yellow-400 to-yellow-300',
    grass: 'bg-gradient-to-r from-green-500 to-green-400',
    ice: 'bg-gradient-to-r from-blue-300 to-blue-200',
    fighting: 'bg-gradient-to-r from-red-700 to-red-600',
    poison: 'bg-gradient-to-r from-purple-500 to-purple-400',
    ground: 'bg-gradient-to-r from-yellow-700 to-yellow-600',
    flying: 'bg-gradient-to-r from-blue-400 to-purple-300',
    psychic: 'bg-gradient-to-r from-pink-500 to-pink-400',
    bug: 'bg-gradient-to-r from-green-600 to-green-500',
    rock: 'bg-gradient-to-r from-yellow-800 to-yellow-700',
    ghost: 'bg-gradient-to-r from-purple-700 to-purple-600',
    dragon: 'bg-gradient-to-r from-purple-600 to-indigo-600',
    dark: 'bg-gradient-to-r from-gray-800 to-gray-700',
    steel: 'bg-gradient-to-r from-gray-400 to-gray-300',
    fairy: 'bg-gradient-to-r from-pink-400 to-pink-300',
  };

  return backgrounds[type] || 'bg-gray-500';
}