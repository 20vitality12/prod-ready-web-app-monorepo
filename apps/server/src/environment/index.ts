import { stageType } from '@monolith/contracts'

const STAGE = process.env['STAGE'] as stageType
const IS_DEVELOP = process.env['STAGE'] as stageType === 'develop'
const PORT = Number(process.env['PORT']) || 3000

export const environment = {
	STAGE,
	IS_DEVELOP,
	PORT
}
