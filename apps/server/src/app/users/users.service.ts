import { Injectable, Logger } from '@nestjs/common'
import { UsersRepository } from '@monolith/prisma'
import { Prisma, Users } from '@prisma/client'

@Injectable()
export class UsersService {
	private readonly logger = new Logger(UsersService.name)

	constructor(private readonly usersRepository: UsersRepository) {
	}

	async create(data: Prisma.UsersCreateInput): Promise<Users> {
		return this.usersRepository.create(data)
	}

	async findAll(): Promise<Users[]> {
		return this.usersRepository.findAll()
	}

	async findOne(id: string): Promise<Users> {
		return await this.usersRepository.findOne(id)
	}

	async update(id: string, data: Prisma.UsersUpdateInput): Promise<Users> {
		return this.usersRepository.update(id, data)
	}

	async remove(id: string): Promise<Users> {
		return this.usersRepository.remove(id)
	}
}
