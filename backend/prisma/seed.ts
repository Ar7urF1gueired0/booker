import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Cria o Admin Mestre
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gotoplay.com' },
    update: {},
    create: {
      email: 'admin@gotoplay.com',
      fullName: 'Super Admin',
      passwordHash: 'senha_super_secreta_hash', // Em produção, use bcrypt aqui!
      role: 'ADMIN', // A mágica acontece aqui
      level: 'PRO'
    },
  })

  // Cria uma Arena de Exemplo
  const arena = await prisma.arena.create({
    data: {
      name: 'Arena Beach Club',
      city: 'São José dos Campos',
      address: 'Av. Principal, 100'
    }
  })

  console.log({ admin, arena })
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