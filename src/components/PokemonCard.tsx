import React from 'react';
import { Pokemon } from '../types';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: () => void;
}

export function getTypeBackground(type: string): string {
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

export function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-red-200 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 rounded-bl-lg font-mono">
        #{String(pokemon.id).padStart(3, '0')}
      </div>
      
      <div className="relative z-10">
        <img
          src={pokemon.sprites.other['official-artwork'].front_default}
          alt={pokemon.name}
          className="w-full h-48 object-contain mb-4 transform transition-transform group-hover:scale-110"
        />
        <h2 className="text-2xl font-bold capitalize mb-3 text-center text-gray-800">
          {pokemon.name}
        </h2>
        <div className="flex gap-2 justify-center flex-wrap">
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
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/30 pointer-events-none rounded-2xl"></div>
    </div>
  );
}