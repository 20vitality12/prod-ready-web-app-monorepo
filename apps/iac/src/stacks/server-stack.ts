import { environment } from '../environment'
import { Construct } from 'constructs'
import { CfnOutput, Stack } from 'aws-cdk-lib'
import * as cdk from 'aws-cdk-lib'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as ecs from 'aws-cdk-lib/aws-ecs'
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns'
import * as ecr from 'aws-cdk-lib/aws-ecr'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager'
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';
import * as ecrdeploy from 'cdk-ecr-deployment';
import * as path from 'path';

interface ServerStackProps {
	subdomain: string;
	dbSecretArn: string;
	ecsCluster: ecs.ICluster;
	ecsSecurityGroupId: string;
	publicHostedZone: route53.IHostedZone;
}

export class ServerStack extends Stack {
	public serverInfo: {
		serverClusterName: string;
		serverServiceName: string;
	}

	constructor(scope: Construct, id: string, {
		subdomain,
		dbSecretArn,
		ecsCluster,
		ecsSecurityGroupId,
		publicHostedZone
	}: ServerStackProps) {
		super(scope, id)

		const { STAGE, DOMAIN, IS_INITIAL_PROVISION } = environment

		const dbSecret = secretsmanager.Secret.fromSecretCompleteArn(this, 'DBSecret', dbSecretArn)

		const repository = new ecr.Repository(this, 'EcrRepository', {
			repositoryName: `${String(subdomain).replace('.', '-')}`,
			lifecycleRules: [{ maxImageCount: 3 }],
		})

		if (IS_INITIAL_PROVISION) {
			const image = new DockerImageAsset(this, 'Image', {
				directory: path.join(__dirname, '../../../../'),
				file: 'Dockerfile',
				buildArgs: {
					APP: 'server'
				},
				exclude: [
					'node_modules',
					'.git',
					'cdk.out'
				]
			});

			new ecrdeploy.ECRDeployment(this, 'DeployDockerImage', {
				src: new ecrdeploy.DockerImageName(image.imageUri),
				dest: new ecrdeploy.DockerImageName(`${repository.repositoryUri}:latest`),
			});
		}

		const containerPort = 3000
		const domainName = `${subdomain}.${DOMAIN}`
		const certificate = new acm.Certificate(this, 'Certificate', {
			domainName,
			validation: acm.CertificateValidation.fromDns(publicHostedZone),
		})
		const ecsSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(this, 'ECSSecurityGroup', ecsSecurityGroupId);
		const lbFargate = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'Service', {
			serviceName: id,
			cluster: ecsCluster,
			memoryLimitMiB: 512,
			cpu: 256,
			desiredCount: 1,
			minHealthyPercent: 50,
			maxHealthyPercent: 200,
			securityGroups: [ecsSecurityGroup],
			certificate,
			domainName,
			domainZone: publicHostedZone,
			redirectHTTP: true,
			taskImageOptions: {
				image: ecs.ContainerImage.fromEcrRepository(repository, 'latest'),
				enableLogging: true,
				containerPort,
				containerName: 'app',
				family: STAGE != 'production' ? `server-${STAGE}` : 'server',
				command: [
					'/bin/sh',
					'-c',
					'export DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:5432/${POSTGRES_DB} && node main.js',
				],
				environment: {
					STAGE,
					ECS_CLUSTER_ARN: ecsCluster.clusterArn,
					PORT: containerPort.toString(),
				},
				secrets: {
					POSTGRES_USER: ecs.Secret.fromSecretsManager(dbSecret, 'username'),
					POSTGRES_PASSWORD: ecs.Secret.fromSecretsManager(dbSecret, 'password'),
					POSTGRES_HOST: ecs.Secret.fromSecretsManager(dbSecret, 'host'),
					POSTGRES_DB: ecs.Secret.fromSecretsManager(dbSecret, 'dbname'),
				},
			},
			publicLoadBalancer: true,
		})

		lbFargate.taskDefinition.taskRole.addToPrincipalPolicy(
			new iam.PolicyStatement({
				resources: ['*'],
				actions: ['*'],
				effect: iam.Effect.ALLOW,
			}),
		)

		lbFargate.targetGroup.setAttribute('deregistration_delay.timeout_seconds', '5')
		lbFargate.targetGroup.configureHealthCheck({
			enabled: true,
			path: '/api/v1/health',
			healthyThresholdCount: 2,
			unhealthyThresholdCount: 2,
			timeout: cdk.Duration.seconds(5),
			interval: cdk.Duration.seconds(6),
		})

		this.serverInfo = {
			serverClusterName: lbFargate.cluster.clusterName,
			serverServiceName: lbFargate.service.serviceName,
		}

		new CfnOutput(this, 'RepositoryName', { value: repository.repositoryName })
		new CfnOutput(this, 'ServiceName', { value: lbFargate.service.serviceName })
		new CfnOutput(this, 'TaskFamilyName', { value: lbFargate.service.taskDefinition.family })
	}
}
