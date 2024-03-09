
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
    const key = this.getFileKey(file)

    await this.S3.send(new PutObjectCommand({
      Bucket: this.settings.bucket,
      Key: key,
      Body: file
    }))
    return `https://${this.settings.domain}/${key.replace(/ /g, '%20')}`;
  }

  private getFileKey(file: File): string {
    const fileName = file.name
    const type = file.type.split('/')[0];
    const random = (Math.random() + 1).toString(36).substring(2, 7)
    const lastDotIndex = fileName.lastIndexOf('.');
    const baseName = fileName.slice(0, lastDotIndex);
    const extName = fileName.slice(lastDotIndex);
    return `${type}/${baseName}_${random}${extName}`
  }
}
