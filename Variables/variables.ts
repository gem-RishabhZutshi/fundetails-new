interface WebsiteEnvironment {
  domainName: string;        // The domain name of the environment (e.g., "dev", "uat", "prod")
  bucketName: string;        // The name of the S3 bucket associated with the environment
  distributionId?: string;
  folderName: 'dev'          
}

const devEnvironment: WebsiteEnvironment = {
  domainName: 'dev',
  bucketName: 'fundetails',
  folderName: 'dev'
};
