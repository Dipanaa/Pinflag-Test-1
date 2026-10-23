export interface ColisionRegla {
  id: string;
  name: string;
  priority: number;
  targetCourier: string;
  shippingCostOverride: number | null;
  discardReason: string;
}



