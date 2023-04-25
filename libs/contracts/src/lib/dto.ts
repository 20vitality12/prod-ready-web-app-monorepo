import { Prisma } from '@prisma/client'
import { ApiProperty, PartialType } from '@nestjs/swagger'

export class CreateUserDto implements Prisma.UsersCreateInput {
	@ApiProperty()
	email: string
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
}
