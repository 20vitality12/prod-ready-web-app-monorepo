import { ApiProperty } from '@nestjs/swagger'
import { Users as UsersModel } from '@prisma/client'

export class Users implements UsersModel {
	@ApiProperty()
	id: string

	@ApiProperty()
	email: string
}
