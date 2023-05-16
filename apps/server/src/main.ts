import { environment } from './environment'
import { Logger } from 'nestjs-pino'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { PrismaService } from '@monolith/prisma'

const { STAGE, PORT } = environment
const globalPrefix = 'api/v1'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const prismaService = app.get(PrismaService)
	await prismaService.enableShutdownHooks(app)

	app.enableCors()
	app.useLogger(app.get(Logger))
	app.setGlobalPrefix(globalPrefix)

	await app.listen(PORT)
}

bootstrap()
	.then(() => STAGE === 'develop'
		? console.log(`App is running on: http://localhost:${PORT}/${globalPrefix}`)
		: console.log(`App is running on port: ${PORT}`))
