export const METRO_LINES: Record<string, { id: string; name: string; color: string; textColor: string }> = {
  "1": { id: "1", name: "1", color: "#FFCE00", textColor: "#000000" },
  "2": { id: "2", name: "2", color: "#0064B0", textColor: "#FFFFFF" },
  "4": { id: "4", name: "4", color: "#BE418D", textColor: "#FFFFFF" },
  "6": { id: "6", name: "6", color: "#79BB92", textColor: "#000000" },
  "7": { id: "7", name: "7", color: "#F5A3CB", textColor: "#000000" },
  "11": { id: "11", name: "11", color: "#8D5E2A", textColor: "#FFFFFF" },
  "14": { id: "14", name: "14", color: "#62259D", textColor: "#FFFFFF" },
};

export const METRO_ROUTES: Record<string, string[]> = {
  "1": ["La Défense", "Esplanade de La Défense", "Pont de Neuilly", "Les Sablons", "Porte Maillot", "Argentine", "Charles de Gaulle - Étoile", "George V", "Franklin D. Roosevelt", "Champs-Élysées - Clemenceau", "Concorde", "Tuileries", "Palais Royal - Musée du Louvre", "Louvre - Rivoli", "Châtelet", "Hôtel de Ville", "Saint-Paul", "Bastille", "Gare de Lyon", "Reuilly - Diderot", "Nation", "Porte de Vincennes", "Saint-Mandé", "Bérault", "Château de Vincennes"],
  "2": ["Porte Dauphine", "Victor Hugo", "Charles de Gaulle - Étoile", "Ternes", "Courcelles", "Monceau", "Villiers", "Rome", "Place de Clichy", "Blanche", "Pigalle", "Anvers", "Barbès - Rochechouart", "La Chapelle", "Stalingrad", "Jaurès", "Colonel Fabien", "Belleville", "Couronnes", "Ménilmontant", "Père Lachaise", "Philippe Auguste", "Alexandre Dumas", "Avron", "Nation"],
  "4": ["Porte de Clignancourt", "Simplon", "Marcadet - Poissonniers", "Château Rouge", "Barbès - Rochechouart", "Gare du Nord", "Gare de l'Est", "Château d'Eau", "Strasbourg - Saint-Denis", "Réaumur - Sébastopol", "Étienne Marcel", "Les Halles", "Châtelet", "Cité", "Saint-Michel", "Odéon", "Saint-Germain-des-Prés", "Saint-Sulpice", "Saint-Placide", "Montparnasse - Bienvenüe", "Vavin", "Raspail", "Denfert-Rochereau", "Mouton-Duvernet", "Alésia", "Porte d'Orléans", "Mairie de Montrouge", "Barbara", "Bagneux - Lucie Aubrac"],
  "6": ["Charles de Gaulle - Étoile", "Kléber", "Boissière", "Trocadéro", "Passy", "Bir-Hakeim", "Dupleix", "La Motte-Picquet - Grenelle", "Cambronne", "Sèvres - Lecourbe", "Pasteur", "Montparnasse - Bienvenüe", "Edgar Quinet", "Raspail", "Denfert-Rochereau", "Saint-Jacques", "Glacière", "Corvisart", "Place d'Italie", "Nationale", "Chevaleret", "Quai de la Gare", "Bercy", "Dugommier", "Daumesnil", "Bel-Air", "Picpus", "Nation"],
  "7": ["La Courneuve - 8 Mai 1945", "Fort d'Aubervilliers", "Aubervilliers - Pantin - Quatre Chemins", "Porte de la Villette", "Corentin Cariou", "Crimée", "Riquet", "Stalingrad", "Louis Blanc", "Château-Landon", "Gare de l'Est", "Poissonnière", "Cadet", "Le Peletier", "Chaussée d'Antin - La Fayette", "Opéra", "Pyramides", "Palais Royal - Musée du Louvre", "Pont Neuf", "Châtelet", "Pont Marie", "Sully - Morland", "Jussieu", "Place Monge", "Censier - Daubenton", "Les Gobelins", "Place d'Italie", "Tolbiac", "Maison Blanche", "Porte d'Italie", "Porte de Choisy", "Porte d'Ivry", "Pierre et Marie Curie", "Mairie d'Ivry"],
  "11": ["Châtelet", "Hôtel de Ville", "Rambuteau", "Arts et Métiers", "République", "Goncourt", "Belleville", "Pyrénées", "Jourdain", "Place des Fêtes", "Télégraphe", "Porte des Lilas", "Mairie des Lilas", "Serge Gainsbourg", "Romainville - Carnot", "Montreuil - Hôpital", "La Dhuys", "Coteaux Beauclair", "Rosny-Bois-Perrier"],
  "14": ["Saint-Denis - Pleyel", "Mairie de Saint-Ouen", "Saint-Ouen", "Porte de Clichy", "Pont Cardinet", "Saint-Lazare", "Madeleine", "Pyramides", "Châtelet", "Gare de Lyon", "Bercy", "Cour Saint-Émilion", "Bibliothèque François-Mitterrand", "Olympiades", "Maison Blanche", "Hôpital Bicêtre", "Villejuif - Gustave Roussy", "L'Haÿ-les-Roses", "Chevilly-Larue", "Thiais - Orly", "Aéroport d'Orly"]
};

