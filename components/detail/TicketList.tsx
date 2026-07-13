import type { Ticket } from '@/lib/api/types';
import { Text } from './Text';

export function TicketList({
  tickets,
  priceLabel,
  freeLabel,
}: {
  tickets: Ticket[];
  priceLabel: string;
  freeLabel: string;
}) {
  if (tickets.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-grayscale-700 px-4 py-3">
      <Text variant="body3Medium" className="text-grayscale-400">
        {priceLabel}
      </Text>
      {tickets.map((ticket) => (
        <div key={ticket.id} className="flex flex-row items-center justify-between">
          <Text variant="body3Regular" className="text-grayscale-300">
            {ticket.name}
          </Text>
          <Text variant="body1Medium" className="text-grayscale-0">
            {ticket.price ? `${ticket.price.toLocaleString('ko-KR')}원` : freeLabel}
          </Text>
        </div>
      ))}
    </div>
  );
}
