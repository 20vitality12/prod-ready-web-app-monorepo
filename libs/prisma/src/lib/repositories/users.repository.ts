import { Injectable } from '@nestjs/common'
import { Users, Prisma } from '@prisma/client'
import { PrismaService } from '../prisma.service'

@Injectable()
export class UsersRepository {
	constructor(private readonly prisma: PrismaService) {
	}

	private users = this.prisma.users

	async create(data: Prisma.UsersCreateInput): Promise<Users> {
		return this.users.create({ data })
	}

	async findAll(): Promise<Users[]> {
		return this.users.findMany({})
	}

	async findOne(id: string): Promise<Users | null> {
		return this.users.findFirst({ where: { id } })
	}

	async update(id: string, data: Prisma.UsersUpdateInput): Promise<Users> {
		return this.users.update({ data, where: { id } })
	}

	async remove(id: string): Promise<Users> {
		return this.users.delete({ where: { id } })
	}
}
