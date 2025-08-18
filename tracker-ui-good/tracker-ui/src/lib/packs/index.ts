// Packs index: import JSON data packs (placeholders). Replace contents with real JSON (no comments) copied from root methodology.
// IMPORTANT: Do not mutate runtime-loaded objects; treat as read-only.

// Schemes
import scheme_531 from '../../methodology/packs/scheme.531.json';
import scheme_351 from '../../methodology/packs/scheme.351.json';
import scheme_5spro from '../../methodology/packs/scheme.5spro.json';

// Templates
import bbb from '../../methodology/packs/template.bbb.json';
import triumvirate from '../../methodology/packs/template.triumvirate.json';
import periodization_bible from '../../methodology/packs/template.periodization_bible.json';
import bodyweight from '../../methodology/packs/template.bodyweight.json';
import jackshit from '../../methodology/packs/template.jackshit.json';

// Catalogs
import assistance from '../../methodology/packs/assistance.catalog.json';
import warmups from '../../methodology/packs/warmups.catalog.json';
import conditioning from '../../methodology/packs/conditioning.schema.json';

// Logic
import deload_stall from '../../methodology/packs/deload_stall.json';
import leader_anchor from '../../methodology/packs/leader_anchor.json';
import decision_tree from '../../methodology/packs/template_decision_tree.json';

// Modifiers
import populations from '../../methodology/packs/populations.mods.json';
import injury from '../../methodology/packs/injury_restart.json';
import teen from '../../methodology/packs/teen_progression.json';
import sport_integration from '../../methodology/packs/sport_integration.json';

// Testing / competition
import competition from '../../methodology/packs/competition_prep.json';
import testing from '../../methodology/packs/strength_testing.json';

export const packs = {
    schemes: { scheme_531, scheme_351, scheme_5spro },
    templates: { bbb, triumvirate, periodization_bible, bodyweight, jackshit },
    catalogs: { assistance, warmups, conditioning },
    logic: { deload_stall, leader_anchor, decision_tree },
    modifiers: { populations, injury, teen, sport_integration },
    testing: { competition, testing }
} as const;

export type PackIds = keyof typeof packs["templates"] | keyof typeof packs["schemes"];
export const getScheme = (id: keyof typeof packs["schemes"]) => packs.schemes[id];
export const getTemplate = (id: keyof typeof packs["templates"]) => packs.templates[id];

export type SchemePack = typeof scheme_531; // representative type inference
