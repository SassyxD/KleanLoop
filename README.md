#  KleanLoop - Plastic Recycling Platform

KleanLoop is a sustainable plastic recycling platform built for the PIM Inter Hackathon. It connects individuals who collect plastic waste with companies that need plastic credits for their sustainability goals.

##  Features

### For Personal Users
- **Sell Plastic**: Upload photos, get instant pricing, and schedule pickups
- **Reputation System**: Earn points and unlock higher tiers (Bronze → Silver → Gold → Platinum)
- **Real-time Notifications**: Track pickup status and rewards
- **Transaction History**: View all your sales and earnings

### For Corporate Users
- **Buy Plastic Credits**: Purchase verified recycling credits
- **Impact Tracking**: Monitor your sustainability impact
- **Certificate Generation**: Download official certificates for purchased credits
- **Cost Transparency**: See detailed breakdown of where your money goes

##  Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: tRPC, Elysia.js
- **Database**: SQLite with Prisma ORM
- **UI**: Custom components with mobile-first design

##  Design Theme

- **Primary**: Chrysler Chrome (#E8F4F8)
- **Secondary**: Empire Sky (#A8D8E8)
- **Accent**: Liberty Copper (#6FC7B6)
- **Success**: Central Green (#5A8F4F)

##  Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Initialize database
npm run db:push

# Seed database with mock data
npm run db:seed

# Run development server
npm run dev
```

##  Mock Accounts

### Personal Account
- **Email**: user@kleanloop.com
- **Password**: user123
- **Tier**: Bronze (100 points)

### Corporate Account
- **Email**: corp@company.com
- **Password**: corp123
- **Company**: บริษัท สีเขียว จำกัด

##  Navigation

- **Home**: Sustainability news, statistics, price board
- **Sell**: 4-step process to sell plastic (Personal users only)
- **Buy**: Purchase plastic credits (Corporate users only)
- **Notifications**: Real-time updates with filters
- **Profile**: User stats, tier progress, transaction history

##  Reputation Tiers

| Tier | Points | Min Weight | Price Multiplier | Priority |
|------|--------|------------|------------------|----------|
| 🥉 Bronze | 0-499 | 5 kg | 1.0x | Normal |
| 🥈 Silver | 500-1,999 | 3 kg | 1.1x | High |
| 🥇 Gold | 2,000-4,999 | 2 kg | 1.25x | Highest |
| 💎 Platinum | 5,000+ | 1 kg | 1.5x | VIP |

##  Pricing

### Selling (Personal → KleanLoop)
- **PET bottles**: 8-15 ฿/kg (avg: 12 ฿/kg)
- **HDPE**: 5-10 ฿/kg (avg: 8 ฿/kg)
- **LDPE/PP film**: 0-3 ฿/kg (avg: 1.5 ฿/kg)
- **Mixed/other**: 0 ฿/kg

### Buying (Corporate → Plastic Credits)
- **100 kg**: 25 ฿/credit (2,500 ฿ total)
- **500 kg**: 22 ฿/credit (11,000 ฿ total) - POPULAR
- **1,000 kg**: 20 ฿/credit (20,000 ฿ total)
- **Custom**: 25 ฿/credit

##  Database Schema

- **users**: User accounts (personal/corporate)
- **transactions**: Sale/purchase records
- **notifications**: Real-time alerts
- **credits**: Corporate credit purchases

##  Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run db:push    # Push Prisma schema to database
npm run db:studio  # Open Prisma Studio
npm run db:seed    # Seed database with mock data
```

##  License

MIT License - Built for PIM Inter Hackathon 2025

