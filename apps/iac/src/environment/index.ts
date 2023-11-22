import { stageType as stageType } from '@monolith/contracts'

const STAGE = process.env['STAGE'] as stageType
if (!STAGE) throw new Error('STAGE is undefined')

const DOMAIN = process.env['DOMAIN']
if (!DOMAIN) throw new Error('DOMAIN is undefined')

const SERVER_SUBDOMAIN = process.env['SERVER_SUBDOMAIN']
if (!SERVER_SUBDOMAIN) throw new Error('SERVER_SUBDOMAIN is undefined')

const CLIENT_SUBDOMAIN = process.env['CLIENT_SUBDOMAIN']
if (!CLIENT_SUBDOMAIN) throw new Error('CLIENT_SUBDOMAIN is undefined')

const HOSTED_ZONE_ID = process.env['HOSTED_ZONE_ID']
if (!HOSTED_ZONE_ID) throw new Error('HOSTED_ZONE_ID is undefined')

const COMPANY_NAME = process.env['COMPANY_NAME']
if (!COMPANY_NAME) throw new Error('COMPANY_NAME is undefined')

const IS_PRODUCTION = process.env['STAGE'] as stageType === 'production'
const BUILD_ASSETS = process.env['BUILD_ASSETS'] === 'true'

const getSubdomainByStage = (domain: string): string => STAGE === 'production' ? domain : `${domain}.${STAGE}`
export const environment = {
	STAGE,
	DOMAIN,
	SERVER_SUBDOMAIN: getSubdomainByStage(SERVER_SUBDOMAIN),
	CLIENT_SUBDOMAIN: getSubdomainByStage(CLIENT_SUBDOMAIN),
	HOSTED_ZONE_ID,
	COMPANY_NAME,
	STACK_NAME_PREFIX: `${COMPANY_NAME}-${STAGE}`,
	IS_PRODUCTION,
	VPC_NAME: `${COMPANY_NAME}-vpc`,
	BUILD_ASSETS,
}
