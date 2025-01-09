import { useModelIndex } from '../../src/runtime/composables/useModelIndex'

type JobPosting = {
  title: string
}
export const useJobPostings = () => {
  return useModelIndex<JobPosting>('/api/job-postings')
}
