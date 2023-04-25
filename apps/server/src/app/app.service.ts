import { Injectable, Logger } from '@nestjs/common'
import { uuid } from '@monolith/utils'

@Injectable()
export class AppService {
	private readonly logger = new Logger(AppService.name);

	async getData(): Promise<{ message: string, requestId: string }> {
		return { message: 'Welcome to server!', requestId: uuid() };
	}
}
