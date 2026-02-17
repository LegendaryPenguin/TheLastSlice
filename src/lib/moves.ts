export type Move = {
  id: number;
  name: string;
  cost: number;       // 0..100
  minDmg: number;
  maxDmg: number;
  critChance: number; // 0..1
  animType: "slash" | "fire" | "zap" | "bite" | "meteor" | "wave" | "spin" | "beam";
};

export const MOVES: Move[] = [
  { id: 1,  name: "Crust Cutter",      cost: 18, minDmg: 18, maxDmg: 28, critChance: 0.12, animType: "slash" },
  { id: 2,  name: "Sauce Splash",      cost: 14, minDmg: 12, maxDmg: 22, critChance: 0.10, animType: "wave" },
  { id: 3,  name: "Pineapple Pop",     cost: 22, minDmg: 20, maxDmg: 34, critChance: 0.13, animType: "spin" },
  { id: 4,  name: "Cheese Melt",       cost: 16, minDmg: 14, maxDmg: 26, critChance: 0.11, animType: "wave" },

  { id: 5,  name: "Pepperoni Pummel",  cost: 26, minDmg: 26, maxDmg: 40, critChance: 0.14, animType: "bite" },
  { id: 6,  name: "Oven Blast",        cost: 30, minDmg: 30, maxDmg: 46, critChance: 0.15, animType: "fire" },
  { id: 7,  name: "Neon Zest",         cost: 20, minDmg: 18, maxDmg: 30, critChance: 0.12, animType: "zap" },
  { id: 8,  name: "Garlic Grenade",    cost: 28, minDmg: 28, maxDmg: 44, critChance: 0.15, animType: "meteor" },

  { id: 9,  name: "Slice Spiral",      cost: 12, minDmg: 10, maxDmg: 18, critChance: 0.08, animType: "spin" },
  { id: 10, name: "Anchovy Beam",      cost: 34, minDmg: 34, maxDmg: 52, critChance: 0.16, animType: "beam" },
  { id: 11, name: "Dough Dropkick",    cost: 24, minDmg: 22, maxDmg: 36, critChance: 0.13, animType: "slash" },
  { id: 12, name: "Basil Barrage",     cost: 18, minDmg: 16, maxDmg: 28, critChance: 0.11, animType: "wave" },

  { id: 13, name: "Mozzarella Meteor", cost: 40, minDmg: 44, maxDmg: 70, critChance: 0.18, animType: "meteor" },
  { id: 14, name: "Hot Honey Hex",     cost: 32, minDmg: 32, maxDmg: 50, critChance: 0.16, animType: "fire" },
  { id: 15, name: "Carbonated Zap",    cost: 22, minDmg: 20, maxDmg: 34, critChance: 0.13, animType: "zap" },
  { id: 16, name: "Final Slice",       cost: 45, minDmg: 55, maxDmg: 85, critChance: 0.20, animType: "beam" },
];

export function pickFourRandomMoves(): Move[] {
  const copy = [...MOVES];
  // Fisher-Yates shuffle partial
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, 4);
}

export function getMoveById(id: number): Move | undefined {
  return MOVES.find((m) => m.id === id);
}
