import { environment } from '../environment'
import { Construct } from 'constructs'
import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as targets from 'aws-cdk-lib/aws-route53-targets'

interface ClientStackProps extends StackProps {
	subdomain: string;
	publicHostedZone: route53.IHostedZone;
}

export class ClientStack extends Stack {
	constructor(scope: Construct, id: string, { subdomain, publicHostedZone }: ClientStackProps) {
		super(scope, id)

		const { DOMAIN } = environment
		const domainName = `${subdomain}.${DOMAIN}`
		const clientBucket = new s3.Bucket(this, 'Bucket', {
			websiteIndexDocument: 'index.html',
			cors: [
				{
					allowedMethods: [
						s3.HttpMethods.GET,
					],
					allowedOrigins: ['*'],
					allowedHeaders: ['*'],
				},
			],
		})

		const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, 'OriginAccessIdentity')
		clientBucket.grantRead(originAccessIdentity)

		const clientCertificate = new acm.Certificate(this, 'Certificate', {
			domainName,
			validation: acm.CertificateValidation.fromDns(publicHostedZone),
		})
		const distribution = new cloudfront.CloudFrontWebDistribution(
			this,
			'CloudFrontWebDistribution',
			{
				originConfigs: [
					{
						s3OriginSource: {
							s3BucketSource: clientBucket,
							originAccessIdentity,
						},
						behaviors: [{ isDefaultBehavior: true }],
					},
				],
				viewerCertificate: cloudfront.ViewerCertificate.fromAcmCertificate(
					clientCertificate,
					{
						aliases: [domainName],
						securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1,
						sslMethod: cloudfront.SSLMethod.SNI,
					},
				),
				errorConfigurations: [
					{
						errorCode: 403,
						responsePagePath: '/index.html',
						responseCode: 200,
						errorCachingMinTtl: 0,
					},
					{
						errorCode: 404,
						responsePagePath: '/index.html',
						responseCode: 200,
						errorCachingMinTtl: 0,
					},
				],
			},
		)
		new route53.ARecord(this, 'ClientAlias', {
			zone: publicHostedZone,
			recordName: domainName,
			target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
		})

		new CfnOutput(this, 'DistributionId', { value: distribution.distributionId })
		new CfnOutput(this, 'BucketName', { value: clientBucket.bucketName })
	}
}
