import Link from "next/link";


export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    <Link href="./pages/createRequest">Создание заявки</Link>
    <Link href="./pages/applicationsTable">Согласование заявки</Link>
    {/* <Link href="./pages/procurement">Работа над заявкой</Link> */}
    <Link href="./pages/procurementPage">Работа над заявкой</Link>
    </div>
  );
}
