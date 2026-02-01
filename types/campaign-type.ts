export interface CampaignType {
  id: string;
  name: string;
  color: string;
}

// Predefined color palette for campaign types
export const CAMPAIGN_TYPE_COLORS = [
  '#A7F3D0', // Mint green
  '#FECACA', // Soft red
  '#EDE9FE', // Lavender
  '#FEF3C7', // Cream yellow
  '#CFFAFE', // Light cyan
  '#FCE7F3', // Blush pink
  '#DBEAFE', // Sky blue
  '#FED7AA', // Peach
  '#D9F99D', // Lime
  '#FECDD3', // Rose (default)
] as const;

// Default campaign types (used when no types exist)
export const DEFAULT_CAMPAIGN_TYPES: CampaignType[] = [
  { id: 'image', name: 'Image', color: '#A7F3D0' },
  { id: 'sales', name: 'Sales', color: '#FECACA' },
];
