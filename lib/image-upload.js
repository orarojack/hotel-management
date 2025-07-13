import { writeFile, mkdir, unlink } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import sharp from "sharp"

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads")
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

// Ensure upload directory exists
async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true })
  }
}

export async function uploadImage(file, entityType = "general") {
  try {
    await ensureUploadDir()

    // Validate file
    if (!file) {
      throw new Error("No file provided")
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File size too large. Maximum 5MB allowed.")
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed.")
    }

    // Generate unique filename
    const fileExtension = path.extname(file.name)
    const uniqueFilename = `${uuidv4()}${fileExtension}`
    const filePath = path.join(UPLOAD_DIR, uniqueFilename)

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Process image with Sharp (resize and optimize)
    const processedBuffer = await sharp(buffer)
      .resize(800, 600, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({
        quality: 85,
        progressive: true,
      })
      .toBuffer()

    // Save processed image
    await writeFile(filePath, processedBuffer)

    // Return file info
    return {
      filename: uniqueFilename,
      originalName: file.name,
      filePath: `/uploads/${uniqueFilename}`,
      fileSize: processedBuffer.length,
      mimeType: "image/jpeg", // Always JPEG after processing
      entityType,
    }
  } catch (error) {
    console.error("Image upload error:", error)
    throw error
  }
}

export async function deleteImage(filename) {
  try {
    const filePath = path.join(UPLOAD_DIR, filename)
    if (existsSync(filePath)) {
      await unlink(filePath)
      return true
    }
    return false
  } catch (error) {
    console.error("Image deletion error:", error)
    return false
  }
}
