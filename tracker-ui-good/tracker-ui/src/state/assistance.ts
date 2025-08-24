export type AssistancePerDay = Array<{ day: number; items: Array<{ name: string; category: string }> }>;

export type AssistanceState = {
    assistance?: { perDay: AssistancePerDay };
};

export function setAssistancePerDay(prev: any, perDay: AssistancePerDay) {
    return { ...(prev || {}), assistance: { ...(prev?.assistance || {}), perDay } };
}
