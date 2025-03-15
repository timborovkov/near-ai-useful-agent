import type { S3Bucket } from '@/actions/bucket-actions';

import S3BucketsTable from '@/components/s3-buckets-table';

const DEMO_BUCKETS: S3Bucket[] = [
  {
    id: '1',
    name: 'app-assets',
    description: 'Main storage for application assets and uploads',
    region: 'us-east-1',
    endpoint: undefined,
    credentials: {
      accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
      secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    },
    createdAt: new Date(2023, 4, 15), // May 15, 2023
  },
  {
    id: '2',
    name: 'user-data-backup',
    description: 'Backup storage for user data and configurations',
    region: 'eu-west-1',
    endpoint: 'https://s3.eu-west-1.amazonaws.com',
    credentials: {
      accessKeyId: 'AKIAI44QH8DHBEXAMPLE',
      secretAccessKey: 'je7MtGbClwBF/2Zp9Utk/h3yCo8nvbEXAMPLEKEY',
    },
    createdAt: new Date(2023, 5, 22), // June 22, 2023
  },
  {
    id: '3',
    name: 'logs-archive',
    description: 'Long-term storage for application logs and analytics data',
    region: 'ap-southeast-1',
    endpoint: undefined,
    credentials: {
      accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
      secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    },
    createdAt: new Date(2023, 7, 10), // August 10, 2023
  },
];

export default async function BucketsPage() {
  return (
    <div className='container mx-auto py-8'>
      <S3BucketsTable initialBuckets={DEMO_BUCKETS} />
    </div>
  );
}
