# How PizzaCoin Distribution Works

## Overview

PizzaCoins are **minted by the server** (contract owner) and **sent to each player's wallet**. Players do **not** sign anything—they receive tokens automatically.

## Flow

1. **Raid ends** (boss defeated or timer expires)
2. **Distribution is triggered** from:
   - `/api/raid/attack` when boss HP hits 0
   - `/api/raid/state` when timer expires
   - `/api/raid/distribute-rewards` when the Leaderboard is shown
3. **For each player:**
   - Server fetches their wallet address from **Privy API** (using `tag` = Privy user ID)
   - Server calls `mint(playerAddress, amount)` on the PizzaCoin contract
   - The **contract owner's private key** (in `.env`) signs the transaction
4. **Tokens appear** in the player's MetaMask/Privy wallet

## Who Signs?

| Role | Signs? | Purpose |
|------|--------|---------|
| **Contract owner** (server) | ✓ | Calls `mint()` — only the owner can mint |
| **Player** (MetaMask/Privy) | ✗ | Receives tokens; no signature needed |

The PizzaCoin contract has `onlyOwner` on `mint()`—so the user's wallet cannot mint. The server (as owner) mints **to** the user's address.

## Required Env Vars

```
PIZZACOIN_CONTRACT_ADDRESS=0x...   # Deployed contract
PIZZACOIN_OWNER_PRIVATE_KEY=0x... # Wallet that OWNS the contract (deployer)
PRIVY_APP_SECRET=...              # To fetch wallet addresses from Privy API
```

The `PIZZACOIN_OWNER_PRIVATE_KEY` must be the wallet that deployed the contract (the `owner` in the contract).

## Debugging

- **Leaderboard** now shows: "✓ X player(s) received PizzaCoins" or an error message
- **Server logs** (terminal): `[Privy] getUser failed` or `[PizzaCoin] mint failed` if something goes wrong
- **Common issues:**
  - Contract not deployed on Monad testnet (chain 10143)
  - Owner key doesn't match contract owner
  - Player has no wallet linked in Privy (e.g. email-only login)
  - PRIVY_APP_SECRET missing or wrong
