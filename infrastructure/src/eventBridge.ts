import * as aws from '@pulumi/aws';
import { Schedule } from '@pulumi/aws/scheduler';
import * as pulumi from '@pulumi/pulumi';

import { EVENT_BRIDGE_SCHEDULE_EXPRESSION, EVENT_BRIDGE_SCHEDULE_NAME } from './config';

export function createScheduler(lambdaArn: pulumi.Output<string>, roleArn: pulumi.Output<string>): Schedule {
  const schedule = new aws.scheduler.Schedule(EVENT_BRIDGE_SCHEDULE_NAME, {
    scheduleExpression: EVENT_BRIDGE_SCHEDULE_EXPRESSION,
    flexibleTimeWindow: {
      mode: 'FLEXIBLE',
      maximumWindowInMinutes: 15,
    },
    target: {
      arn: lambdaArn,
      roleArn: roleArn,
    },
  });

  return schedule;
}
