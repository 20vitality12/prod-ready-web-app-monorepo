import { Logger } from 'nestjs-pino'
import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { PrismaService } from '@monolith/prisma'
import { AppModule } from './app/app.module'
import { stageType } from '@monolith/contracts'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const prismaService = app.get(PrismaService)
	await prismaService.enableShutdownHooks(app)

	app.useLogger(app.get(Logger))

	const globalPrefix = 'api/v1'
	app.setGlobalPrefix(globalPrefix)
	const config = new DocumentBuilder()
		.setTitle('Monolith Api')
		.setDescription('Monolith')
		.setVersion('1')
		.build()
	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('swagger', app, document)

	const port = process.env.PORT || 3000
	await app.listen(port)

	if (process.env.STAGE as stageType === 'develop') {
		console.log(`App is running on: http://localhost:${port}/${globalPrefix}`)
	} else {
		console.log(`App is running on port: ${port}`)
	}
}

bootstrap()
