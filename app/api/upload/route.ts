import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // Required for Vercel Serverless Functions

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (
        pathname: string,
        /* clientPayload?: string */
      ) => {
        // IMPORTANT: Implement your authentication and authorization logic here.
        // For example, check if the user is logged in and authorized to upload.
        // If not authorized, throw an error: throw new Error('Unauthorized');

        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/gif",
            "application/pdf",
            "text/plain",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel",
          ], // Customize allowed file types based on your needs
          addRandomSuffix: true,
          // You can pass user-specific data to onUploadCompleted via tokenPayload
          // tokenPayload: JSON.stringify({ userId: 'your-user-id' }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // This callback is executed by Vercel Blob after the file has been successfully uploaded.
        // Use this to update your database or perform other post-upload actions.
        console.log("Blob upload completed:", blob);

        try {
          // Example: Parse tokenPayload if you passed user data
          // const { userId } = JSON.parse(tokenPayload);
          // await db.updateUserStrategyFile(userId, blob.url);
          // Or simply log the URL for now:
          console.log(`File ${blob.pathname} uploaded to ${blob.url}`);
        } catch (error) {
          console.error("Error in onUploadCompleted callback:", error);
          // Re-throw to indicate failure to Vercel Blob, which will retry the webhook
          throw new Error("Failed to process upload completion.");
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error: any) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }, // Return 400 for client-side errors, Vercel Blob will retry webhooks if status is not 200
    );
  }
}
