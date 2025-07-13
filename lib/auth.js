import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { executeQuery } from "./database.js"

const JWT_SECRET = process.env.JWT_SECRET || "munchhaven-secret-key-2024"
const JWT_EXPIRES_IN = "7d"

export async function hashPassword(password) {
  return await bcrypt.hash(password, 12)
}

export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function authenticateAdmin(username, password) {
  try {
    const query = "SELECT * FROM admin_users WHERE username = ? AND is_active = TRUE"
    const users = await executeQuery(query, [username])

    if (users.length === 0) {
      return null
    }

    const user = users[0]
    const isValidPassword = await verifyPassword(password, user.password_hash)

    if (!isValidPassword) {
      return null
    }

    // Update last login
    await executeQuery("UPDATE admin_users SET last_login = NOW() WHERE id = ?", [user.id])

    // Return user without password
    const { password_hash, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}
