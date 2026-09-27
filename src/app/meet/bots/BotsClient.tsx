import Link from 'next/link';
export default function BotsClient() {
  return <main className="min-h-screen bg-gray-950 text-white p-8"><h1 className="text-2xl font-bold">Toti meeting room</h1><p className="my-4">External meeting bots have been retired.</p><Link href="/meet" className="text-vibrantorange">Open your meeting room</Link></main>;
}
