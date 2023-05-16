import { Injectable, Logger } from '@nestjs/common'
import { uuid } from '@monolith/utils'

@Injectable()
export class AppService {
	private readonly logger = new Logger(AppService.name);

	async getData(): Promise<{ message: string, requestId: string }> {
		const response = { message: 'Welcome to server!', requestId: uuid() }
		this.logger.log(response)
		return response
	}
}
