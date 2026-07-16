import { AcademicApp } from "@/src/components/academic-app";
import { getAcademicSnapshot } from "@/src/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const initialSnapshot = await getAcademicSnapshot();
  return <AcademicApp initialSnapshot={initialSnapshot} />;
}
