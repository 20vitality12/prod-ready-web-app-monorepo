import { stageType } from '@monolith/contracts'

const STAGE = process.env['STAGE'] as stageType
const IS_DEVELOP = process.env['STAGE'] as stageType === 'develop'

export const environment = {
	STAGE,
	IS_DEVELOP
}
