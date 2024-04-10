#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { StaticWebsiteStack } from '../lib/pimco-poc-stack';



interface WebsiteEnvironment {
  domainName: string;        // The domain name of the environment (e.g., "dev", "uat", "prod")
  bucketName: string;        // The name of the S3 bucket associated with the environment
  distributionId?: string; 
  folderName: 'dev'  // Optional: The ID of the CloudFront distribution associated with the environment
}

const devEnvironment: WebsiteEnvironment = {
  domainName: 'dev',
  bucketName: 'funddetails',
  folderName: 'dev'
};

const app = new cdk.App();
new StaticWebsiteStack(app, 'DevStack', devEnvironment , {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});




//new StaticWebsiteStack(app, 'DevStack', devEnvironment , ;