export interface Campaign {
  id: string;
  name: string;
  channelId: string;
  type: 'image' | 'sales';
  startDate: string | Date;
  endDate: string | Date;
  budgetPlanned?: number;
  budgetActual?: number;
}

export type CampaignFormData = Omit<Campaign, 'id'> & { id?: string };
