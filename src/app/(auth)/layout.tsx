export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <a href="/" className="mb-8 text-2xl font-bold tracking-tight text-gray-900">
        link-in-bio
      </a>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
