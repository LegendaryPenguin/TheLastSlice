export type RaidStatus = "lobby" | "live" | "ended";

export type Raid = {
  id: string;
  code: string;
  status: RaidStatus;
  boss_name: string;
  boss_hp: number;
  boss_hp_max: number;
  duration_seconds: number;
  started_at: string | null;
  ends_at: string | null;
};

export type Player = {
  id: string;
  raid_id: string;
  first_name: string;
  last_name: string;
  tag: string;
  display_name: string;
  total_damage: number;
  energy: number;
  energy_updated_at: string;
  joined_at: string;
  last_attack_at: string | null;
};

export type Attack = {
  id: string;
  raid_id: string;
  player_id: string;
  player_name: string;
  move_id: number;
  move_name: string;
  energy_cost: number;
  damage: number;
  crit: boolean;
  anim_type: string;
  created_at: string;
};
