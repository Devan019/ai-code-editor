import crypto from "crypto";

const ALGO = "aes-256-gcm";
const SECRET = process.env.ENCRYPT_SECRET!;
export function encrypt(text: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGO, Buffer.from(SECRET), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");
  return { iv: iv.toString("hex"), data: encrypted, tag: authTag };
}

export function decrypt(encrypted: { iv: string; data: string; tag: string }) {
  const decipher = crypto.createDecipheriv(
    ALGO,
    Buffer.from(SECRET),
    Buffer.from(encrypted.iv, "hex")
  );
  decipher.setAuthTag(Buffer.from(encrypted.tag, "hex"));
  let decrypted = decipher.update(encrypted.data, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
