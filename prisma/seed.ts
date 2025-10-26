import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.credit.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.user.deleteMany();

  // Create Personal User
  const personalUser = await prisma.user.create({
    data: {
      email: 'user@kleanloop.com',
      password: 'user123', // In production, this should be hashed
      name: 'สมชาย ใจดี',
      type: 'personal',
      reputationPoints: 100,
      tier: 'bronze',
      avatar: '/avatars/default-user.png',
    },
  });

  console.log('✅ Created personal user:', personalUser.email);

  // Create Corporate User
  const corporateUser = await prisma.user.create({
    data: {
      email: 'corp@company.com',
      password: 'corp123', // In production, this should be hashed
      name: 'Admin User',
      companyName: 'บริษัท สีเขียว จำกัด',
      type: 'corporate',
      reputationPoints: 0,
      tier: 'corporate',
      avatar: '/avatars/default-company.png',
    },
  });

  console.log('✅ Created corporate user:', corporateUser.email);

  // Create sample transactions for personal user
  const transactions = await Promise.all([
    prisma.transaction.create({
      data: {
        userId: personalUser.id,
        type: 'sell',
        plasticType: 'PET',
        weight: 5.5,
        pricePerKg: 12,
        tierBonus: 0,
        serviceFee: 5,
        totalAmount: 61,
        status: 'completed',
        photoUrl: '/uploads/plastic-1.jpg',
      },
    }),
    prisma.transaction.create({
      data: {
        userId: personalUser.id,
        type: 'sell',
        plasticType: 'HDPE',
        weight: 3.2,
        pricePerKg: 8,
        tierBonus: 0,
        serviceFee: 5,
        totalAmount: 20.6,
        status: 'completed',
        photoUrl: '/uploads/plastic-2.jpg',
      },
    }),
    prisma.transaction.create({
      data: {
        userId: personalUser.id,
        type: 'sell',
        plasticType: 'PET',
        weight: 7.0,
        pricePerKg: 12,
        tierBonus: 0,
        serviceFee: 5,
        totalAmount: 79,
        status: 'pending',
        photoUrl: '/uploads/plastic-3.jpg',
      },
    }),
  ]);

  console.log(`✅ Created ${transactions.length} transactions`);

  // Create credits for corporate user
  const credits = await Promise.all([
    prisma.credit.create({
      data: {
        userId: corporateUser.id,
        amount: 500,
        pricePerCredit: 22,
        totalPrice: 11000,
        packageType: '500kg',
        certificateUrl: '/certificates/cert-001.pdf',
      },
    }),
    prisma.credit.create({
      data: {
        userId: corporateUser.id,
        amount: 1000,
        pricePerCredit: 20,
        totalPrice: 20000,
        packageType: '1000kg',
        certificateUrl: '/certificates/cert-002.pdf',
      },
    }),
  ]);

  console.log(`✅ Created ${credits.length} credit purchases`);

  // Create notifications for personal user
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        userId: personalUser.id,
        title: 'ยินดีต้อนรับสู่ KleanLoop! 🎉',
        description: 'เริ่มต้นขายพลาสติกรีไซเคิลและสะสมคะแนนได้เลยวันนี้',
        type: 'system',
        isRead: false,
      },
    }),
    prisma.notification.create({
      data: {
        userId: personalUser.id,
        title: 'การรับซื้อสำเร็จ ✅',
        description: 'PET 5.5 kg - ได้รับ 61 บาท',
        type: 'reward',
        isRead: true,
      },
    }),
    prisma.notification.create({
      data: {
        userId: personalUser.id,
        title: 'รอการรับสินค้า 🚚',
        description: 'พนักงานกำลังเดินทางไปรับของ ประมาณ 2-3 ชั่วโมง',
        type: 'pickup',
        isRead: false,
      },
    }),
  ]);

  console.log(`✅ Created ${notifications.length} notifications`);

  // Create notifications for corporate user
  const corpNotifications = await Promise.all([
    prisma.notification.create({
      data: {
        userId: corporateUser.id,
        title: 'ซื้อ Plastic Credits สำเร็จ ✅',
        description: 'ซื้อ 500 kg credits มูลค่า 11,000 บาท',
        type: 'system',
        isRead: false,
      },
    }),
    prisma.notification.create({
      data: {
        userId: corporateUser.id,
        title: 'ใบรับรองพร้อมแล้ว 📄',
        description: 'ดาวน์โหลดใบรับรอง 1,000 kg credits ได้แล้ว',
        type: 'system',
        isRead: false,
      },
    }),
  ]);

  console.log(`✅ Created ${corpNotifications.length} corporate notifications`);

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
