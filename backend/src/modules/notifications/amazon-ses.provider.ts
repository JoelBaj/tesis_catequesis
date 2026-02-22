import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

export class AmazonSESProvider {
  private client: SESClient;
  private fromEmail: string;
  private fromName: string;

  constructor(config: { accessKeyId: string; secretAccessKey: string; region: string; fromEmail: string; fromName: string }) {
    this.client = new SESClient({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
    this.fromEmail = config.fromEmail;
    this.fromName = config.fromName;
  }

  async send({ toEmail, subject, html }: { toEmail: string; subject: string; html: string }) {
    const params = {
      Source: `${this.fromName} <${this.fromEmail}>`,
      Destination: { ToAddresses: [toEmail] },
      Message: {
        Subject: { Data: subject },
        Body: { Html: { Data: html } },
      },
    };
    await this.client.send(new SendEmailCommand(params));
  }
}
