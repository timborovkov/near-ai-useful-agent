"use client"

import { FolderOpen, Database, Search, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { S3Bucket } from "@/actions/bucket-actions"

interface BrowseBucketDialogProps {
  bucket: S3Bucket | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

// Mock bucket contents for the browse feature
const bucketContents = [
  { name: "images/", type: "folder", size: "-", lastModified: "2023-09-15" },
  { name: "documents/", type: "folder", size: "-", lastModified: "2023-10-02" },
  { name: "config.json", type: "file", size: "15 KB", lastModified: "2023-10-10" },
  { name: "backup.zip", type: "file", size: "1.2 GB", lastModified: "2023-10-12" },
]

export function BrowseBucketDialog({ bucket, isOpen, onOpenChange }: BrowseBucketDialogProps) {
  if (!bucket) return null

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  // In a real implementation, you would use the bucket credentials and region to fetch the contents
  // const fetchBucketContents = async () => {
  //   // Use AWS SDK with bucket.credentials, bucket.region, and bucket.endpoint
  // }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Browsing: {bucket.name}</DialogTitle>
          <DialogDescription>
            <div className="flex flex-col gap-1 mt-1">
              <div>Region: {bucket.region}</div>
              {bucket.endpoint && <div>Endpoint: {bucket.endpoint}</div>}
              <div className="flex items-center text-muted-foreground text-sm">
                <Calendar className="h-3 w-3 mr-1" />
                Connected on {formatDate(bucket.createdAt)}
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center mb-4">
            <Input placeholder="Search files..." className="max-w-sm mr-2" />
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-1" />
              Search
            </Button>
          </div>
          <div className="rounded-md border">
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
                    <TableCell className="font-medium">
                      {item.type === "folder" ? (
                        <div className="flex items-center">
                          <FolderOpen className="h-4 w-4 mr-2 text-primary" />
                          {item.name}
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Database className="h-4 w-4 mr-2 text-muted-foreground" />
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

