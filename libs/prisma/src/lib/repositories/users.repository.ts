import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Users, CreateUserDto, UpdateUserDto } from '@monolith/contracts'

@Injectable()
export class UsersRepository {
	constructor(private readonly prisma: PrismaService) {
	}

	private users = this.prisma.users

	async create(createUserDto: CreateUserDto): Promise<Users> {
		return this.users.create({ data: createUserDto })
	}

	async findAll(): Promise<Users[]> {
		return this.users.findMany({})
	}

	async findOne(id: string): Promise<Users | null> {
		return this.users.findFirst({
			where: { id },
		})
	}

	async update(id: string, updateUserDto: UpdateUserDto): Promise<Users> {
		return this.users.update({
			data: updateUserDto,
			where: { id },
		})
	}

	async remove(id: string): Promise<Users> {
		return this.users.delete({
			where: { id },
		})
	}
}
