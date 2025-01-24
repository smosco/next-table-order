export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <h1>Customer</h1>
      <main>{children}</main>
    </>
  );
}
