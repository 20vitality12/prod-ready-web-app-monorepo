import { environment } from '../environment'
import { Construct } from 'constructs'
import { Stack, StackProps } from 'aws-cdk-lib'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as rds from 'aws-cdk-lib/aws-rds'
import { StorageType } from 'aws-cdk-lib/aws-rds'

interface PostgresStackProps extends StackProps {
	vpc: ec2.Vpc;
}

export class PostgresStack extends Stack {
	public dbSecretArn: string
	public instanceIdentifier: string

	constructor(scope: Construct, id: string, { vpc }: PostgresStackProps) {
		super(scope, id)

		const { STAGE, COMPANY_NAME } = environment

		const subnetGroup = new rds.SubnetGroup(this, 'PostgresPublicSubnetGroup', {
			vpc,
			vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
			subnetGroupName: `${id}-public-subnet-group`,
			description: `rds postgres ${STAGE} public subnet group`,
		})
		const db = new rds.DatabaseInstance(this, 'PostgresDB', {
			vpc,
			engine: rds.DatabaseInstanceEngine.postgres({
				version: rds.PostgresEngineVersion.VER_15_2,
			}),
			subnetGroup,
			publiclyAccessible: true,
			autoMinorVersionUpgrade: false,
			storageType: StorageType.GP2,
			allocatedStorage: 20,
			maxAllocatedStorage: 100,
			credentials: rds.Credentials.fromGeneratedSecret(COMPANY_NAME, { secretName: `${STAGE}/postgres` }),
			instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),
			databaseName: 'postgres',
			multiAz: false,
			instanceIdentifier: `${COMPANY_NAME}-${environment.STAGE}-postgres`,
		})
		db.connections.allowDefaultPortFromAnyIpv4()
		this.dbSecretArn = db.secret!.secretFullArn!
		this.instanceIdentifier = db.instanceIdentifier
	}
}
