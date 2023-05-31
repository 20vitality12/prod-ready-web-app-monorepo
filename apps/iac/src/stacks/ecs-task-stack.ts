import { environment } from '../environment'
import { Construct } from 'constructs'
import { CfnOutput, RemovalPolicy, Stack } from 'aws-cdk-lib'
import * as ecs from 'aws-cdk-lib/aws-ecs'
import * as ecr from 'aws-cdk-lib/aws-ecr'
import * as logs from 'aws-cdk-lib/aws-logs'
import * as iam from 'aws-cdk-lib/aws-iam'

export class EcsTaskStack extends Stack {
	constructor(scope: Construct, id: string) {
		super(scope, id)

		const { STAGE } = environment

		const taskDefinition = new ecs.FargateTaskDefinition(this, 'EcsTaskDef')
		const logGroup = new logs.LogGroup(this, 'LogGroup', {
			logGroupName: this.stackName,
			retention: logs.RetentionDays.ONE_MONTH,
			removalPolicy: RemovalPolicy.DESTROY,
		})
		const repository = new ecr.Repository(this, 'EcsTaskRepository', {
			repositoryName: id,
			lifecycleRules: [{ maxImageCount: 3 }],
			removalPolicy: RemovalPolicy.DESTROY,
			autoDeleteImages: true,
		})

		taskDefinition.addContainer('AppContainer', {
			containerName: 'app',
			image: ecs.ContainerImage.fromEcrRepository(repository, 'latest'),
			cpu: 256,
			memoryLimitMiB: 512,
			logging: new ecs.AwsLogDriver({ streamPrefix: id, logGroup }),
			environment: {
				STAGE,
			},
			secrets: {},
		})

		taskDefinition.taskRole.addToPrincipalPolicy(
			new iam.PolicyStatement({
				resources: ['*'],
				actions: ['*'],
				effect: iam.Effect.ALLOW,
			}),
		)

		new CfnOutput(this, 'EcsTaskArn', { value: taskDefinition.taskDefinitionArn })
		new CfnOutput(this, 'RepositoryName', { value: repository.repositoryName })
	}
}
