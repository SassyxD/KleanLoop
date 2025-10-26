export type UserTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'corporate';

export interface TierInfo {
  name: string;
  nameTH: string;
  icon: string;
  minPoints: number;
  maxPoints: number | null;
  minWeight: number;
  priceMultiplier: number;
  priority: string;
  color: string;
  gradient: string;
}

export const TIER_CONFIG: Record<UserTier, TierInfo> = {
  bronze: {
    name: 'Bronze',
    nameTH: 'ทองแดง',
    icon: '🥉',
    minPoints: 0,
    maxPoints: 499,
    minWeight: 5,
    priceMultiplier: 1.0,
    priority: 'Normal',
    color: '#CD7F32',
    gradient: 'from-amber-700 to-amber-900',
  },
  silver: {
    name: 'Silver',
    nameTH: 'เงิน',
    icon: '🥈',
    minPoints: 500,
    maxPoints: 1999,
    minWeight: 3,
    priceMultiplier: 1.1,
    priority: 'High',
    color: '#C0C0C0',
    gradient: 'from-gray-300 to-gray-500',
  },
  gold: {
    name: 'Gold',
    nameTH: 'ทอง',
    icon: '🥇',
    minPoints: 2000,
    maxPoints: 4999,
    minWeight: 2,
    priceMultiplier: 1.25,
    priority: 'Highest',
    color: '#FFD700',
    gradient: 'from-yellow-400 to-yellow-600',
  },
  platinum: {
    name: 'Platinum',
    nameTH: 'แพลตตินั่ม',
    icon: '💎',
    minPoints: 5000,
    maxPoints: null,
    minWeight: 1,
    priceMultiplier: 1.5,
    priority: 'VIP',
    color: '#E5E4E2',
    gradient: 'from-cyan-300 to-blue-500',
  },
  corporate: {
    name: 'Corporate',
    nameTH: 'องค์กร',
    icon: '🏢',
    minPoints: 0,
    maxPoints: null,
    minWeight: 0,
    priceMultiplier: 1.0,
    priority: 'Corporate',
    color: '#6FC7B6',
    gradient: 'from-accent-400 to-accent-600',
  },
};

export function getUserTier(points: number): UserTier {
  if (points >= TIER_CONFIG.platinum.minPoints) return 'platinum';
  if (points >= TIER_CONFIG.gold.minPoints) return 'gold';
  if (points >= TIER_CONFIG.silver.minPoints) return 'silver';
  return 'bronze';
}

export function getTierProgress(points: number): number {
  const tier = getUserTier(points);
  const tierInfo = TIER_CONFIG[tier];
  
  if (!tierInfo.maxPoints) return 100;
  
  const progress = ((points - tierInfo.minPoints) / (tierInfo.maxPoints - tierInfo.minPoints)) * 100;
  return Math.min(Math.max(progress, 0), 100);
}

export function getNextTier(currentTier: UserTier): TierInfo | null {
  const tiers: UserTier[] = ['bronze', 'silver', 'gold', 'platinum'];
  const currentIndex = tiers.indexOf(currentTier);
  
  if (currentIndex === -1 || currentIndex === tiers.length - 1) return null;
  
  return TIER_CONFIG[tiers[currentIndex + 1]];
}

export function getPointsToNextTier(points: number): number {
  const currentTier = getUserTier(points);
  const nextTier = getNextTier(currentTier);
  
  if (!nextTier) return 0;
  
  return nextTier.minPoints - points;
}
