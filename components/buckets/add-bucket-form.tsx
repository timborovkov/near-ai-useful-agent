'use client';

import type React from 'react';
import { useState } from 'react';

import { addBucket } from '@/actions/bucket-actions';
import type { S3Bucket } from '@/actions/bucket-actions';
import { Eye, EyeOff, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface AddBucketFormProps {
  onBucketAdded: (bucket: S3Bucket) => void;
}

export function AddBucketForm({ onBucketAdded }: AddBucketFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);

  const handleAddBucket = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const result = await addBucket(formData);

      if (result.success && result.bucket) {
        onBucketAdded(result.bucket);
        setIsOpen(false);
        toast.success('Bucket connected', {
          description:
            'The bucket has been successfully connected to your application.',
        });
        // Reset form
        event.currentTarget.reset();
      } else {
        toast.error('Failed to connect bucket', {
          description: result.message || 'An unexpected error occurred.',
        });
      }
    } catch (error) {
      console.error('Failed to connect bucket:', error);
      toast.error('Error', {
        description:
          'An unexpected error occurred while connecting the bucket.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className='mr-2 h-4 w-4' />
          Add Bucket
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[550px]'>
        <DialogHeader>
          <DialogTitle>Add New S3 Bucket</DialogTitle>
          <DialogDescription>
            Enter the details for the S3 bucket you wish to connect.
          </DialogDescription>
        </DialogHeader>
        <form
          id='add-bucket-form'
          onSubmit={handleAddBucket}
          className='grid gap-4 py-4'
        >
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              Bucket Name
            </Label>
            <Input
              type='text'
              id='name'
              name='name'
              className='col-span-3'
              required
            />
          </div>

          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='description' className='text-right'>
              Description
            </Label>
            <Textarea
              id='description'
              name='description'
              className='col-span-3'
            />
          </div>

          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='region' className='text-right'>
              Region
            </Label>
            <Input
              type='text'
              id='region'
              name='region'
              placeholder='us-east-1'
              className='col-span-3'
              required
            />
          </div>

          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='endpoint' className='text-right'>
              Endpoint
            </Label>
            <Input
              type='text'
              id='endpoint'
              name='endpoint'
              placeholder='https://s3.amazonaws.com (optional)'
              className='col-span-3'
            />
          </div>

          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='accessKeyId' className='text-right'>
              Access Key ID
            </Label>
            <Input
              type='text'
              id='accessKeyId'
              name='accessKeyId'
              className='col-span-3'
              required
            />
          </div>

          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='secretAccessKey' className='text-right'>
              Secret Access Key
            </Label>
            <div className='relative col-span-3'>
              <Input
                type={showSecretKey ? 'text' : 'password'}
                id='secretAccessKey'
                name='secretAccessKey'
                className='pr-10'
                required
              />
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='absolute right-0 top-0 h-full px-3'
                onClick={() => setShowSecretKey(!showSecretKey)}
              >
                {showSecretKey ? (
                  <EyeOff className='h-4 w-4 text-muted-foreground' />
                ) : (
                  <Eye className='h-4 w-4 text-muted-foreground' />
                )}
                <span className='sr-only'>
                  {showSecretKey ? 'Hide secret key' : 'Show secret key'}
                </span>
              </Button>
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type='submit' form='add-bucket-form' disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Adding...
              </>
            ) : (
              'Add Bucket'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
