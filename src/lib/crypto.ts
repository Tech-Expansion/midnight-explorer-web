function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

export async function generateAesKey(): Promise<{ key: CryptoKey; keyB64: string }> {
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  const raw = await crypto.subtle.exportKey("raw", key);
  const keyB64 = btoa(String.fromCharCode(...new Uint8Array(raw)));
  return { key, keyB64 };
}

/**
 * Decrypt AES-256-GCM response from BE.
 * BE format: ivHex:authTagHex:cipherTextHex
 * Web Crypto expects ciphertext + authTag concatenated.
 */
export async function decryptAesGcm(encryptedStr: string, key: CryptoKey): Promise<unknown> {
  const [ivHex, authTagHex, cipherHex] = encryptedStr.split(":");
  const iv = hexToBytes(ivHex);
  const authTag = hexToBytes(authTagHex);
  const cipher = hexToBytes(cipherHex);

  const cipherWithTag = new Uint8Array(cipher.length + authTag.length);
  cipherWithTag.set(cipher);
  cipherWithTag.set(authTag, cipher.length);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv, tagLength: 128 },
    key,
    cipherWithTag
  );

  return JSON.parse(new TextDecoder().decode(decrypted));
}
