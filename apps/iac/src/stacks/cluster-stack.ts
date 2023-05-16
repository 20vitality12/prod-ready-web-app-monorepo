import { Construct } from 'constructs'
import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as ecs from 'aws-cdk-lib/aws-ecs'

interface ClusterStackProps extends StackProps {
	vpc: ec2.Vpc;
}

export class ClusterStack extends Stack {
	public ecsCluster: ecs.ICluster
	public ecsSecurityGroupId: string

	constructor(scope: Construct, id: string, { vpc }: ClusterStackProps) {
		super(scope, id)

		const ecsSecurityGroup = new ec2.SecurityGroup(this, 'ECSSecurityGroup', {
			vpc,
			securityGroupName: `${id}-ecs-sg`,
			description: 'main ecs security group',
		})
		this.ecsSecurityGroupId = ecsSecurityGroup.securityGroupId
		this.ecsCluster = new ecs.Cluster(this, 'Cluster', {
			vpc,
			clusterName: id,
		})

		new CfnOutput(this, 'ClusterName', { value: this.ecsCluster.clusterName })
		new CfnOutput(this, 'ECSSecurityGroupID', { value: this.ecsSecurityGroupId })
	}
}
