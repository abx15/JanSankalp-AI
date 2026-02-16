import ImageKit from "imagekit";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const imagekit = new ImageKit({
            publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
            urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
        });

        return NextResponse.json(imagekit.getAuthenticationParameters());
    } catch (error) {
        console.error("IMAGEKIT_AUTH_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
