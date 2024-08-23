import { NextRequest } from "next/server";
import path from "path";
import fs from "fs";

type GetParam = { params: { filename: string } };

export async function GET(request: NextRequest, { params }: GetParam) {
  try {
    const { filename } = params;
    return await readFileAndResponse(filename);
  } catch (error) {
    return new Response("File not found", { status: 404 });
  }
}

async function readFileAndResponse(filename: string) {
  const filePath = path.join(
    process.cwd(),
    "public",
    "downloads",
    `${filename}`
  );
  const fileBuffer = await fs.readFileSync(filePath);
  const stat = fs.statSync(filePath);

  const headers = new Headers({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=${filename}`,
    "Content-Length": stat.size.toString(),
  });

  return new Response(fileBuffer, { headers });
}
