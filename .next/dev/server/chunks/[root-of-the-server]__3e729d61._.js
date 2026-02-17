module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/supabaseServer.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabaseServer",
    ()=>supabaseServer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
function supabaseServer() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(("TURBOPACK compile-time value", "https://zdvqqimcjiwlswftbrmp.supabase.co"), process.env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
            persistSession: false
        }
    });
}
}),
"[project]/src/lib/utils.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clamp",
    ()=>clamp,
    "cleanName",
    ()=>cleanName,
    "isFiveDigits",
    ()=>isFiveDigits,
    "nowMs",
    ()=>nowMs
]);
function nowMs() {
    return Date.now();
}
function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
}
function isFiveDigits(tag) {
    return /^[0-9]{5}$/.test(tag);
}
function cleanName(s) {
    return s.trim().replace(/\s+/g, " ");
}
}),
"[project]/src/lib/moves.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MOVES",
    ()=>MOVES,
    "getMoveById",
    ()=>getMoveById,
    "pickFourRandomMoves",
    ()=>pickFourRandomMoves
]);
const MOVES = [
    {
        id: 1,
        name: "Crust Cutter",
        cost: 18,
        minDmg: 18,
        maxDmg: 28,
        critChance: 0.12,
        animType: "slash"
    },
    {
        id: 2,
        name: "Sauce Splash",
        cost: 14,
        minDmg: 12,
        maxDmg: 22,
        critChance: 0.10,
        animType: "wave"
    },
    {
        id: 3,
        name: "Pineapple Pop",
        cost: 22,
        minDmg: 20,
        maxDmg: 34,
        critChance: 0.13,
        animType: "spin"
    },
    {
        id: 4,
        name: "Cheese Melt",
        cost: 16,
        minDmg: 14,
        maxDmg: 26,
        critChance: 0.11,
        animType: "wave"
    },
    {
        id: 5,
        name: "Pepperoni Pummel",
        cost: 26,
        minDmg: 26,
        maxDmg: 40,
        critChance: 0.14,
        animType: "bite"
    },
    {
        id: 6,
        name: "Oven Blast",
        cost: 30,
        minDmg: 30,
        maxDmg: 46,
        critChance: 0.15,
        animType: "fire"
    },
    {
        id: 7,
        name: "Neon Zest",
        cost: 20,
        minDmg: 18,
        maxDmg: 30,
        critChance: 0.12,
        animType: "zap"
    },
    {
        id: 8,
        name: "Garlic Grenade",
        cost: 28,
        minDmg: 28,
        maxDmg: 44,
        critChance: 0.15,
        animType: "meteor"
    },
    {
        id: 9,
        name: "Slice Spiral",
        cost: 12,
        minDmg: 10,
        maxDmg: 18,
        critChance: 0.08,
        animType: "spin"
    },
    {
        id: 10,
        name: "Anchovy Beam",
        cost: 34,
        minDmg: 34,
        maxDmg: 52,
        critChance: 0.16,
        animType: "beam"
    },
    {
        id: 11,
        name: "Dough Dropkick",
        cost: 24,
        minDmg: 22,
        maxDmg: 36,
        critChance: 0.13,
        animType: "slash"
    },
    {
        id: 12,
        name: "Basil Barrage",
        cost: 18,
        minDmg: 16,
        maxDmg: 28,
        critChance: 0.11,
        animType: "wave"
    },
    {
        id: 13,
        name: "Mozzarella Meteor",
        cost: 40,
        minDmg: 44,
        maxDmg: 70,
        critChance: 0.18,
        animType: "meteor"
    },
    {
        id: 14,
        name: "Hot Honey Hex",
        cost: 32,
        minDmg: 32,
        maxDmg: 50,
        critChance: 0.16,
        animType: "fire"
    },
    {
        id: 15,
        name: "Carbonated Zap",
        cost: 22,
        minDmg: 20,
        maxDmg: 34,
        critChance: 0.13,
        animType: "zap"
    },
    {
        id: 16,
        name: "Final Slice",
        cost: 45,
        minDmg: 55,
        maxDmg: 85,
        critChance: 0.20,
        animType: "beam"
    }
];
function pickFourRandomMoves() {
    const copy = [
        ...MOVES
    ];
    // Fisher-Yates shuffle partial
    for(let i = copy.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [
            copy[j],
            copy[i]
        ];
    }
    return copy.slice(0, 4);
}
function getMoveById(id) {
    return MOVES.find((m)=>m.id === id);
}
}),
"[project]/src/app/api/raid/attack/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabaseServer.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$moves$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/moves.ts [app-route] (ecmascript)");
;
;
;
;
const ENERGY_MAX = 100;
const ENERGY_REGEN_PER_SEC = 25; // 0->100 in 4 seconds
const CRIT_MULT = 1.2;
async function POST(req) {
    const sb = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"])();
    const body = await req.json();
    const raidCode = String(body.code || "").toUpperCase().trim();
    const playerId = String(body.playerId || "").trim();
    const moveId = Number(body.moveId);
    if (!raidCode || !playerId || !Number.isFinite(moveId)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Invalid attack payload."
        }, {
            status: 400
        });
    }
    const move = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$moves$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMoveById"])(moveId);
    if (!move) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "Invalid move."
    }, {
        status: 400
    });
    // Load raid
    const { data: raid, error: raidErr } = await sb.from("raids").select("*").eq("code", raidCode).single();
    if (raidErr || !raid) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "Raid not found."
    }, {
        status: 404
    });
    if (raid.status !== "live") return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "Raid not live."
    }, {
        status: 409
    });
    const now = new Date();
    // End check
    if (raid.ends_at && now.getTime() > new Date(raid.ends_at).getTime()) {
        // auto end
        await sb.from("raids").update({
            status: "ended"
        }).eq("id", raid.id);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Raid ended."
        }, {
            status: 409
        });
    }
    // Load player
    const { data: player, error: pErr } = await sb.from("players").select("*").eq("id", playerId).eq("raid_id", raid.id).single();
    if (pErr || !player) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "Player not found."
    }, {
        status: 404
    });
    // Compute regenerated energy
    const prevTs = new Date(player.energy_updated_at).getTime();
    const dtSec = Math.max(0, (now.getTime() - prevTs) / 1000);
    const regen = Math.floor(dtSec * ENERGY_REGEN_PER_SEC);
    const currentEnergy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["clamp"])(player.energy + regen, 0, ENERGY_MAX);
    if (currentEnergy < move.cost) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Not enough energy."
        }, {
            status: 429
        });
    }
    // Roll damage + crit
    const base = Math.floor(Math.random() * (move.maxDmg - move.minDmg + 1)) + move.minDmg;
    const crit = Math.random() < move.critChance;
    const dmg = crit ? Math.floor(base * CRIT_MULT) : base;
    const newEnergy = currentEnergy - move.cost;
    // Apply updates (simple sequential updates; good enough for v1)
    const newBossHp = Math.max(0, raid.boss_hp - dmg);
    const { error: attackErr } = await sb.from("attacks").insert({
        raid_id: raid.id,
        player_id: player.id,
        player_name: player.display_name,
        move_id: move.id,
        move_name: move.name,
        energy_cost: move.cost,
        damage: dmg,
        crit,
        anim_type: move.animType
    });
    if (attackErr) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: attackErr.message
    }, {
        status: 500
    });
    const { error: playerUpErr } = await sb.from("players").update({
        total_damage: player.total_damage + dmg,
        energy: newEnergy,
        energy_updated_at: now.toISOString(),
        last_attack_at: now.toISOString()
    }).eq("id", player.id);
    if (playerUpErr) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: playerUpErr.message
    }, {
        status: 500
    });
    // Update raid HP + possibly end
    const raidUpdate = {
        boss_hp: newBossHp
    };
    if (newBossHp === 0) raidUpdate.status = "ended";
    const { error: raidUpErr } = await sb.from("raids").update(raidUpdate).eq("id", raid.id);
    if (raidUpErr) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: raidUpErr.message
    }, {
        status: 500
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        ok: true,
        damage: dmg,
        crit,
        boss_hp: newBossHp,
        energy: newEnergy
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3e729d61._.js.map