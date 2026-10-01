import "./globals.css";

export const metadata = {
  title: "Happy Birthday Alika ♡ | To My Dearest Alika",
  description: "Di hari spesial ini, aku cuma mau bilang makasih udah selalu ada, jadi diri sendiri, dan bikin hari-hariku lebih berwarna.",
  icons: {
    icon: "/images/polaroid_flower.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="min-h-screen flex flex-col antialiased selection:bg-pink-300 selection:text-pink-900">
        {children}
      </body>
    </html>
  );
}
