import { Module, RequestMethod } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from '@monolith/prisma'
import { LoggerModule } from 'nestjs-pino'
import { environment } from '../environment'
import { UsersController, UsersModule, UsersService } from './users'

@Module({
	imports: [
		LoggerModule.forRoot({
			pinoHttp: environment.IS_LOCAL
				? {
					transport: {
						target: 'pino-pretty',
						options: {
							colorize: true,
							levelFirst: true,
						},
					},
				}
				: {},
			exclude: [{ method: RequestMethod.ALL, path: 'api/v1/health' }],
		}),
		PrismaModule,
		UsersModule
	],
	controllers: [
		AppController,
		UsersController
	],
	providers: [
		AppService,
		UsersService
	],
})
export class AppModule {
}
