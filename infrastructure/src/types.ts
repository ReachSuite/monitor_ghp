import * as pulumi from '@pulumi/pulumi';

export type ChromeLambdaLayer = {
  etag: pulumi.Output<string>;
  s3Key: pulumi.Output<string>;
};
