import { useModelIndex } from '#imports'

type JobPosting = {
  id: string
  title: string
}
export const useJobPostings = () => {
  return useModelIndex<JobPosting>('/api/job-postings')
}
