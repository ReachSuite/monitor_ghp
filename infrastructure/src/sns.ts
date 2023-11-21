import * as aws from '@pulumi/aws';

export function createSnsTopicForEmail({
  topicName,
  displayName,
  subscriptions,
}: {
  topicName: string;
  displayName: string;
  subscriptions: string;
}) {
  const snsTopic = new aws.sns.Topic(topicName, {
    displayName: displayName,
  });

  if (!subscriptions.length) {
    throw new Error('At least one topic subscription email should be defined');
  }

  subscriptions.split(';').forEach((subscription: string) => {
    console.log(`Adding subscription ${subscription} to SNS Topic ${topicName}`);
    new aws.sns.TopicSubscription(`${topicName}:${subscription}`, {
      protocol: 'email',
      topic: snsTopic.arn,
      endpoint: subscription,
    });
  });

  return snsTopic;
}
