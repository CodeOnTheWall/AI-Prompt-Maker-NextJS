// remove / from @/ in jsconfig.json and change to @*
import "@styles/globals.css";

export const metadata = {
  title: "Promptaliza",
  description: "Share and create custom ai prompts",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="main">
          <div className="gradient" />
        </div>
        <main className="app">{children}</main>
      </body>
    </html>
  );
}
