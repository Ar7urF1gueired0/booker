import { PrismaClient, Role, Status } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  await prisma.matchParticipant.deleteMany()
  await prisma.match.deleteMany()
  await prisma.tournamentRegistration.deleteMany()
  await prisma.tournament.deleteMany()
  await prisma.arena.deleteMany()
  await prisma.post.deleteMany()
  await prisma.userAchievement.deleteMany()
  await prisma.achievement.deleteMany()
  await prisma.user.deleteMany()

  const [camilaPassword, marcoPassword, adminPassword] = await Promise.all([
    bcrypt.hash('secret123', 10),
    bcrypt.hash('senhaSegura', 10),
    bcrypt.hash('senha_super_secreta', 10),
  ])

  const camila = await prisma.user.create({
    data: {
      fullName: 'Camila B.',
      email: 'camila@example.com',
      passwordHash: camilaPassword,
      role: Role.USER,
      gender: 'FEMALE',
      birthDate: new Date('1994-04-20'),
      locationCity: 'São Paulo',
      level: 'A',
    },
  })

  const marco = await prisma.user.create({
    data: {
      fullName: 'Marco S.',
      email: 'marco@example.com',
      passwordHash: marcoPassword,
      role: Role.USER,
      locationCity: 'Rio de Janeiro',
      level: 'B',
    },
  })

  const admin = await prisma.user.create({
    data: {
      fullName: 'Super Admin',
      email: 'admin@gotoplay.com',
      passwordHash: adminPassword,
      role: Role.ADMIN,
      level: 'PRO',
      locationCity: 'São José dos Campos',
    },
  })

  const arenaBeach = await prisma.arena.create({
    data: {
      name: 'Arena Beach Club',
      city: 'São Paulo',
      address: 'Av. Principal, 100',
      contactPhone: '+55 11 99999-1111',
    },
  })

  const arenaRio = await prisma.arena.create({
    data: {
      name: 'Rio Sands Arena',
      city: 'Rio de Janeiro',
      address: 'Rua Atlântica, 42',
      contactPhone: '+55 21 98888-2222',
    },
  })

  const copaBeach = await prisma.tournament.create({
    data: {
      name: 'Copa Beach 2025',
      arenaId: arenaBeach.id,
      startDate: new Date('2025-07-05T10:00:00.000Z'),
      endDate: new Date('2025-07-07T18:00:00.000Z'),
      registrationDeadline: new Date('2025-06-30T23:59:59.000Z'),
      categoryFilter: 'PRO',
      status: Status.SCHEDULED,
      createdById: admin.id,
    },
  })

  const summerClassic = await prisma.tournament.create({
    data: {
      name: 'Summer Classic 2025',
      arenaId: arenaRio.id,
      startDate: new Date('2025-08-15T09:00:00.000Z'),
      endDate: new Date('2025-08-17T20:00:00.000Z'),
      registrationDeadline: new Date('2025-08-10T23:59:00.000Z'),
      status: Status.OPEN,
      createdById: admin.id,
    },
  })

  const registration = await prisma.tournamentRegistration.create({
    data: {
      tournamentId: copaBeach.id,
      userId: camila.id,
      partnerId: marco.id,
    },
  })

  const match = await prisma.match.create({
    data: {
      arenaId: arenaRio.id,
      tournamentId: copaBeach.id,
      matchDate: new Date('2025-07-05T14:00:00.000Z'),
      status: Status.SCHEDULED,
    },
  })

  await prisma.matchParticipant.createMany({
    data: [
      { matchId: match.id, userId: camila.id, teamNumber: 1 },
      { matchId: match.id, userId: marco.id, teamNumber: 2 },
    ],
  })

  await prisma.post.create({
    data: {
      userId: camila.id,
      contentText: 'Preparada para a Copa Beach 2025! Vamos com tudo.',
    },
  })

  console.log({
    users: { camila, marco, admin },
    arenas: [arenaBeach, arenaRio],
    tournaments: [copaBeach, summerClassic],
    registration,
    match,
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
