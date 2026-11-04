import Link from "next/link";
import { AcademicApp } from "@/src/components/academic-app";
import { getAcademicSnapshot } from "@/src/lib/db";

export const dynamic = "force-dynamic";

export default async function Organizer() {
  let snapshot;
  try {
    snapshot = await getAcademicSnapshot();
  } catch { snapshot = null; }
  if (!snapshot) return <main className="organizer-unavailable"><h1>Organizador acadêmico</h1><p>Os registros do organizador continuam no banco original. Este ambiente não está conectado a ele.</p><p>A área de estudos funciona independentemente do organizador.</p><Link href="/">Voltar aos estudos</Link></main>;
  return <><div className="study-return"><Link href="/">← Voltar aos estudos</Link></div><AcademicApp initialSnapshot={snapshot} /></>;
}
