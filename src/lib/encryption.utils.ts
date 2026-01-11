export class EncryptionUtil {
  /**
   * Decrypts a base64-encoded encrypted string using AES-GCM
   */
  static async decrypt(encryptedText: string, aesKeyB64: string): Promise<any> {
    try {
      // Split encrypted string
      const parts = encryptedText.split(":");
      if (parts.length !== 3) {
        throw new Error("Invalid encrypted format. Expected iv:tag:cipher");
      }

      const [ivHex, authTagHex, cipherHex] = parts;

      // Convert hex to Uint8Array
      const iv = this.hexToBytes(ivHex);
      const authTag = this.hexToBytes(authTagHex);
      const cipherText = this.hexToBytes(cipherHex);

      // WebCrypto expects: cipherText || authTag
      const encrypted = new Uint8Array(cipherText.length + authTag.length);
      encrypted.set(cipherText);
      encrypted.set(authTag, cipherText.length);

      // Decode AES key (base64 to bytes)
      const keyBytes = Uint8Array.from(atob(aesKeyB64), (c) => c.charCodeAt(0));

      // Import AES key
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        this.toArrayBuffer(keyBytes),
        { name: "AES-GCM" },
        false,
        ["decrypt"]
      );

      // Decrypt
      const decryptedBuffer = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: this.toArrayBuffer(iv),
        },
        cryptoKey,
        this.toArrayBuffer(encrypted)
      );

      // Parse JSON
      const decryptedText = new TextDecoder().decode(decryptedBuffer);
      return JSON.parse(decryptedText);
    } catch (error) {
      console.error(
        "[BrowserEncryptionUtil] Decryption failed:",
        error instanceof Error ? error.message : error
      );
      return null;
    }
  }

  /**
   * Generate a new AES key in base64 format
   */
  static generateAesKeyB64(): string {
    // 32 bytes = 256-bit
    const key = new Uint8Array(32);

    // Cryptographically secure random
    crypto.getRandomValues(key);

    // Convert to base64
    let binary = "";
    for (let i = 0; i < key.length; i++) {
      binary += String.fromCharCode(key[i]);
    }

    return btoa(binary);
  }

  /**
   * Convert hex string to Uint8Array
   */
  private static hexToBytes(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return bytes;
  }

  /**
   * Convert Uint8Array to ArrayBuffer
   */
  private static toArrayBuffer(u8: Uint8Array): ArrayBuffer {
    return u8.buffer.slice(
      u8.byteOffset,
      u8.byteOffset + u8.byteLength
    ) as ArrayBuffer;
  }
}
