import { CartProvider } from '../CartProvider';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CartProvider>
        <main>{children}</main>
      </CartProvider>
    </>
  );
}
