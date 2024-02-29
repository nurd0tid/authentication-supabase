import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <title>Staterpack Nextjs</title>
      <link rel="icon" href={"../../../assets/images/brand/favicon.ico"} />
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&display=swap" />
      <link href="/assets/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" id="bootstrapLink"/>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
