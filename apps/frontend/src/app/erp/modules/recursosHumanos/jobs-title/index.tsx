import { rhApi } from '@/lib/api/rh'
import { useQuery } from '@tanstack/react-query'
import { CreateJobDrawer } from './create-job-drawer'
import { JobsNav } from './jobs-nav'
import { JobsTable } from './jobs-table'

export const JobsTitlePage = () => {
  const query = useQuery({
    queryKey: ['jobs'],
    queryFn: () => {
      return rhApi.getJobsTitle()
    },
  })

  return (
    <div className="p-3 space-y-2">
      <JobsNav />
      <JobsTable jobsTitle={query.data ?? []} loading={query.isLoading} />
      <CreateJobDrawer onCreate={query.refetch} />
    </div>
  )
}
