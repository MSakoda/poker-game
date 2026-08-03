import { GameShell } from '../components/GameShell';
import { seedForDate } from "@/engine/seed";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ searchParams }: Props) {
  const { seed } = await searchParams;
  const seedParam = Array.isArray(seed) ? seed[0] : seed;
  const parsedSeed = seedParam !== undefined ? Number(seedParam) : NaN;
  const runSeed = Number.isFinite(parsedSeed) ? parsedSeed : seedForDate(new Date());

  return <GameShell seed={runSeed} />;
}
