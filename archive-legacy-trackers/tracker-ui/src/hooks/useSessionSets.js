// Stub for useSessionSets hook
import { useQuery } from '@tanstack/react-query';

export default function useSessionSets(sessionId) {
  return useQuery({
    queryKey: ['sessionSets', sessionId],
    queryFn: () => Promise.resolve([]),
    enabled: Boolean(sessionId)
  });
}
