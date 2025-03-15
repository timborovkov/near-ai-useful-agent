'use client';

import { useState } from 'react';

import { disconnectBucket } from '@/actions/bucket-actions';
import type { S3Bucket } from '@/actions/bucket-actions';
import {
  Calendar,
  FolderOpen,
  Globe,
  Key,
  Link2Off,
  Loader2,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { BrowseBucketDialog } from './browse-bucket-dialog';

interface BucketListProps {
  buckets: S3Bucket[];
  onBucketDisconnected: (bucketId: string) => void;
}

export function BucketList({ buckets, onBucketDisconnected }: BucketListProps) {
  const [selectedBucket, setSelectedBucket] = useState<S3Bucket | null>(null);
  const [isBrowsingBucket, setIsBrowsingBucket] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDisconnectBucket = async (bucketId: string) => {
    setIsLoading(true);
    try {
      const result = await disconnectBucket(bucketId);

      if (result.success) {
        onBucketDisconnected(bucketId);
        toast.success('Bucket disconnected', {
          description: 'The bucket has been successfully disconnected.',
        });
      } else {
        toast.error('Failed to disconnect bucket', {
          description: result.message || 'An unexpected error occurred.',
        });
      }
    } catch (error) {
      console.error('Failed to disconnect bucket:', error);
      toast.error('Error', {
        description:
          'An unexpected error occurred while disconnecting the bucket.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to mask sensitive information
  const maskString = (str: string) => {
    if (!str) return '';
    if (str.length <= 8) return '••••••••';
    return str.substring(0, 4) + '••••••' + str.substring(str.length - 4);
  };

  // Function to format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bucket Name</TableHead>
            <TableHead className='hidden md:table-cell'>Region</TableHead>
            <TableHead className='hidden md:table-cell'>Endpoint</TableHead>
            <TableHead className='hidden md:table-cell'>Credentials</TableHead>
            <TableHead className='hidden lg:table-cell'>Created</TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {buckets.map((bucket) => (
            <TableRow key={bucket.id}>
              <TableCell className='font-medium'>
                <div>
                  {bucket.name}
                  {bucket.description && (
                    <p className='mt-1 text-xs text-muted-foreground'>
                      {bucket.description}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell className='hidden md:table-cell'>
                {bucket.region}
              </TableCell>
              <TableCell className='hidden md:table-cell'>
                {bucket.endpoint ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className='flex items-center'>
                          <Globe className='mr-1 h-4 w-4 text-muted-foreground' />
                          <span className='max-w-[150px] truncate'>Custom</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{bucket.endpoint}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <span className='text-muted-foreground'>Default</span>
                )}
              </TableCell>
              <TableCell className='hidden md:table-cell'>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className='flex items-center'>
                        <Key className='mr-1 h-4 w-4 text-muted-foreground' />
                        <span>
                          {maskString(bucket.credentials.accessKeyId)}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Access Key ID:{' '}
                        {maskString(bucket.credentials.accessKeyId)}
                      </p>
                      <p>
                        Secret Access Key:{' '}
                        {maskString(bucket.credentials.secretAccessKey)}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className='hidden lg:table-cell'>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className='flex items-center'>
                        <Calendar className='mr-1 h-4 w-4 text-muted-foreground' />
                        <span>{formatDate(bucket.createdAt)}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Created on {bucket.createdAt.toLocaleString()}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className='text-right'>
                <div className='flex justify-end gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      setSelectedBucket(bucket);
                      setIsBrowsingBucket(true);
                    }}
                  >
                    <FolderOpen className='mr-1 h-4 w-4' />
                    <span className='hidden sm:inline'>Browse</span>
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant='outline'
                        size='sm'
                        className='text-muted-foreground hover:border-destructive/50 hover:text-destructive'
                      >
                        <Link2Off className='mr-1 h-4 w-4' />
                        <span className='hidden sm:inline'>Disconnect</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Disconnect S3 Bucket
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {`
                          Are you sure you want to disconnect the bucket "${bucket.name}"? 
                          This will remove the connection to this bucket from your application. \n
                          The bucket and its contents on AWS will not be affected.
                          `}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDisconnectBucket(bucket.id)}
                          className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                        >
                          {isLoading ? (
                            <Loader2 className='mr-1 h-4 w-4 animate-spin' />
                          ) : (
                            <Trash2 className='mr-1 h-4 w-4' />
                          )}
                          Disconnect
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <BrowseBucketDialog
        bucket={selectedBucket}
        isOpen={isBrowsingBucket}
        onOpenChange={(open) => {
          setIsBrowsingBucket(open);
          if (!open) setSelectedBucket(null);
        }}
      />
    </div>
  );
}
