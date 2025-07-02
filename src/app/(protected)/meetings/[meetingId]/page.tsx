import React from 'react'
import IssuesList from './issues-list'

type Props = {
    params: Promise<{ meetingId: string }>
}

const MeetingDetailsPage = async ({params}:Props) => {
    const {meetingId} = await params
    return (
        <div className="min-h-screen rounded-2xl bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            <div className="relative">
                <IssuesList meetingId={meetingId} />
            </div>
        </div>
    )
}

export default MeetingDetailsPage
