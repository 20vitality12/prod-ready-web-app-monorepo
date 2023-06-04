import { environment } from './environment'
import * as cdk from 'aws-cdk-lib'
import {
	ClientStack,
	ClusterStack,
	LambdaStageSchedulerStack,
	PostgresStack,
	ServerStack,
	VpcStack,
	EcsTaskStack,
} from './stacks'

const { STACK_NAME_PREFIX: prefix, CLIENT_SUBDOMAIN, SERVER_SUBDOMAIN, IS_PRODUCTION, VPC_NAME } = environment

const app = new cdk.App()

const { vpc, publicHostedZone} = new VpcStack(app, VPC_NAME)

const { dbSecretArn, instanceIdentifier: dbId } = new PostgresStack(app, `${prefix}-postgres`, { vpc })

const { ecsCluster, ecsSecurityGroupId } = new ClusterStack(app, `${prefix}-ecs-cluster`, { vpc })

new ClientStack(app, `${prefix}-client`, { subdomain: CLIENT_SUBDOMAIN, publicHostedZone })

const { serverInfo } = new ServerStack(app, `${prefix}-server`, {
	subdomain: SERVER_SUBDOMAIN,
	dbSecretArn,
	ecsCluster,
	ecsSecurityGroupId,
	publicHostedZone
})

new EcsTaskStack(app, `${prefix}-ecs-task`)

!IS_PRODUCTION && new LambdaStageSchedulerStack(app, `${prefix}-lambda-stage-scheduler`, {
	dbId,
	serverInfo,
})
