import { useLenis } from './hooks/useLenis';
import Intro from './components/Intro/Intro';
import ProductOverview from './components/ProductOverview/ProductOverview';
import Outro from './components/Outro/Outro';
import './styles/globals.css';

function App() {
  useLenis();

  return (
    <>
      <Intro />
      <ProductOverview />
      <Outro />
    </>
  );
}

export default App;
