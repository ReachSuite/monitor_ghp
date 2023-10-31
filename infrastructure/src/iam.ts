import * as aws from '@pulumi/aws';

import { LAMBDA_POLICY_ATTACHMENT_NAME, LAMBDA_POLICY_NAME, LAMBDA_ROLE_NAME } from './config';

export function defineLambdaPolicies(): aws.iam.Role {
  /**
   * Monitor lambdas role
   */
  const role = new aws.iam.Role(LAMBDA_ROLE_NAME, {
    assumeRolePolicy: JSON.stringify({
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Sid: '',
          Principal: {
            Service: 'lambda.amazonaws.com',
          },
        },
      ],
    }),
  });

  /**
   * Allow Lambda execution permission
   */
  new aws.iam.RolePolicy(LAMBDA_POLICY_NAME, {
    role: role.id,
    policy: JSON.stringify({
      Version: '2012-10-17',
      Statement: [
        {
          Action: ['lambda:InvokeFunction'],
          Effect: 'Allow',
          Resource: '*',
        },
      ],
    }),
  });

  new aws.iam.PolicyAttachment(LAMBDA_POLICY_ATTACHMENT_NAME, {
    policyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
    roles: [role],
  });

  return role;
}
