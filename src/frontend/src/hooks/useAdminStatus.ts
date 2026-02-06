import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

export function useAdminStatus() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<boolean>({
    queryKey: ['isAdmin', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.isCallerAdmin();
      } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
    },
    enabled: !!actor && !!identity && !actorFetching,
    retry: false,
    staleTime: 0,
    refetchOnMount: true,
  });

  // Return a definitive state that distinguishes between "checking" and "checked"
  const isChecking = actorFetching || query.isLoading || query.isFetching;
  const hasChecked = !!actor && !!identity && query.isFetched;

  return {
    isAdmin: query.data || false,
    isLoading: isChecking,
    hasChecked,
    refetch: query.refetch,
  };
}
