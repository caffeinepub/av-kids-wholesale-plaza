import { useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { OrderItem, CustomerDetails, OrderId } from '../backend';

export function usePlaceOrder() {
  const { actor } = useActor();

  return useMutation<OrderId, Error, { items: OrderItem[]; customer: CustomerDetails }>({
    mutationFn: async ({ items, customer }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.placeOrder(items, customer);
    },
  });
}
