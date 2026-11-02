export interface App {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error';
  region: string;
  lastUpdated: string;
  gitBranch: string;
  url?: string;
}