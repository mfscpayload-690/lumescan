import { Workstation } from '@/components/Workstation';

/**
 * Dynamic route component for repository deep linking.
 * Captures repository owner and name from the URL path (e.g., /owner/repo) 
 * and automatically initializes a security scan in the Workstation.
 */
export default async function RepoDeepLinkPage({ params }: { params: Promise<{ repo: string[] }> }) {
  const { repo } = await params;
  const repoPath = repo.join('/');
  
  return <Workstation initialRepo={repoPath} />;
}
