import { environment } from './environment'
import { ECS } from '@aws-sdk/client-ecs'

export const handler = async () => {
	const {
		STAGE,
		AWS_REGION,
		TASK_DEFINITION_ARN: taskDefinition,
		ECS_CLUSTER_ARN: cluster,
		ECS_SECURITY_GROUPS: securityGroups,
		ECS_SUBNET_IDS: subnets,
	} = environment

	const ecs: ECS = new ECS({ region: AWS_REGION })

	let response
	try {
		response = await ecs.runTask({
			cluster,
			taskDefinition,
			networkConfiguration: { awsvpcConfiguration: { securityGroups, subnets } },
			count: 1,
			launchType: 'FARGATE',
			overrides: {
				containerOverrides: [
					{
						name: 'app',
						environment: [
							{
								name: 'STAGE',
								value: STAGE,
							},
						],
					},
				],
			},
		})
	} catch (error: any) {
		console.error({ message: error.message, error })
	}
	return { statusCode: 200, body: JSON.stringify(response) }
}
