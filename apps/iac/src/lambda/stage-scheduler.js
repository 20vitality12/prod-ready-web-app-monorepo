const { RDS, ECS } = require('aws-sdk')

const ecs = new ECS()
const rds = new RDS()

const updateECSService = async (status, cluster, service) => {
	const desiredCount = status === 'start' ? 1 : 0
	await ecs.updateService({ cluster, service, desiredCount }).promise()
}

const updateRDSInstance = async (status, DBInstanceIdentifier) => {
	status === 'start' && await rds.startDBInstance({ DBInstanceIdentifier }).promise()
	status === 'stop' && await rds.stopDBInstance({ DBInstanceIdentifier }).promise()
}

exports.handler = async ({ payload, status, dbId, serverInfo }) => {
	console.log(payload)
	try {
		await updateECSService(status, serverInfo.serverClusterName, serverInfo.serverServiceName)
		await updateRDSInstance(status, dbId)
	} catch (e) {
		console.error(e.message)
	}
	return {
		statusCode: 200,
		body: JSON.stringify('ECS & RDS updated!'),
	}
}
