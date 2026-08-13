import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, ArrowRight, Search, Activity, GitMerge, TrendingUp, ArrowUpRight } from 'lucide-react';
import { METRO_LINES, METRO_ROUTES, STATIONS, ALL_STATION_NAMES, normalizeString, calculateOptimalPath } from './lib/metro';
import { MetroTrainIcon } from './components/MetroTrainIcon';

type GameState = 'start' | 'playing' | 'result';

type PathEvent = {
  id: string;
  type: 'START' | 'BOARD' | 'ALIGHT';
  station: string;
  line: string | null;
  timeAdded: number;
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [startStation, setStartStation] = useState<string>('');
  const [targetStation, setTargetStation] = useState<string>('');
  const [optimalTime, setOptimalTime] = useState<number>(0);
  const [optimalTimeline, setOptimalTimeline] = useState<{ station: string; line: string | null; time: number; type: 'board' | 'travel' }[]>([]);
  
  // Game Play State
  const [events, setEvents] = useState<PathEvent[]>([]);
  const [currentStation, setCurrentStation] = useState<string>('');
  const [currentLine, setCurrentLine] = useState<string | null>(null);
  
  // Autocomplete state
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const initGame = () => {
    let a = ALL_STATION_NAMES[Math.floor(Math.random() * ALL_STATION_NAMES.length)];
    let b = ALL_STATION_NAMES[Math.floor(Math.random() * ALL_STATION_NAMES.length)];
    
    let attempts = 0;
    while ((a === b || STATIONS[a].some(l => STATIONS[b].includes(l))) && attempts < 100) {
      b = ALL_STATION_NAMES[Math.floor(Math.random() * ALL_STATION_NAMES.length)];
      attempts++;
    }
    
    setStartStation(a);
    setTargetStation(b);
    
    const { time, timeline } = calculateOptimalPath(a, b);
    setOptimalTime(time);
    setOptimalTimeline(timeline);
    
    setEvents([
      { id: 'ev-0', type: 'START', station: a, line: null, timeAdded: 0 }
    ]);
    setCurrentStation(a);
    setCurrentLine(null);
    setGameState('playing');
  };

  const handleBoardLine = (lineId: string) => {
    const isFirstBoarding = events.filter(e => e.type === 'BOARD').length === 0;
    const penalty = isFirstBoarding ? 0 : 4;
    
    setEvents(prev => [
      ...prev,
      { id: `ev-${prev.length}`, type: 'BOARD', station: currentStation, line: lineId, timeAdded: penalty }
    ]);
    setCurrentLine(lineId);
    setSearchQuery('');
    
    if (inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleAlight = (station: string) => {
    if (!currentLine) return;
    
    const route = METRO_ROUTES[currentLine];
    const startIndex = route.indexOf(currentStation);
    const endIndex = route.indexOf(station);
    const stops = Math.abs(startIndex - endIndex);
    const timeAdded = stops * 2;
    
    setEvents(prev => [
      ...prev,
      { id: `ev-${prev.length}`, type: 'ALIGHT', station, line: currentLine, timeAdded }
    ]);
    setCurrentStation(station);
    setCurrentLine(null);
    setSearchQuery('');
    
    if (station === targetStation) {
      setGameState('result');
    }
  };

  useEffect(() => {
    if (currentLine && searchQuery) {
      const normalizedQuery = normalizeString(searchQuery);
      const route = METRO_ROUTES[currentLine];
      const matches = route.filter(s => 
        s !== currentStation && 
        normalizeString(s).includes(normalizedQuery)
      );
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, currentLine, currentStation]);

  const playerTime = events.reduce((acc, ev) => acc + ev.timeAdded, 0);
  const score = Math.max(0, Math.round((optimalTime / playerTime) * 100));

  return (
    <div className="w-full h-full bg-white text-gray-800 flex justify-center font-sans overflow-hidden selection:bg-gray-200">
      <div className="w-full max-w-md h-full flex flex-col relative bg-white">

        {/* Header */}
        <header className="flex items-center px-6 pt-8 pb-4 shrink-0 relative h-20">
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
            <MetroTrainIcon className="h-7 w-auto" />
          </div>
          
          {gameState === 'playing' && (
            <div className="flex items-center gap-4 ml-auto z-10">
              <span className="text-sm font-mono text-gray-500">{playerTime} min</span>
              <button 
                onClick={() => setGameState('start')}
                className="text-[10px] uppercase font-bold tracking-widest text-gray-400 hover:text-gray-800 transition-colors"
              >
                Abandonner
              </button>
            </div>
          )}
        </header>

        <main className="flex-1 flex flex-col overflow-hidden relative">
          <AnimatePresence mode="wait">
            
            {/* START SCREEN */}
            {gameState === 'start' && (
              <motion.div 
                key="start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col p-6 h-full overflow-y-auto"
              >
                <div className="flex flex-col mb-auto pt-4">
                  <div className="inline-flex items-center gap-2 bg-[#F4F5F7] px-3 py-1.5 rounded-full w-fit mb-6">
                    <Activity className="w-3 h-3 text-emerald-600" />
                    <span className="text-xs font-medium text-gray-700">Le défi du métro</span>
                  </div>
                  
                  <h1 className="text-4xl leading-[1.1] font-medium text-gray-900 tracking-tight mb-5">
                    Trouvez le trajet optimal.
                  </h1>
                  
                  <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-[280px]">
                    Des milliers de combinaisons. Zéro carte. Entraînez votre mémoire du réseau.
                  </p>
                  
                  <button onClick={initGame} className="group flex items-center gap-2 text-emerald-600 font-medium text-sm hover:text-emerald-700 transition-colors w-fit">
                    Démarrer une partie <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>

                <div className="flex flex-col gap-3 mt-12 shrink-0 pb-6">
                  <div className="bg-[#F4F5F7] rounded-3xl p-6">
                    <div className="flex items-center gap-2 mb-6">
                       <MapPin className="w-4 h-4 text-emerald-600" />
                       <span className="text-xs font-medium text-gray-600">Stations du réseau</span>
                    </div>
                    <div className="text-5xl font-medium text-gray-900 tracking-tight mb-2">308</div>
                    <div className="text-sm text-gray-500">Accessibles dans Paris</div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-1 bg-[#F4F5F7] rounded-3xl p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <GitMerge className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-medium text-gray-600">Lignes</span>
                      </div>
                      <div className="text-3xl font-medium text-gray-900 tracking-tight mb-1">16</div>
                      <div className="text-[11px] text-gray-500">Métro RATP</div>
                    </div>
                    <div className="flex-1 bg-[#F4F5F7] rounded-3xl p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-medium text-gray-600">Score</span>
                      </div>
                      <div className="text-3xl font-medium text-gray-900 tracking-tight mb-1">/100</div>
                      <div className="text-[11px] text-gray-500">Efficacité visée</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PLAYING SCREEN */}
            {gameState === 'playing' && (
              <motion.div 
                key="playing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col p-6 h-full"
              >
                {/* Mission Info */}
                <div className="flex items-center justify-between mb-8 shrink-0 bg-white border border-gray-100 p-5 rounded-3xl shadow-sm gap-3">
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Départ</span>
                    <span className="font-medium text-sm text-gray-900 truncate block w-full" title={startStation}>{startStation}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
                  <div className="flex flex-col flex-1 items-end text-right min-w-0">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Arrivée</span>
                    <span className="font-medium text-sm text-gray-900 truncate block w-full" title={targetStation}>{targetStation}</span>
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex-1 overflow-y-auto flex flex-col gap-1 mb-6 relative pr-2">
                  {/* Vertical line connecting timeline events */}
                  <div className="absolute left-[11px] top-4 bottom-4 w-[2px] bg-gray-200 -z-10"></div>
                  
                  {events.map((ev, index) => {
                    const lineData = ev.line ? METRO_LINES[ev.line] : null;
                    return (
                      <div key={ev.id} className="flex items-center gap-4 py-2.5">
                         {ev.type === 'START' && (
                           <>
                             <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
                               <div className="w-2 h-2 rounded-full bg-white"></div>
                             </div>
                             <span className="text-sm font-medium text-gray-900 flex-1">{ev.station}</span>
                           </>
                         )}
                         {ev.type === 'BOARD' && lineData && (
                           <>
                             <div 
                               className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shadow-sm shrink-0"
                               style={{ backgroundColor: lineData.color, color: lineData.textColor }}
                             >
                               {lineData.name}
                             </div>
                             <span className="text-sm text-gray-500 flex-1">Ligne {ev.line}</span>
                             {ev.timeAdded > 0 && <span className="text-xs font-medium text-red-400">+{ev.timeAdded}m</span>}
                           </>
                         )}
                         {ev.type === 'ALIGHT' && (
                           <>
                             <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center shrink-0"></div>
                             <span className="text-sm font-medium text-gray-900 flex-1">{ev.station}</span>
                             <span className="text-xs font-medium text-gray-400">+{ev.timeAdded}m</span>
                           </>
                         )}
                      </div>
                    );
                  })}
                </div>

                {/* Action Area */}
                <div className="shrink-0 pt-4 pb-4 border-t border-gray-200 flex flex-col h-[35vh] min-h-[220px] max-h-[300px]">
                  {currentLine === null ? (
                    <div className="flex flex-col h-full">
                      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-4 text-center shrink-0">Sélectionnez une ligne</span>
                      <div className="flex flex-wrap gap-2 justify-center overflow-y-auto pb-2 pr-1">
                        {STATIONS[currentStation].map(l => {
                          const line = METRO_LINES[l];
                          return (
                            <button
                              key={l}
                              onClick={() => handleBoardLine(l)}
                              className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shadow-sm active:scale-95 transition-transform shrink-0"
                              style={{ backgroundColor: line.color, color: line.textColor }}
                            >
                              {line.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between mb-4 shrink-0">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm"
                            style={{ backgroundColor: METRO_LINES[currentLine].color, color: METRO_LINES[currentLine].textColor }}
                          >
                            {currentLine}
                          </div>
                          <span className="text-sm text-gray-500">Direction...</span>
                        </div>
                        <button onClick={() => setCurrentLine(null)} className="text-[10px] uppercase font-bold tracking-widest text-gray-400 hover:text-gray-800 transition-colors bg-gray-200/50 hover:bg-gray-200 px-3 py-1.5 rounded-full">
                          Retour
                        </button>
                      </div>
                      
                      <div className="relative mb-3 shrink-0">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                          <Search className="w-4 h-4 text-gray-300" />
                        </div>
                        <input
                          ref={inputRef}
                          type="text"
                          className="w-full bg-white border border-gray-100 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-gray-300 focus:ring-4 focus:ring-gray-100 transition-all placeholder:text-gray-300 shadow-sm"
                          placeholder="Nom de la station"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      
                      <div className="flex-1 overflow-y-auto flex flex-col gap-1 pr-1">
                        {suggestions.map(s => (
                          <button
                            key={s}
                            onClick={() => handleAlight(s)}
                            className="text-left px-4 py-3 text-sm font-medium hover:bg-white hover:shadow-sm rounded-xl transition-all active:scale-95 text-gray-700 truncate block w-full"
                          >
                            {s}
                          </button>
                        ))}
                        {searchQuery && suggestions.length === 0 && (
                          <div className="p-4 text-center text-xs text-gray-400">Aucune station trouvée</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* RESULT SCREEN */}
            {gameState === 'result' && (
              <motion.div 
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col p-6 text-center overflow-hidden h-full"
              >
                <div className="shrink-0 pt-2 mb-6">
                  <h2 className="text-xl font-light text-gray-900 mb-4">Mission accomplie</h2>
                  
                  <div className="mb-6">
                    <div className="text-[64px] font-light leading-none text-gray-900 tracking-tighter mb-1">{score}/100</div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Score d'efficacité</span>
                  </div>

                  <div className="flex justify-center gap-10 mb-2">
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-medium text-gray-900 mb-1">{playerTime}</span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Vos minutes</span>
                    </div>
                    <div className="w-[1px] h-10 bg-gray-200"></div>
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-medium text-gray-900 mb-1">{optimalTime}</span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Optimal</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-h-0 flex flex-col bg-white border border-gray-100 rounded-3xl p-5 shadow-sm mb-6">
                  <h3 className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-4 shrink-0 text-center">Trajet optimal</h3>
                  <div className="flex-1 overflow-y-auto flex flex-col gap-1 relative text-left pr-2">
                    <div className="absolute left-[11px] top-4 bottom-4 w-[2px] bg-gray-100 -z-10"></div>
                    {optimalTimeline.map((step, i) => {
                        const lineData = step.line ? METRO_LINES[step.line] : null;
                        return (
                          <div key={i} className="flex items-center gap-4 py-2">
                            {step.type === 'board' ? (
                              <>
                                <div 
                                   className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shadow-sm shrink-0"
                                   style={{ backgroundColor: lineData?.color, color: lineData?.textColor }}
                                >
                                   {lineData?.name}
                                </div>
                                <div className="flex flex-col min-w-0 flex-1">
                                  <span className="text-sm font-medium text-gray-900 truncate">{step.station}</span>
                                  <span className="text-[10px] text-gray-500 uppercase">Prendre Ligne {step.line}</span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shrink-0"></div>
                                <div className="flex flex-col min-w-0 flex-1">
                                  <span className="text-sm font-medium text-gray-900 truncate">{step.station}</span>
                                  <span className="text-[10px] text-gray-500 uppercase">Descendre</span>
                                </div>
                              </>
                            )}
                          </div>
                        )
                    })}
                  </div>
                </div>

                <button 
                  onClick={initGame}
                  className="shrink-0 px-8 py-4 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors shadow-sm flex items-center justify-center gap-3 text-sm font-medium active:scale-95 w-full max-w-[200px] mx-auto"
                >
                  Rejouer
                  <ArrowRight className="w-4 h-4 opacity-70" />
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
