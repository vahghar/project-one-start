import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { db } from "@/server/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2025-02-24.acacia",
});

export async function POST(req: NextRequest) {
    const body =  await req.text();
    const signature = (await (await headers()).get('Stripe-Signature')) as string;

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(body,signature, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (error) {
        return NextResponse.json({ message: "error" });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    console.log(event.type);
    if(event.type === 'checkout.session.completed'){
        const credits = Number(session.metadata?.credits);
        const userId = session.client_reference_id;
        if(!userId || !credits){
            return NextResponse.json({ message: "error" });
        }
        await db.stripeTransaction.create({data:{userId, credits}});
        await db.user.update({where: {id: userId}, data: {credits:{
            increment: credits
        }}});
        return NextResponse.json({ message: "credits added successfully" });
    }

    return NextResponse.json({ message: "sui" });
}