import Head from 'next/head';
import Button from '../components/button';

export default function Index() {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="/css/styles.css" />
      </Head>
      <div className="C(#77d) Bgc(orange):a Px(20) W(120)">
        <span className="C(#fff) Bgc(grey)">Hello</span>
        <Button />
      </div>
    </>
  );
}
