import { NormalizedJob, SourceConfig } from '../types';

export interface SourceAdapter {
  readonly type: string;
  fetchJobs(source: SourceConfig): Promise<NormalizedJob[]>;
}
