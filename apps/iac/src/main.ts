import * as cdk from 'aws-cdk-lib';
import { ClientStack } from './stacks'
import { environment } from './environment'

const { COMPANY_NAME, STACK_NAME_PREFIX, CLIENT_SUBDOMAIN } = environment

const app = new cdk.App()

new ClientStack(app, `${STACK_NAME_PREFIX}-client`, {subdomain: CLIENT_SUBDOMAIN})

