import { render } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';

import { MainMenu } from './components/MainMenu/index.jsx';
import { Home } from './pages/Home/index.jsx';
import { NotFound } from './pages/_404.jsx';
import './style.css';

export function App() {
	return (
		<LocationProvider>
			<main>
				<Router>
          {/**@ts-expect-error*/}
					<Route path="/" component={Home} />
					<Route default component={NotFound} />
				</Router>
			</main>
			<MainMenu />
		</LocationProvider>
	);
}

render(<App />, document.getElementById('app'));
