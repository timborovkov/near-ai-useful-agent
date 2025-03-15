'use client';

import type { S3Bucket } from '@/actions/bucket-actions';
import { Calendar, Database, FolderOpen, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface BrowseBucketDialogProps {
  bucket: S3Bucket | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock bucket contents for the browse feature
const bucketContents = [
  { name: 'images/', type: 'folder', size: '-', lastModified: '2023-09-15' },
  { name: 'documents/', type: 'folder', size: '-', lastModified: '2023-10-02' },
  {
    name: 'config.json',
    type: 'file',
    size: '15 KB',
    lastModified: '2023-10-10',
  },
  {
    name: 'backup.zip',
    type: 'file',
    size: '1.2 GB',
    lastModified: '2023-10-12',
  },
];

export function BrowseBucketDialog({
  bucket,
  isOpen,
  onOpenChange,
}: BrowseBucketDialogProps) {
  if (!bucket) return null;

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  // In a real implementation, you would use the bucket credentials and region to fetch the contents
  // const fetchBucketContents = async () => {
  //   // Use AWS SDK with bucket.credentials, bucket.region, and bucket.endpoint
  // }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[700px]'>
        <DialogHeader>
          <DialogTitle>Browsing: {bucket.name}</DialogTitle>
          <DialogDescription>
            <div className='mt-1 flex flex-col gap-1'>
              <div>Region: {bucket.region}</div>
              {bucket.endpoint && <div>Endpoint: {bucket.endpoint}</div>}
              <div className='flex items-center text-sm text-muted-foreground'>
                <Calendar className='mr-1 h-3 w-3' />
                Connected on {formatDate(bucket.createdAt)}
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className='py-4'>
          <div className='mb-4 flex items-center'>
            <Input placeholder='Search files...' className='mr-2 max-w-sm' />
            <Button variant='outline' size='sm'>
              <Search className='mr-1 h-4 w-4' />
              Search
            </Button>
          </div>
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Last Modified</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bucketContents.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className='font-medium'>
                      {item.type === 'folder' ? (
                        <div className='flex items-center'>
                          <FolderOpen className='mr-2 h-4 w-4 text-primary' />
                          {item.name}
                        </div>
                      ) : (
                        <div className='flex items-center'>
                          <Database className='mr-2 h-4 w-4 text-muted-foreground' />
                          {item.name}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.size}</TableCell>
                    <TableCell>{item.lastModified}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
