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

- **Frontend**: Next.js 15.5.6, React, TypeScript
- **Styling**: Tailwind CSS 3.4, Framer Motion 11
- **Backend**: tRPC v11 + React Query
- **Database**: PostgreSQL (Neon) with Prisma 6 ORM
- **UI**: Custom components with mobile-first design
- **Auth**: Cookie-based sessions

##  Design Theme

- **Primary**: Chrysler Chrome (#E8F4F8)
- **Secondary**: Empire Sky (#A8D8E8)
- **Accent**: Liberty Copper (#6FC7B6)
- **Success**: Central Green (#5A8F4F)

##  Installation

```bash
# Clone repository
git clone https://github.com/SassyxD/KleanLoop.git
cd KleanLoop

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env and add your Neon PostgreSQL connection string

# Run database migrations
npx prisma migrate dev --name init

# Seed database with mock data
npx prisma db seed

# Run development server
npm run dev
```

**Database Setup:**
1. Create free PostgreSQL database at https://console.neon.tech
2. Copy connection string to `.env` file
3. Run migrations and seed data

##  Mock Accounts

### Personal Account
- **Email**: user@kleanloop.com
- **Password**: password123
- **Tier**: Bronze (100 points)

### Corporate Account
- **Email**: corp@company.com
- **Password**: password123
- **Company**: บริษัท สีเขียว จำกัด

### Admin Panel
- **URL**: /admin/login
- **Username**: admin
- **Password**: admin123

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
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open Prisma Studio
npx prisma db seed   # Seed database with mock data
npx prisma migrate dev  # Run database migrations
```

##  Deployment to Vercel

1. **Push to GitHub**
```bash
git push origin main
```

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   
3. **Add Environment Variables**
   - `DATABASE_URL`: Your Neon PostgreSQL connection string
   - `NODE_ENV`: production
   - `NEXT_PUBLIC_APP_URL`: Your Vercel domain

4. **Deploy!** 🚀

##  Features

### For Personal Users
- **Sell Plastic**: 4-step process - Upload photos, select material type, confirm, get notification
- **Reputation System**: Auto-upgrade tiers based on points (Bronze → Silver → Gold → Platinum)
- **Real-time Notifications**: Track transaction status and tier upgrades
- **Transaction History**: View all sales and earnings

### For Corporate Users
- **Buy Plastic Credits**: Purchase verified recycling credits with packages
- **Impact Tracking**: Monitor your sustainability contribution
- **Certificate Generation**: Download official certificates (PDF)
- **Cost Transparency**: Detailed breakdown with transaction fees

### For Admin
- **Transaction Approval**: Approve/reject pending sell orders
- **Monitor Purchases**: Track corporate credit purchases
- **Database Management**: Reset database with fresh seed data

##  License

MIT License - Built for PIM Inter Hackathon 2025

