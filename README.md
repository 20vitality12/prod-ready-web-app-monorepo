# Monolith

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ **This workspace has been generated by [Nx, a Smart, fast and extensible build system.](https://nx.dev)** ✨

## Understand this workspace

Run `nx graph` to see a diagram of the dependencies of the projects.

## Remote caching

Run `npx nx connect-to-nx-cloud` to enable [remote caching](https://nx.app) and make CI faster.

## Motivation

While working on different projects, I often encountered the problem of the irresponsibility of DevOps engineers. 
Therefore, I decided to dive into the world of [AWS CDK](https://aws.amazon.com/cdk/). 
Why CDK? Because it allows you to use the 'infrastructure as code'
approach and it's very easy to deploy more and more environments on the aws cloud.

Therefore, in this template, the main focus is on the iac project and github actions.
Other projects and libraries are provided as an example.

## Description

This is Nx apps based monorepo template that includes:
 - client ([React](https://react.dev)) 
 - server ([Nest](https://nestjs.com)), 
 - lambda ([Serverless](https://www.serverless.com))
 - iac ([AWS CDK](https://aws.amazon.com/cdk))
 - ecs-task (Node)

