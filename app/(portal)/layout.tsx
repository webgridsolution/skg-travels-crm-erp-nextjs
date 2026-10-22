import { redirect } from 'next/navigation';
import { getCurrentUser, databaseConfigured } from '@/lib/server/auth';
import { PortalShell } from '@/components/portal-shell';
export default async function Layout({children}:{children:React.ReactNode}){const user=await getCurrentUser();if(!user)redirect('/login');return <PortalShell user={user} demo={!databaseConfigured()}>{children}</PortalShell>;}
