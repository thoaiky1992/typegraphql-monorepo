import { Options } from 'amqplib';
import { ConsumeMessage } from 'amqplib';
import { Channel, Connection, connect } from 'amqplib';
import 'dotenv/config';
import { Logger } from './logger';

export enum CHANNEL_EXCHANGE_TYPE {
  DIRECT = 'direct',
  FANOUT = 'fanout',
  TOPIC = 'topic',
  HEADERS = 'headers'
}

class RabbitMQClientInstance {
  public connection!: Connection;
  public channel!: Channel;
  public static _instance: RabbitMQClientInstance;

  // constructor() {
  //   this.connect();
  // }

  public static getInstance() {
    if (!this._instance) {
      this._instance = new RabbitMQClientInstance();
    }
    return this._instance;
  }

  async connect() {
    try {
      this.connection = await connect(process.env.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      Logger.info('RabbitMQ conntected ...');
    } catch (error) {
      Logger.error(error);
    }
  }
  async sendExchange(exchange_name: string, queue_name: string, routing_name: string) {
    await this.channel.bindQueue(queue_name, exchange_name, routing_name);
  }

  async sendQueue(
    queue_name: string,
    data: any,
    assertQueueOptions?: Options.AssertQueue,
    publishOptions?: Options.Publish | undefined
  ) {
    await this.channel.assertQueue(queue_name, assertQueueOptions);
    await this.channel.sendToQueue(queue_name, Buffer.from(JSON.stringify(data)), { ...publishOptions });
  }

  async publishMessage(
    exchange_name: string,
    type: CHANNEL_EXCHANGE_TYPE,
    routing_key: string,
    data: any,
    assertExchangeOptions?: Options.AssertExchange | undefined,
    publishOptions?: Options.Publish | undefined
  ) {
    await this.channel.assertExchange(exchange_name, type, assertExchangeOptions);
    await this.channel.publish(exchange_name, routing_key, Buffer.from(JSON.stringify(data)), { ...publishOptions });
  }

  async subcribeMessage(
    queue_name: string,
    callback: (data: ConsumeMessage | null) => void,
    assertQueueOptions?: Options.AssertQueue | undefined,
    consumeOptions?: Options.Consume | undefined
  ) {
    await this.channel.assertQueue(queue_name, assertQueueOptions);
    this.channel.consume(
      queue_name,
      (message: ConsumeMessage | null) => {
        callback(message);
      },
      { ...consumeOptions }
    );
  }

  async subcribeExchangeMessage(
    exchange_name: string,
    type: CHANNEL_EXCHANGE_TYPE,
    routing_key: string,
    queue_name: string,
    callback: (data: ConsumeMessage | null) => void,
    assertExchangeOptions?: Options.AssertExchange | undefined,
    assertQueueOptions?: Options.AssertQueue | undefined,
    consumeOptions?: Options.Consume | undefined
  ) {
    await this.channel.assertExchange(exchange_name, type, { ...assertExchangeOptions });
    const queue = await this.channel.assertQueue(queue_name, assertQueueOptions);
    await this.channel.bindQueue(queue.queue, exchange_name, routing_key);
    this.channel.consume(
      queue.queue,
      (message: ConsumeMessage | null) => {
        callback(message);
      },
      { ...consumeOptions }
    );
  }
}

export const RabbitMQClient = RabbitMQClientInstance.getInstance();
