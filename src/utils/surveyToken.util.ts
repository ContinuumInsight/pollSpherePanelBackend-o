import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';
import config from '../config/config';

export interface SurveyTokenPayload {
  survey_id: string;
  vendor_id: string;
  country: string;
}

type CompactSurveyTokenPayload = {
  s: string;
  v: string;
  c: string;
};

const TOKEN_PREFIX = 'psv1';

const base64UrlEncode = (wordArray: CryptoJS.lib.WordArray): string => {
  const b64 = CryptoJS.enc.Base64.stringify(wordArray);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

const base64UrlDecode = (input: string): CryptoJS.lib.WordArray => {
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padLength = (4 - (b64.length % 4)) % 4;
  const padded = b64 + '='.repeat(padLength);
  return CryptoJS.enc.Base64.parse(padded);
};

const getTokenKey = (): CryptoJS.lib.WordArray => {
  const secret = process.env.SURVEY_TOKEN_SECRET || config.jwtSecret;
  return CryptoJS.SHA256(secret);
};

const constantTimeEquals = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
};

export const surveyTokenUtils = {
  // Generate survey token (preferred: encrypted + signed, legacy: JWT)
  // NOTE: This does not add expiration; add it if you want links to expire.
  generateSurveyToken(payload: SurveyTokenPayload): string {
    const key = getTokenKey();
    const iv = CryptoJS.lib.WordArray.random(16);

    const compact: CompactSurveyTokenPayload = {
      s: payload.survey_id,
      v: payload.vendor_id,
      c: payload.country,
    };

    const plaintext = JSON.stringify(compact);
    const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const ciphertext = encrypted.ciphertext;

    const macInput = iv.clone().concat(ciphertext);
    const mac = CryptoJS.HmacSHA256(macInput, key);

    const ivPart = base64UrlEncode(iv);
    const ctPart = base64UrlEncode(ciphertext);
    const macPart = base64UrlEncode(mac);

    return `${TOKEN_PREFIX}.${ivPart}.${ctPart}.${macPart}`;
  },

  // Verify and decode survey token
  // Supports both:
  // - Encrypted tokens: psv1.<iv>.<ciphertext>.<hmac>
  // - Legacy JWT tokens (previous implementation)
  verifySurveyToken(token: string): SurveyTokenPayload | null {
    try {
      if (token.startsWith(`${TOKEN_PREFIX}.`)) {
        const parts = token.split('.');
        if (parts.length !== 4) return null;

        const [, ivPart, ctPart, macPart] = parts;
        const iv = base64UrlDecode(ivPart);
        const ciphertext = base64UrlDecode(ctPart);
        const providedMac = macPart;

        const key = getTokenKey();
        const macInput = iv.clone().concat(ciphertext);
        const expectedMac = base64UrlEncode(CryptoJS.HmacSHA256(macInput, key));
        if (!constantTimeEquals(providedMac, expectedMac)) return null;

        const decrypted = CryptoJS.AES.decrypt({ ciphertext } as any, key, {
          iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        });

        const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
        if (!plaintext) return null;

        const compact = JSON.parse(plaintext) as CompactSurveyTokenPayload;
        if (!compact?.s || !compact?.v || !compact?.c) return null;

        return {
          survey_id: compact.s,
          vendor_id: compact.v,
          country: compact.c,
        };
      }

      // Legacy JWT fallback
      const decoded = jwt.verify(token, config.jwtSecret) as SurveyTokenPayload;
      return decoded;
    } catch {
      return null;
    }
  },
};
