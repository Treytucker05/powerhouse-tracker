// New consolidated packs loader (JSON stubs currently empty — populate JSON files under src/packs/*).
import schemesRaw from '@packs/schemes.json';
import templatesRaw from '@packs/templates.json';
import catalogsRaw from '@packs/catalogs.json';
import logicRaw from '@packs/logic.json';
import populationsRaw from '@packs/modifiers/populations.json';
import injuryRaw from '@packs/modifiers/injury.json';
import teenRaw from '@packs/modifiers/teen.json';
import sportIntegrationRaw from '@packs/modifiers/sport_integration.json';
import testingRaw from '@packs/testing.json';

export type JsonUnknown = unknown;

export const packs = {
    schemes: schemesRaw as JsonUnknown,
    templates: templatesRaw as JsonUnknown,
    catalogs: catalogsRaw as JsonUnknown,
    logic: logicRaw as JsonUnknown,
    modifiers: {
        populations: populationsRaw as JsonUnknown,
        injury: injuryRaw as JsonUnknown,
        teen: teenRaw as JsonUnknown,
        sportIntegration: sportIntegrationRaw as JsonUnknown
    },
    testing: testingRaw as JsonUnknown
} as const;

export const getSchemes = () => packs.schemes;
// Flexible accessor that tolerates nested shape (schemes.schemes[id]) or flat (schemes[id])
export const getScheme = (id: string) => {
    const root: any = packs.schemes as any;
    if (root && typeof root === 'object') {
        if (root.schemes && root.schemes[id]) return root.schemes[id];
        if (root[id]) return root[id];
    }
    return undefined;
};
export const getTemplates = () => packs.templates;
export const getCatalogs = () => packs.catalogs;
export const getLogic = () => packs.logic;
export const getModifiers = () => packs.modifiers;
export const getTesting = () => packs.testing;
