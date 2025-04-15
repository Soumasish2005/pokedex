import React from 'react';

export function PokemonLoader() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white/90 rounded-3xl p-8 max-w-md mx-auto backdrop-blur-sm shadow-xl border-8 border-red-500">
        <div className="relative mb-6">
          {/* Pokéball top */}
          <div className="w-32 h-32 mx-auto relative">
            <div className="absolute inset-0 border-8 border-gray-800 rounded-full animate-spin">
              <div className="absolute inset-0 bg-gradient-to-b from-red-600 to-red-500 rounded-t-full h-1/2" />
              <div className="absolute inset-0 bg-white rounded-b-full h-1/2 top-1/2" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-white rounded-full border-8 border-gray-800 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Loading text */}
        <div className="space-y-4">
          <div className="h-4 bg-red-200 rounded-full w-3/4 mx-auto animate-pulse" />
          <div className="h-4 bg-red-200 rounded-full w-1/2 mx-auto animate-pulse" />
        </div>
        
        {/* Blinking lights */}
        <div className="flex justify-center gap-3 mt-6">
          <div className="w-4 h-4 rounded-full bg-blue-400 animate-[pulse_1s_ease-in-out_infinite]" />
          <div className="w-4 h-4 rounded-full bg-red-400 animate-[pulse_1s_ease-in-out_0.2s_infinite]" />
          <div className="w-4 h-4 rounded-full bg-yellow-400 animate-[pulse_1s_ease-in-out_0.4s_infinite]" />
        </div>
      </div>
    </div>
  );
}