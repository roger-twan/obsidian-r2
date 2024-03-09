
import { ObsidianR2Settings } from './settings';
import {
  S3Client,
  PutObjectCommand
} from '@aws-sdk/client-s3';

export default class Uploader {
  settings: ObsidianR2Settings;
  S3: S3Client;

  constructor(settings: ObsidianR2Settings) {
    this.settings = settings
    this.S3 = new S3Client({
      region: 'auto',
      endpoint: `https://${settings.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: settings.accessKeyId,
        secretAccessKey: settings.secretAccessKey,
      },
    })
  }

  async upload(file: File): Promise<string> {
    const type = file.type.split('/')[0];
    const random = (Math.random() + 1).toString(36).substring(2, 7)
    const key = `${type}/${file.name}_${random}`

    await this.S3.send(new PutObjectCommand({
      Bucket: this.settings.bucket,
      Key: key,
      Body: file
    }))
    return `https://${this.settings.domain}/${key.replace(/ /g, '%20')}`;
  }
}
