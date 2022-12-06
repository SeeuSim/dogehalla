import "./output.css";
import NavBar from "./navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <main className="min-h-screen p-16 justify-center items-center bg-gray-100 dark:bg-slate-900">
          <NavBar/>
          {children}
        </main>
      </body>
    </html>
  )
}
