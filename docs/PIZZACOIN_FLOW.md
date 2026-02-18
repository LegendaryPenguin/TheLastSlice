# Raid Rewards (1 MON pool)

## Overview

When a raid ends, **1 MON total** is distributed to players based on damage contribution. Each player receives `(their_damage / total_damage) * 1 MON` sent from your account (`PIZZACOIN_OWNER_PRIVATE_KEY`).

## Flow

1. Raid ends (boss defeated or timer expires)
2. When the Leaderboard is shown, the distribute API runs
3. For each player: fetch wallet address from Privy → send 0.1 MON from your account
4. Tokens appear in the player's wallet

## Required

- **PIZZACOIN_OWNER_PRIVATE_KEY** – Your wallet's private key (64 hex chars). Must have enough MON for gas + (0.1 MON × number of players).
- **PRIVY_APP_SECRET** – To fetch player wallet addresses from Privy API
- **PIZZACOIN_RPC_URL** (optional) – Defaults to `https://rpc.ankr.com/monad_testnet`
- **PIZZACOIN_CHAIN_ID** (optional) – Defaults to 10143 (Monad testnet)

## Idempotency

Add a `rewards_distributed` column to the `raids` table (boolean, default false) via Supabase Table Editor. This prevents duplicate distributions when the Leaderboard re-renders.

## Players need wallets

Players must have an Ethereum wallet linked in Privy. If they use "Continue as Guest", Privy must create an embedded wallet for them (check Privy dashboard: enable embedded wallets for guests).

If a player has no wallet, they are skipped (no error, just no MON sent).

## Guest accounts

If "Continue as Guest" fails to create an account, enable guest accounts in your [Privy Dashboard](https://dashboard.privy.io) → App Settings → Login methods.
