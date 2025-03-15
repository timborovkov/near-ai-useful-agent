'use client';

import { Cloud, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface EmptyBucketStateProps {
  onAddBucket: () => void;
}

export function EmptyBucketState({ onAddBucket }: EmptyBucketStateProps) {
  return (
    <div className='flex flex-col items-center justify-center py-10 text-center'>
      <Cloud className='mb-4 h-10 w-10 text-muted-foreground' />
      <h3 className='text-lg font-medium'>No buckets connected</h3>
      <p className='mb-4 mt-2 text-sm text-muted-foreground'>
        You haven't connected any S3 buckets yet. Add one to get started.
      </p>
      <Button onClick={onAddBucket}>
        <Plus className='mr-2 h-4 w-4' />
        Add Bucket
      </Button>
    </div>
  );
}
