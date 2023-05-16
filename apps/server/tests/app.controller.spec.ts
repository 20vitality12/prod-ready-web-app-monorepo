import { Test, TestingModule } from '@nestjs/testing'

import { AppController } from '../src/app/app.controller'
import { AppService } from '../src/app/app.service'

describe('AppController', () => {
	let app: TestingModule

	beforeAll(async () => {
		app = await Test.createTestingModule({
			controllers: [AppController],
			providers: [AppService],
		}).compile()
	})

	describe('getData', () => {
		it('should return "Welcome to server!"', async () => {
			const appController = app.get<AppController>(AppController)
			const response = await appController.getData()
			expect(response.message).toEqual('Welcome to server!')
		})
	})
})
