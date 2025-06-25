// src/lib/auth.js
import bcrypt from "bcryptjs";

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password, hashed) {
  return bcrypt.compare(password, hashed);
}
