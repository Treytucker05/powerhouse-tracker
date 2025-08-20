import { useApp } from '@/context/AppContext';

export function useUserId(): string | null {
    const { user } = useApp();
    return user?.id ?? null;
}
