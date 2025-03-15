import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface S3ObjectInfo {
  key: string;
  size?: number;
  lastModified?: Date;
  eTag?: string;
}

/**
 * Service class to interact with an S3 bucket.
 *
 * @example
 * ```typescript
 * const s3Service = new S3BucketService('your-bucket-name', 'us-east-1', {
 *  accessKeyId: 'YOUR_ACCESS_KEY',
 *  secretAccessKey: 'YOUR_SECRET_KEY'
 * });
 *
 * const objects = await s3Service.listObjects();
 * console.log(objects);
 * ```
 */
export class S3BucketService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(
    bucketName: string,
    region = 'us-east-1',
    credentials?: { accessKeyId: string; secretAccessKey: string }
  ) {
    this.bucketName = bucketName;
    this.s3Client = new S3Client({
      region,
      credentials: credentials || undefined,
    });
  }

  async listObjects(prefix?: string, maxKeys = 1000): Promise<string[]> {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: prefix,
        MaxKeys: maxKeys,
      });

      const response = await this.s3Client.send(command);

      if (!response.Contents) {
        return [];
      }

      return response.Contents.map((item) => item.Key || '').filter(Boolean);
    } catch (error) {
      console.error('Error listing objects:', error);
      throw error;
    }
  }

  async listObjectsWithDetails(
    prefix?: string,
    maxKeys = 1000
  ): Promise<S3ObjectInfo[]> {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: prefix,
        MaxKeys: maxKeys,
      });

      const response = await this.s3Client.send(command);

      if (!response.Contents) {
        return [];
      }

      return response.Contents.map((item) => ({
        key: item.Key || '',
        size: item.Size,
        lastModified: item.LastModified,
        eTag: item.ETag,
      })).filter((item) => item.key !== '');
    } catch (error) {
      console.error('Error listing objects with details:', error);
      throw error;
    }
  }

  async getObjectContent(key: string): Promise<Uint8Array> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.s3Client.send(command);

      if (!response.Body) {
        throw new Error('Object body is empty');
      }

      return await response.Body.transformToByteArray();
    } catch (error) {
      console.error(`Error getting object content for key "${key}":`, error);
      throw error;
    }
  }

  async getObjectContentAsString(key: string): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.s3Client.send(command);

      if (!response.Body) {
        throw new Error('Object body is empty');
      }

      return await response.Body.transformToString();
    } catch (error) {
      console.error(
        `Error getting object content as string for key "${key}":`,
        error
      );
      throw error;
    }
  }

  async getObjectMetadata(key: string): Promise<Record<string, unknown>> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.s3Client.send(command);

      // Extract metadata
      const metadata = {
        contentType: response.ContentType,
        contentLength: response.ContentLength,
        lastModified: response.LastModified,
        eTag: response.ETag,
        metadata: response.Metadata || {},
      };

      return metadata;
    } catch (error) {
      console.error(`Error getting object metadata for key "${key}":`, error);
      throw error;
    }
  }

  async objectExists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any).name === 'NotFound') {
        return false;
      }
      console.error(`Error checking if object exists for key "${key}":`, error);
      throw error;
    }
  }

  async uploadObject(
    key: string,
    data: Buffer | Blob | string,
    contentType?: string,
    metadata?: Record<string, string>
  ): Promise<void> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: data,
        ContentType: contentType,
        Metadata: metadata,
      });

      await this.s3Client.send(command);
    } catch (error) {
      console.error(`Error uploading object with key "${key}":`, error);
      throw error;
    }
  }

  async deleteObject(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
    } catch (error) {
      console.error(`Error deleting object with key "${key}":`, error);
      throw error;
    }
  }

  async generatePresignedUrl(
    key: string,
    expiresInSeconds = 3600
  ): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      return await getSignedUrl(this.s3Client, command, {
        expiresIn: expiresInSeconds,
      });
    } catch (error) {
      console.error(`Error generating presigned URL for key "${key}":`, error);
      throw error;
    }
  }
}
