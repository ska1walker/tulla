export interface Branding {
  imageColor: string;
  salesColor: string;
  exportPrimaryColor?: string;
  exportAccentColor?: string;
  // Analytics chart colors
  positiveColor?: string;  // Under budget (good)
  negativeColor?: string;  // Over budget (bad)
}
