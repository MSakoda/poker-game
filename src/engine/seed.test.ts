import { describe, it, expect } from 'vitest';
import { seedForDate } from './seed';

describe('seedForDate', () => {
    it('encodes year, month, and day into a single number', () => {
        expect(seedForDate(new Date(Date.UTC(2026, 6, 29)))).toEqual(20260729);
    })

    it('is the same for two Date instances representing the same UTC day', () => {
        const a = seedForDate(new Date(Date.UTC(2026, 6, 29, 1)));
        const b = seedForDate(new Date(Date.UTC(2026, 6, 29, 23)));
        expect(a).toEqual(b);
    })

    it('is different for different days', () => {
        const a = seedForDate(new Date(Date.UTC(2026, 6, 29)));
        const b = seedForDate(new Date(Date.UTC(2026, 6, 30)));
        expect(a).not.toEqual(b);
    })
})
