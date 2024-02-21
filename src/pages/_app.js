import '../styles/globals.css'
import '../styles/style.css'
import MainLayout from '@/layouts/MainLayout';

const layouts = {
  MainLayout: MainLayout,
};
export default function App({ Component, pageProps }) {
  const Layout = layouts[Component.layout] || ((pageProps) => <Component>{pageProps}</Component>);

  return  (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
