import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { UsersRepository } from './repositories'

@Module({
	providers: [PrismaService, UsersRepository],
	exports: [PrismaService, UsersRepository],
})
export class PrismaModule {
}
