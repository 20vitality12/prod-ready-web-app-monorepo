import { stageType } from '@monolith/contracts'

const IS_DEVELOP = process.env['STAGE'] as stageType === 'develop'

const STAGE = process.env['STAGE'] as stageType
if (!STAGE) throw new Error('STAGE is undefined')

const AWS_REGION = process.env['AWS_REGION']
if (!AWS_REGION) throw new Error('AWS_REGION is undefined')

const TASK_DEFINITION_ARN = process.env['TASK_DEFINITION_ARN']
if (!TASK_DEFINITION_ARN) throw new Error('TASK_DEFINITION_ARN is undefined')

const ECS_CLUSTER_ARN = process.env['ECS_CLUSTER_ARN']
if (!ECS_CLUSTER_ARN) throw new Error('ECS_CLUSTER_ARN is undefined')

const ECS_SECURITY_GROUPS = process.env['ECS_SECURITY_GROUPS']
if (!ECS_SECURITY_GROUPS) throw new Error('ECS_SECURITY_GROUPS is undefined')

const ECS_SUBNET_IDS = process.env['ECS_SUBNET_IDS']
if (!ECS_SUBNET_IDS) throw new Error('ECS_SUBNET_IDS is undefined')

export const environment = {
	IS_DEVELOP,
	STAGE,
	AWS_REGION,
	TASK_DEFINITION_ARN,
	ECS_CLUSTER_ARN,
	ECS_SECURITY_GROUPS: ECS_SECURITY_GROUPS.split(','),
	ECS_SUBNET_IDS: ECS_SUBNET_IDS.split(','),
}
