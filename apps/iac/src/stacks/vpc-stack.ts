import { environment } from '../environment'
import { Construct } from 'constructs'
import { CfnOutput, Stack } from 'aws-cdk-lib'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import { SubnetType } from 'aws-cdk-lib/aws-ec2'
import * as route53 from 'aws-cdk-lib/aws-route53'

export class VpcStack extends Stack {
	public vpc: ec2.Vpc
	public publicHostedZone: route53.IHostedZone

	constructor(scope: Construct, id: string) {
		super(scope, id)

		const { HOSTED_ZONE_ID: hostedZoneId, DOMAIN: zoneName } = environment

		this.vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 1, vpcName: id, natGateways: 0 })
		this.publicHostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'PublicHostedZone', {
			hostedZoneId,
			zoneName,
		})

		new CfnOutput(this, 'PublicSubnetIds', {
			value: this.vpc.selectSubnets({ subnetType: SubnetType.PUBLIC }).subnetIds.toString(),
		})
		new CfnOutput(this, 'VPCId', { value: this.vpc.vpcId })
	}
}
