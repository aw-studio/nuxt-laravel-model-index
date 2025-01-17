import type { ModelIndexOptions } from '../../src/runtime/types'
import { useModelIndex } from '#imports'

type JobPosting = {
  id: string
  title: string
}
export const useJobPostings = (options?: ModelIndexOptions) => {
  return useModelIndex<JobPosting>('/api/job-postings', options)
}
