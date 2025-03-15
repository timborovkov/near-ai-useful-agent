export interface S3Bucket {
  id: string;
  name: string;
  description?: string;
  region: string;
  endpoint?: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
  createdAt: Date;
}
