import { Injectable, Logger } from '@nestjs/common'
import { UsersRepository } from '@monolith/prisma'
import { Users, CreateUserDto, UpdateUserDto } from '@monolith/contracts'

@Injectable()
export class UsersService {
	private readonly logger = new Logger(UsersService.name)

	constructor(private readonly usersRepository: UsersRepository) {
	}

	async create(createUserDto: CreateUserDto): Promise<Users> {
		return this.usersRepository.create(createUserDto)
	}

	async findAll(): Promise<Users[]> {
		this.logger.log('findAll')
		return this.usersRepository.findAll()
	}

	async findOne(id: string): Promise<Users> {
		return await this.usersRepository.findOne(id)
	}

	async update(id: string, updateUserDto: UpdateUserDto): Promise<Users> {
		return this.usersRepository.update(id, updateUserDto)
	}

	async remove(id: string): Promise<Users> {
		return this.usersRepository.remove(id)
	}
}
