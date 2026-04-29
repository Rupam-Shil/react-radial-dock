import 'react-radial-dock/styles.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui', background: '#111', color: '#fff', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  );
}

export const metadata = { title: 'react-radial-dock demo' };
