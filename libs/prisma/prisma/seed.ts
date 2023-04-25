import { stageType } from '@monolith/contracts'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
	if (process.env.STAGE as stageType !== 'develop') return

	const alice = await prisma.users.upsert({
		where: { email: 'alice@prisma.io' },
		update: {},
		create: {
			email: 'alice@prisma.io',
		},
	})
	const bob = await prisma.users.upsert({
		where: { email: 'bob@prisma.io' },
		update: {},
		create: {
			email: 'bob@prisma.io',
		},
	})
	console.log({ alice, bob })
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
