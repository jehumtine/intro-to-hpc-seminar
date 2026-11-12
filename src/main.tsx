import { createRoot } from 'react-dom/client';
import '@fontsource/cinzel/400.css';
import '@fontsource/cinzel/600.css';
import '@fontsource/eb-garamond/400.css';
import '@fontsource/eb-garamond/400-italic.css';
import '@fontsource/eb-garamond/500.css';
import './styles.css';
import { Deck } from './deck/Deck';
import { Presenter } from './deck/Presenter';
import { slides } from './slides';

const params = new URLSearchParams(location.search);
const presenter = params.has('presenter');
const explore = params.has('explore');
document.title = presenter ? 'Presenter · HPC Symposium' : 'A Symposium on High Performance Computing';

createRoot(document.getElementById('root')!).render(presenter ? <Presenter slides={slides} /> : <Deck slides={slides} explore={explore} />);
