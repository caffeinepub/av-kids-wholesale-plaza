import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ProductId } from '../backend';

export function useAdminProductMutations() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const addProduct = useMutation({
    mutationFn: async (data: { name: string; price: bigint; image: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addProduct(data.name, data.price, data.image, data.description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: ProductId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return { addProduct, deleteProduct };
}
