import '../styles/index.css'
import { Provider as LyketProvider} from “@lyket/react”

export default function MyApp({ Component, pageProps }) {
  return (
    <LyketProvider apiKey="acc0dbccce8e557db5ebbe6d605aaa">
      <Component {...pageProps} />
    </LyketProvider>
  );
}