// Derived map of Station Name -> Available Lines
export const STATIONS: Record<string, string[]> = {};
Object.entries(METRO_ROUTES).forEach(([lineId, stations]) => {
  stations.forEach(station => {
    if (!STATIONS[station]) {
      STATIONS[station] = [];
    }
    if (!STATIONS[station].includes(lineId)) {
      STATIONS[station].push(lineId);
    }
  });
});

export const ALL_STATION_NAMES = Object.keys(STATIONS);

export const normalizeString = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export type PathEvent = {
  station: string;
  line: string | null;
  time: number; // accumulated time at this step
  action: 'START' | 'BOARD' | 'ALIGHT';
  penalty?: number;
};

// Dijkstra implementation for optimal path
export function calculateOptimalPath(startStation: string, endStation: string) {
  const graph: Record<string, { to: string; weight: number; type: 'travel' | 'transfer', line?: string }[]> = {};
  
  const addEdge = (u: string, v: string, w: number, type: 'travel' | 'transfer', line?: string) => {
    if (!graph[u]) graph[u] = [];
    graph[u].push({ to: v, weight: w, type, line });
  };

  // Add transfer edges
  Object.entries(STATIONS).forEach(([stationName, lines]) => {
    lines.forEach(l1 => {
      lines.forEach(l2 => {
        if (l1 !== l2) {
          addEdge(`${stationName}|${l1}`, `${stationName}|${l2}`, 4, 'transfer');
        }
      });
    });
  });

  // Add travel edges
  Object.entries(METRO_ROUTES).forEach(([lineId, stations]) => {
    for (let i = 0; i < stations.length - 1; i++) {
      const u = `${stations[i]}|${lineId}`;
      const v = `${stations[i+1]}|${lineId}`;
      addEdge(u, v, 2, 'travel', lineId);
      addEdge(v, u, 2, 'travel', lineId);
    }
  });

  // Add dummy START and END nodes
  STATIONS[startStation].forEach(l => {
    addEdge('START', `${startStation}|${l}`, 0, 'transfer');
  });
  STATIONS[endStation].forEach(l => {
    addEdge(`${endStation}|${l}`, 'END', 0, 'transfer');
  });

  // Priority queue logic (basic implementation)
  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const unvisited = new Set<string>();

  Object.keys(graph).forEach(node => {
    dist[node] = Infinity;
    prev[node] = null;
    unvisited.add(node);
  });
  dist['START'] = 0;
  dist['END'] = Infinity;
  prev['END'] = null;
  unvisited.add('START');
  unvisited.add('END');

  while (unvisited.size > 0) {
    let u: string | null = null;
    for (const node of unvisited) {
      if (u === null || dist[node] < dist[u]) {
        u = node;
      }
    }

    if (u === null || dist[u] === Infinity) break;
    if (u === 'END') break;

    unvisited.delete(u);

    if (graph[u]) {
      for (const neighbor of graph[u]) {
        if (!unvisited.has(neighbor.to)) continue;
        const alt = dist[u] + neighbor.weight;
        if (alt < dist[neighbor.to]) {
          dist[neighbor.to] = alt;
          prev[neighbor.to] = u;
        }
      }
    }
  }

  const optimalTime = dist['END'];
  const path: string[] = [];
  let current: string | null | undefined = 'END';
  while (current) {
    path.unshift(current);
    current = prev[current];
  }

  // Build human readable timeline
  const timeline: { station: string; line: string | null; time: number; type: 'board' | 'travel' }[] = [];
  let runningTime = 0;
  
  if (path.length > 2) {
    for (let i = 1; i < path.length - 1; i++) {
      const [station, line] = path[i].split('|');
      const prevNode = path[i-1];
      const nextNode = path[i+1];
      
      if (prevNode === 'START') {
        timeline.push({ station, line, time: 0, type: 'board' });
      } else {
        const [prevStation, prevLine] = prevNode.split('|');
        if (prevStation === station && prevLine !== line) {
          runningTime += 4;
          timeline.push({ station, line, time: 4, type: 'board' });
        } else if (prevStation !== station) {
          runningTime += 2;
          // If the next step is a transfer or END, we alight here.
          // In this simplified visualization, we just show arrival if it's the end of a segment
          const isTransferNext = nextNode !== 'END' && nextNode.split('|')[0] === station;
          if (isTransferNext || nextNode === 'END') {
             timeline.push({ station, line, time: runningTime, type: 'travel' });
          }
        }
      }
    }
  }

  return { time: optimalTime, path, timeline };
}
