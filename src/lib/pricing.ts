export type PlasticType = 'PET' | 'HDPE' | 'LDPE' | 'PP' | 'mixed';

export interface PlasticPrice {
  type: PlasticType;
  name: string;
  nameTH: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  color: string;
  description: string;
}

export const PLASTIC_PRICES: Record<PlasticType, PlasticPrice> = {
  PET: {
    type: 'PET',
    name: 'PET Bottles',
    nameTH: 'ขวดพลาสติก PET',
    minPrice: 8,
    maxPrice: 15,
    avgPrice: 12,
    color: '#3B82F6',
    description: 'ขวดน้ำดื่ม ขวดน้ำอัดลม',
  },
  HDPE: {
    type: 'HDPE',
    name: 'HDPE Plastic',
    nameTH: 'พลาสติก HDPE',
    minPrice: 5,
    maxPrice: 10,
    avgPrice: 8,
    color: '#10B981',
    description: 'ขวดนม ขวดแชมพู กระปุกโลชั่น',
  },
  LDPE: {
    type: 'LDPE',
    name: 'LDPE/PP Film',
    nameTH: 'ถุงพลาสติก',
    minPrice: 0,
    maxPrice: 3,
    avgPrice: 1.5,
    color: '#F59E0B',
    description: 'ถุงพลาสติก ฟิล์มห่อของ',
  },
  PP: {
    type: 'PP',
    name: 'PP Plastic',
    nameTH: 'พลาสติก PP',
    minPrice: 2,
    maxPrice: 6,
    avgPrice: 4,
    color: '#8B5CF6',
    description: 'ฝาขวด กล่องอาหาร',
  },
  mixed: {
    type: 'mixed',
    name: 'Mixed Plastic',
    nameTH: 'พลาสติกผสม',
    minPrice: 0,
    maxPrice: 0,
    avgPrice: 0,
    color: '#6B7280',
    description: 'พลาสติกหลายประเภทปะปน',
  },
};

export function detectPlasticType(imageUrl: string): PlasticType {
  // Mock AI detection - in production, this would call an ML model
  const types: PlasticType[] = ['PET', 'HDPE', 'LDPE', 'PP'];
  return types[Math.floor(Math.random() * types.length)];
}

export function calculatePrice(
  plasticType: PlasticType,
  weight: number,
  tierMultiplier: number = 1.0
): {
  basePrice: number;
  tierBonus: number;
  serviceFee: number;
  total: number;
} {
  const plasticInfo = PLASTIC_PRICES[plasticType];
  const basePrice = plasticInfo.avgPrice * weight;
  const tierBonus = basePrice * (tierMultiplier - 1);
  const serviceFee = 5; // Fixed service fee
  const total = basePrice + tierBonus - serviceFee;

  return {
    basePrice,
    tierBonus,
    serviceFee,
    total: Math.max(total, 0),
  };
}

export const SERVICE_FEE = 5;

export interface CreditPackage {
  id: string;
  name: string;
  nameTH: string;
  amount: number;
  pricePerCredit: number;
  totalPrice: number;
  savings?: number;
  popular?: boolean;
}

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: '100kg',
    name: '100 kg Package',
    nameTH: 'แพ็คเกจ 100 กิโลกรัม',
    amount: 100,
    pricePerCredit: 25,
    totalPrice: 2500,
  },
  {
    id: '500kg',
    name: '500 kg Package',
    nameTH: 'แพ็คเกจ 500 กิโลกรัม',
    amount: 500,
    pricePerCredit: 22,
    totalPrice: 11000,
    savings: 1500,
    popular: true,
  },
  {
    id: '1000kg',
    name: '1000 kg Package',
    nameTH: 'แพ็คเกจ 1,000 กิโลกรัม',
    amount: 1000,
    pricePerCredit: 20,
    totalPrice: 20000,
    savings: 5000,
  },
];

export interface CostBreakdown {
  logistics: number;
  householdReward: number;
  sorting: number;
  disposal: number;
  admin: number;
  margin: number;
}

export function getCreditCostBreakdown(pricePerCredit: number): CostBreakdown {
  return {
    logistics: 8,
    householdReward: 3,
    sorting: 2,
    disposal: 2,
    admin: 3,
    margin: pricePerCredit - 18,
  };
}
