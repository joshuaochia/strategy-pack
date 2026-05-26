This is a [Next.js](https://nextjs.org) project that generates a Strategy Pack from two uploaded PDF documents.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root with the following values:

```dotenv
GEMINI_API_KEY=your_gemini_api_key_here
BLOB_READ_WRITE_TOKEN=your_vercel_blob_write_token_here
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Required Environment Variables

- `GEMINI_API_KEY`
  - Used by the server-side API routes to call Gemini via `@google/generative-ai`.
- `BLOB_READ_WRITE_TOKEN`
  - Used by the server to fetch private PDF blobs from Vercel Blob storage.

> Do not commit `.env` to source control.

## Project Notes

- Uploads are handled through `app/api/upload/route.ts` and Vercel Blob.
- Step 1 (`/api/step1`) fetches the uploaded PDFs from blob storage and sends them to Gemini.
- Step 2 (`/api/step2`) generates the Balanced Scorecard from the Step 1 output.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Blob Documentation](https://vercel.com/docs/concepts/edge-network/blob-storage)
- [Gemini API / Google Generative AI](https://cloud.google.com/ai)
