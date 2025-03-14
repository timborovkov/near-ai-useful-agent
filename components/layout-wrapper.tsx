import { useRouter } from 'next/router';

import { AppSidebar } from '@/components/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import WalletButton from './wallet-button';

/**
 * LayoutWrapper component.
 *
 * @param props - Component properties.
 * @param {React.ReactNode} props.children - The content to render within the layout.
 * @returns {JSX.Element} The layout including a dynamically constructed breadcrumb.
 */
export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter(); // Get the current router instance
  const asPath = router.asPath; // Get the current path including query params
  // Remove query parameters and hash fragments to isolate the pathname
  const pathname = asPath.split('?')[0].split('#')[0];
  // Split the pathname into segments and filter out any empty segments
  const segments = pathname.split('/').filter(Boolean);

  // Construct the breadcrumbs array:
  // - Always start with a "Home" breadcrumb.
  // - For each segment, build the breadcrumb link and label.
  const breadcrumbs = [
    { href: '/', label: 'Home', isLast: segments.length === 0 },
    ...segments.map((segment, index) => {
      // Build the href by joining the segments up to the current index
      const href = '/' + segments.slice(0, index + 1).join('/');
      // Determine if this is the last breadcrumb in the trail
      const isLast = index === segments.length - 1;
      // Format the segment to create a label (replace hyphens with spaces and capitalise first letter)
      const label = segment
        .replace(/-/g, ' ')
        .replace(/^\w/, (c) => c.toUpperCase());
      return { href, label, isLast };
    }),
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center justify-between gap-2 border-b'>
          <div className='flex items-center gap-2 px-3'>
            <SidebarTrigger />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <BreadcrumbItem key={crumb.href}>
                    {crumb.isLast ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={crumb.href}>
                        {crumb.label}
                      </BreadcrumbLink>
                    )}
                    {index !== breadcrumbs.length - 1 && (
                      <BreadcrumbSeparator />
                    )}
                  </BreadcrumbItem>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className='px-3'>
            <WalletButton />
          </div>
        </header>
        <div className='flex flex-1 flex-col gap-4 p-4'>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
