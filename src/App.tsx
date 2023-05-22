import { useState } from 'react';

import SearchForm from './components/SearchForm';
import SearchResults from './components/SearchResults';

import { dataGridI2classId } from './Utils';
import { VIEWPORT_WIDTH, LAYOUT_HEIGHT, LAYOUT_RATIO, LAYOUT_ROW_HEIGHT, LAYOUT_WIDTH } from './Constants';

import type { FormEvent } from 'react';
import type { Layout } from 'react-grid-layout-next';
import type SearchResultT from './types/SearchResultT';
import type SearchFormT from './types/SearchFormT';

const API_URL = 'http://localhost:8000';
const RESIZED_LAYOUT_WIDTH = 640;

const App = () => {
	const [searchResults, setSearchResults] = useState<SearchResultT[] | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	
	const preprocessLayout = (layout: Layout, newWidth: number = LAYOUT_WIDTH) => {
		const newHeight = newWidth / LAYOUT_RATIO;
		const widthRatio = newWidth / LAYOUT_WIDTH;
		const heightRatio = newHeight / LAYOUT_HEIGHT;

		return layout.map(({ i, x, y, w, h }) => [
			Math.round(x * LAYOUT_ROW_HEIGHT * widthRatio),			// x1
			Math.round(y * LAYOUT_ROW_HEIGHT * heightRatio),		// y1
			Math.round((x + w) * LAYOUT_ROW_HEIGHT * widthRatio),	// x2
			Math.round((y + h) * LAYOUT_ROW_HEIGHT * heightRatio),	// y2
			1, 														// confidence, because it's ground truth, the value is 1
			dataGridI2classId(i),									// class_id
		]);
	};
	const handleSearchFormSubmit = async (e: FormEvent<HTMLFormElement>, form: SearchFormT, layout: Layout) => {
		e.preventDefault();
		setIsLoading(true);
		setSearchResults(null);
		setTimeout(() => window.scrollTo({ top: VIEWPORT_WIDTH, behavior: 'smooth' }), 500);

		try {
			const response = await fetch(`${API_URL}/search`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					q: form.q,
					limit: form.limit,
					iou_threshold: form.precision_level / 100,
					layout_width: RESIZED_LAYOUT_WIDTH,
					layout: preprocessLayout(layout, RESIZED_LAYOUT_WIDTH),
				})
			});

			if (!response.ok) {
				// Throw an error with the error message returned by the API
				const errorData = await response.json();
				throw new Error(errorData.detail);
			}

			const responseJson = await response.json()
			const results = responseJson.results
			setSearchResults(results)
		} catch (error: any) {
			// Handle the error
			console.error(error.message);
		}

		setIsLoading(false);
	};

	return (
		<div>
			<SearchForm 
				onSubmit={handleSearchFormSubmit}
				isLoading={isLoading}
			/>
			<SearchResults
				cols={3}
				searchResults={searchResults}
				isLoading={isLoading}
			/>
		</div>
	);
}

export default App;