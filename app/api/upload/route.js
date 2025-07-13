import { NextResponse } from "next/server"
import { uploadImage } from "@/lib/image-upload"
import { executeQuery } from "@/lib/database"

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")
    const entityType = formData.get("entityType") || "general"
    const entityId = formData.get("entityId")

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Upload and process image
    const uploadResult = await uploadImage(file, entityType)

    // Save to database
    const insertQuery = `
      INSERT INTO image_uploads (filename, original_name, file_path, file_size, mime_type, entity_type, entity_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `

    await executeQuery(insertQuery, [
      uploadResult.filename,
      uploadResult.originalName,
      uploadResult.filePath,
      uploadResult.fileSize,
      uploadResult.mimeType,
      uploadResult.entityType,
      entityId || null,
    ])

    return NextResponse.json({
      success: true,
      url: uploadResult.filePath,
      filename: uploadResult.filename,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 })
  }
}
