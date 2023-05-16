import { Test } from '@nestjs/testing'

import { AppService } from '../src/app/app.service'

describe('AppService', () => {
	let service: AppService

	beforeAll(async () => {
		const app = await Test.createTestingModule({
			providers: [AppService],
		}).compile()

		service = app.get<AppService>(AppService)
	})

	describe('getData', () => {
		it('should return "Welcome to server!"', async () => {
			const response = await service.getData()
			expect(response.message).toEqual('Welcome to server!')
		})
	})
})
