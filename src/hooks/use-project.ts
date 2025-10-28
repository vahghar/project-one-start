import { api } from '@/trpc/react'
import {useLocalStorage} from 'usehooks-ts'

const useProject = () => {
    const {data: userToProjects} = api.project.getProjects.useQuery()
    const [projectId,setProjectId] = useLocalStorage('user_to_projectId','')

    // Transform the data to match the expected format
    const projects = userToProjects?.map(utp => utp.project) || []
    const project = projects?.find(project => project.id === projectId)

    return {
        projects,
        project,
        projectId,
        setProjectId
    }
}

export default useProject
