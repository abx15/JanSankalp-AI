import ImageKit from "imagekit";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        if (!process.env.IMAGEKIT_PRIVATE_KEY || !process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY) {
            console.error("DEBUG: ImageKit Keys missing in environment");
            return new NextResponse("ImageKit Keys missing", { status: 500 });
        }

        const imagekit = new ImageKit({
            publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
            urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
        });

        console.log("DEBUG: Generating ImageKit auth parameters...");
        const authParams = imagekit.getAuthenticationParameters();
        return NextResponse.json(authParams);
    } catch (error: any) {
        console.error("DEBUG: IMAGEKIT_AUTH_ERROR", error.message || error);
        return new NextResponse(`ImageKit Auth Error: ${error.message || "Unknown"}`, { status: 500 });
    }
}
