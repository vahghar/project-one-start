import { db } from '@/server/db';
import { auth, clerkClient } from '@clerk/nextjs/server'
import { notFound, redirect } from 'next/navigation';

const SyncUser = async () => {
    const {userId} = await auth();
    if(!userId){
        throw new Error('User not found')
    }
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    if(!user.emailAddresses[0]?.emailAddress){
            console.error('No email address found for user');
            return notFound();
    }
    await db.user.upsert({
        where:{
            emailAddress: user.emailAddresses[0].emailAddress ?? ""
        },
        update:{
            imageUrl: user.imageUrl,
            firstName: user.firstName,
            lastName: user.lastName,
        },
        create:{
            id:userId,
            emailAddress: user.emailAddresses[0].emailAddress ?? "",
            imageUrl: user.imageUrl,
            firstName: user.firstName,
            lastName: user.lastName,
        },
    })

    redirect('/dashboard')
}

export default SyncUser
