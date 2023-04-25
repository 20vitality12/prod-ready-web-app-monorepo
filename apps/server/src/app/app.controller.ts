import { Controller, Get, Logger } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
	private readonly logger = new Logger(AppController.name);

	constructor(private readonly appService: AppService) {
	}

	@Get()
	getData() {
		return this.appService.getData()
	}

	@Get('health')
	health() {
		return 'healthy'
	}
}
