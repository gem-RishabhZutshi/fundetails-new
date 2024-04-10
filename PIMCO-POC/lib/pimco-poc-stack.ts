import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as path from 'path';
import * as fs from 'fs';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';




interface WebsiteEnvironment {
  domainName: string;        // The domain name of the environment (e.g., "dev", "uat", "prod")
  bucketName: string;        // The name of the S3 bucket associated with the environment
  distributionId?: string;
  folderName: 'dev'          
}

export class StaticWebsiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, environment: WebsiteEnvironment, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an S3 bucket for the environment
    const websiteBucket = new s3.Bucket(this, environment.bucketName, {
      bucketName: environment.bucketName,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html',
    });

    // Create a CloudFront distribution for the environment
    const cloudFrontDistribution = new cloudfront.CloudFrontWebDistribution(this, 'CloudFrontDistribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: websiteBucket
          },
          behaviors: [{ isDefaultBehavior: true }],
        },
      ],
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    
    });

    // Update the distributionId property in the environment object
    environment.distributionId = cloudFrontDistribution.distributionId;

    // Function to create or update static content
    const createOrUpdateStaticContent = (folderName: string) => {
      const contentFolderPath = path.join(__dirname, '../../', folderName);
      const indexHtmlPath = path.join(contentFolderPath, 'index.html');
      
      if (!fs.existsSync(contentFolderPath)) {
        console.log(`Folder ${folderName} not found. Creating now...`);
        fs.mkdirSync(contentFolderPath);
      }
      
      if (!fs.existsSync(indexHtmlPath)) {
        console.log(`index.html not found in ${folderName}. Creating now...`);
        // const generatedContent = `<!DOCTYPE html><html><head><title>${folderName} Page</title></head><body><h1>Welcome to ${folderName}!</h1></body></html>`;
        fs.writeFileSync(indexHtmlPath, 'utf-8');
      }
      
      console.log(`Deploying static content from ${folderName} to S3 and CloudFront...`);
      new s3deploy.BucketDeployment(this, `Deploy${environment.domainName}StaticContent${folderName}`, {
        sources: [s3deploy.Source.asset(contentFolderPath)],
        destinationBucket: websiteBucket,
        destinationKeyPrefix: folderName,
      });
    };

    // Create or update static content for dev, uat, and prod
    createOrUpdateStaticContent('dev');
    createOrUpdateStaticContent('uat');
    createOrUpdateStaticContent('prod');

    // Output the CloudFront domain name for reference
    new cdk.CfnOutput(this, `${environment.domainName}CloudFrontDomain`, {
      value: cloudFrontDistribution.distributionDomainName,
    });
  }
}

// Define the dev environment
const devEnvironment: WebsiteEnvironment = {
  domainName: 'dev',
  bucketName: 'fundetails',
  folderName: 'dev'
};
