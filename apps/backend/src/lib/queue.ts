import type { EmailQueueMessage } from "@/types/queue";

function createEmailQueueClient(queue: Queue<EmailQueueMessage>) {
  return {
    send: (message: EmailQueueMessage) => queue.send(message),

    sendBatch: (messages: MessageSendRequest<EmailQueueMessage>[]) =>
      queue.sendBatch(messages),
  };
}

export function createQueueClient(env: {
  EMAIL_QUEUE: Queue<EmailQueueMessage>;
}) {
  return {
    EmailQueue: createEmailQueueClient(env.EMAIL_QUEUE),
  };
}

export type QueueClient = ReturnType<typeof createQueueClient>;
