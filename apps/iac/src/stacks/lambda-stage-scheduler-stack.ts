import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as events from 'aws-cdk-lib/aws-events'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as targets from 'aws-cdk-lib/aws-events-targets'
import * as path from 'path'

interface LambdaStageSchedulerProps {
	dbId: string;
	serverInfo: {
		serverClusterName: string;
		serverServiceName: string;
	}
}

export class LambdaStageSchedulerStack extends cdk.Stack {
	constructor(scope: Construct, id: string, { dbId, serverInfo }: LambdaStageSchedulerProps) {
		super(scope, id)

		const stageSchedulerLambda = new lambda.Function(this, 'StageSchedulerLambdaFunction', {
			runtime: lambda.Runtime.NODEJS_14_X,
			code: lambda.Code.fromAsset(path.join(__dirname, '..', 'lambda', 'stage-scheduler')),
			handler: 'app.handler',
			functionName: id,
		})

		const allowAll = new iam.PolicyStatement({ actions: ['*'], resources: ['*'] })
		stageSchedulerLambda.role.attachInlinePolicy(
			new iam.Policy(this, 'AllowAllPolicy', {
				statements: [allowAll],
			}),
		)

		const everyDayAt9AM_UTC0 = { minute: '0', hour: '9', day: '*', month: '*', year: '*' }
		const everyDayAt6PM_UTC0 = { minute: '0', hour: '18', day: '*', month: '*', year: '*' }

		const startEventRule = new events.Rule(this, 'StartAppStageRule', {
			schedule: events.Schedule.cron(everyDayAt9AM_UTC0),
		})
		const stopEventRule = new events.Rule(this, 'StopAppStageRule', {
			schedule: events.Schedule.cron(everyDayAt6PM_UTC0),
		})

		startEventRule.addTarget(
			new targets.LambdaFunction(stageSchedulerLambda, {
				event: events.RuleTargetInput.fromObject({ status: 'start', dbId, serverInfo }),
			}),
		)
		stopEventRule.addTarget(
			new targets.LambdaFunction(stageSchedulerLambda, {
				event: events.RuleTargetInput.fromObject({ status: 'stop', dbId, serverInfo	 }),
			}),
		)

		targets.addLambdaPermission(startEventRule, stageSchedulerLambda)
		targets.addLambdaPermission(stopEventRule, stageSchedulerLambda)
	}
}
