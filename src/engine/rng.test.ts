import { describe, it, expect } from 'vitest';
import { createRng } from './rng';

describe('createRng', () => {
    it('is identical for the same seed', () => {
        const a = createRng(12345);
        const b = createRng(12345);
        const seqA = Array.from({ length: 100 }, () => a());
        const seqB = Array.from({ length: 100 }, () => b());
        expect(seqA).toEqual(seqB);
    })

    it('is different for different seeds', () => {
        const a = createRng(12345);
        const b = createRng(54321);
        const seqA = Array.from({ length: 100 }, () => a());
        const seqB = Array.from({ length: 100 }, () => b());
        expect(seqA).not.toEqual(seqB);
    })

    it('produces numbers in the range of 0 to 1, including 0 but excluding 1', () => {
        const rng = createRng(12345);
        for (let i = 0; i < 5; i++) {
            const num = rng();
            expect(num).toBeGreaterThanOrEqual(0);
            expect(num).toBeLessThan(1);
        }
    })
})