import { useModelIndex } from '#imports'

type JobPosting = {
  title: string
}
export const useJobPostings = () => {
  return useModelIndex<JobPosting>('/api/job-postings')
}
