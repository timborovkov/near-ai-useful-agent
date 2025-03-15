'use client';

import { useEffect, useState } from 'react';

import { Search } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { S3Bucket } from '@/types/bucket';

import { AddBucketForm } from './buckets/add-bucket-form';
import { BucketList } from './buckets/bucket-list';
import { EmptyBucketState } from './buckets/empty-bucket-state';

interface S3BucketsTableProps {
  initialBuckets: S3Bucket[];
}

export default function S3BucketsTable({
  initialBuckets,
}: S3BucketsTableProps) {
  const [buckets, setBuckets] = useState<S3Bucket[]>(initialBuckets);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBuckets, setFilteredBuckets] = useState<S3Bucket[]>(buckets);
  const [isAddingBucket, setIsAddingBucket] = useState(false);

  // Update buckets when initialBuckets changes
  useEffect(() => {
    setBuckets(initialBuckets);
  }, [initialBuckets]);

  // Filter buckets based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredBuckets(buckets);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredBuckets(
        buckets.filter(
          (bucket) =>
            bucket.name.toLowerCase().includes(query) ||
            bucket.description?.toLowerCase().includes(query) ||
            bucket.region.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, buckets]);

  const handleBucketAdded = (newBucket: S3Bucket) => {
    setBuckets([...buckets, newBucket]);
  };

  const handleBucketDisconnected = (bucketId: string) => {
    setBuckets(buckets.filter((bucket) => bucket.id !== bucketId));
  };

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>S3 Buckets</CardTitle>
          <CardDescription>
            Manage your connected AWS S3 buckets and their contents.
          </CardDescription>
          <div className='mt-4'>
            <div className='relative'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                type='search'
                placeholder='Search buckets...'
                className='w-full pl-8'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {buckets.length === 0 ? (
            <EmptyBucketState onAddBucket={() => setIsAddingBucket(true)} />
          ) : filteredBuckets.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-10 text-center'>
              <Search className='mb-4 h-10 w-10 text-muted-foreground' />
              <h3 className='text-lg font-medium'>No matching buckets</h3>
              <p className='mb-4 mt-2 text-sm text-muted-foreground'>
                No buckets match your search query. Try a different search term.
              </p>
              <Input
                type='search'
                placeholder='Search buckets...'
                className='mt-2 max-w-xs'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          ) : (
            <BucketList
              buckets={filteredBuckets}
              onBucketDisconnected={handleBucketDisconnected}
            />
          )}
        </CardContent>
        <CardFooter className='flex items-center justify-between'>
          <p className='text-sm text-muted-foreground'>
            Total buckets: {buckets.length}
          </p>
          <AddBucketForm
            open={isAddingBucket}
            onBucketAdded={handleBucketAdded}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
