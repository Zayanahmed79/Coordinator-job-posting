import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const pdfFile = formData.get("pdf");
  if (!pdfFile || typeof pdfFile !== "object") {
    return NextResponse.json({ error: "PDF file required" }, { status: 400 });
  }

  // Forward the file to the external API
  const apiUrl = "https://unitzero-4fi4q.ondigitalocean.app/api/resume/extract";
  const uploadForm = new FormData();
  uploadForm.append("pdf", pdfFile);

  const apiRes = await fetch(apiUrl, {
    method: "POST",
    body: uploadForm,
  });

  if (!apiRes.ok) {
    return NextResponse.json({ error: "Resume extraction failed" }, { status: 500 });
  }

  const data = await apiRes.json();
  return NextResponse.json(data);
}
