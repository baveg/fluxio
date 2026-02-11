import { describe, expect, it, vi } from 'vitest';
import { sha256 } from './sha256';

// NIST test vectors + known values
const vectors = [
    ['', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'],
    ['abc', 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'],
    ['abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq', '248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1'],
    ['hello world', 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9'],
    ['The quick brown fox jumps over the lazy dog', 'd7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592'],
] as const;

describe('sha256 (native crypto.subtle)', () => {
    for (const [input, expected] of vectors) {
        it(`hash("${input.slice(0, 30)}${input.length > 30 ? '...' : ''}")`, async () => {
            expect(await sha256(input)).toBe(expected);
        });
    }
});

describe('sha256 (pure JS fallback)', () => {
    for (const [input, expected] of vectors) {
        it(`hash("${input.slice(0, 30)}${input.length > 30 ? '...' : ''}")`, async () => {
            // Force fallback by hiding crypto.subtle
            const originalCrypto = globalThis.crypto;
            vi.stubGlobal('crypto', undefined);
            try {
                expect(await sha256(input)).toBe(expected);
            } finally {
                vi.stubGlobal('crypto', originalCrypto);
            }
        });
    }
});

describe('sha256 UTF-8', () => {
    it('handles accented characters', async () => {
        const hash = await sha256('héllo');
        expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });

    it('handles emoji (surrogate pairs)', async () => {
        const hash = await sha256('hello 🌍');
        expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });

    it('pure JS fallback matches native for UTF-8', async () => {
        const native = await sha256('café ☕ 日本語');

        const originalCrypto = globalThis.crypto;
        vi.stubGlobal('crypto', undefined);
        try {
            const pure = await sha256('café ☕ 日本語');
            expect(pure).toBe(native);
        } finally {
            vi.stubGlobal('crypto', originalCrypto);
        }
    });
});
