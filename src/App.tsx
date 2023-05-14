import { useState, useEffect } from 'react';
import { GridLayout } from 'react-grid-layout-next';
import type { Layout } from 'react-grid-layout-next';
import Masonry from 'react-masonry-css';

const API_URL = 'http://localhost:8000'
const CLASSES = ['button', 'input', 'heading', 'image', 'link', 'text'] as const;
const LAYOUT_NEW_WIDTH = 640;

type SearchResult = {
	image_url: string,
	map: number,
	boxes: number[][],
};

const App = () => {
	const [viewportHeight, setViewportHeight] = useState<number>(window.innerHeight);
	const [counter, setCounter] = useState(0);
	const [form, setForm] = useState({
		q: '',
		limit: 10,
		precision_level: 10,
	});
	const [layout, setLayout] = useState<Layout>([]);
	const [results, setResults] = useState<SearchResult[] | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const ratio = 4 / 3;
	const LAYOUT_HEIGHT = viewportHeight - 154;
	const LAYOUT_WIDTH = LAYOUT_HEIGHT * ratio;
	const height = LAYOUT_WIDTH / ratio;
	const rowHeight = 11;
	const cols = LAYOUT_WIDTH / rowHeight;
	const initLayoutItemW = 16;
	const initLayoutItemH = 4;

	const dataGridI2classId = (i: string) => +i.replace(/_\d+$/, '');
	const preprocessLayout = (layout: Layout, newWidth: number = LAYOUT_WIDTH) => {
		const newHeight = newWidth / ratio;
		const widthRatio = newWidth / LAYOUT_WIDTH;
		const heightRatio = newHeight / height;

		return layout.map(({ i, x, y, w, h }) => [
			Math.round(x * rowHeight * widthRatio),			// x1
			Math.round(y * rowHeight * heightRatio),		// y1
			Math.round((x + w) * rowHeight * widthRatio),	// x2
			Math.round((y + h) * rowHeight * heightRatio),	// y2
			1, 												// confidence, because it's ground truth, the value is 1
			dataGridI2classId(i),							// class_id
		]);
	};
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm((prevForm) => ({
			...prevForm,
			[e.target.name]: e.target.value,
		}))
	};
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		setResults(null);
		setTimeout(() => window.scrollTo({ top: viewportHeight, behavior: 'smooth' }), 500);


		try {
			const response = await fetch(`${API_URL}/search`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					q: form.q,
					limit: form.limit,
					iou_threshold: form.precision_level / 100,
					layout_width: LAYOUT_NEW_WIDTH,
					layout: preprocessLayout(layout, LAYOUT_NEW_WIDTH),
				})
			});

			if (!response.ok) {
				// Throw an error with the error message returned by the API
				const errorData = await response.json();
				throw new Error(errorData.detail);
			}

			const responseJson = await response.json()
			const results = responseJson.results
			setResults(results)
		} catch (error: any) {
			// Handle the error
			console.error(error.message);
		}

		setIsLoading(false);
	};

	useEffect(() => {
		const handleResize = () => {
			setViewportHeight(window.innerHeight);
		}

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return (
		<div>
			<form className="grid grid-cols-12 gap-4 p-4" onSubmit={handleSubmit}>
				<div className="col-span-12 flex bg-gray-300 border border-gray-300">
					<div className="flex-grow bg-white border-r border-gray-300">
						<div className="flex items-center h-14 px-4 border-b border-gray-300">
							<h1 className="font-bold">LayScout</h1>
						</div>
						<div className="p-4">
							<div className="grid grid-cols-1 gap-2 ">
								<div className="form-control w-full">
									<label className="label">
										<span className="label-text text-xs">Search Keywords</span>
									</label>
									<input
										type="text"
										name="q"
										placeholder="cool web design"
										className="input input-bordered"
										value={form.q}
										onChange={handleInputChange}
										required
									/>
								</div>
								<div className="form-control w-full">
									<label className="label">
										<span className="label-text text-xs">Max. Number of Results</span>
									</label>
									<input
										type="number"
										min={0}
										name="limit"
										placeholder="10"
										className="input input-bordered"
										value={form.limit}
										onChange={handleInputChange}
										required
									/>
								</div>
								<div className="form-control w-full">
									<label className="label">
										<span className="label-text text-xs">Precision Level</span>
									</label>

									<label className="input-group">
										<input
											type="number"
											min={0}
											name="precision_level"
											placeholder="10"
											className="input input-bordered w-full"
											value={form.precision_level}
											onChange={handleInputChange}
											required
										/>
										<span>%</span>
									</label>
								</div>
							</div>
						</div>
					</div>
					<div>
						<div className="flex items-center bg-white h-14 px-4 border-b border-gray-300">
							<div className="-mx-1">
								{CLASSES.map((label, i) => (
									<button
										key={i}
										className="btn btn-primary btn-xs btn-outline mx-1"
										type="button"
										onClick={() => {
											setLayout((prevLayout) => [
												...prevLayout,
												{
													i: i + '_' + counter,
													x: 0,
													y: 0,
													w: initLayoutItemW,
													h: initLayoutItemH,
												},
											]);
											setCounter(counter + 1);
										}}
									>
										<span>{label}</span>
										&nbsp;
										<span className="-mt-0.5">+</span>
									</button>
								))}
							</div>
						</div>

						{layout && (
							<GridLayout
								allowOverlap
								cols={cols}
								rowHeight={rowHeight}
								width={LAYOUT_WIDTH}
								margin={[0, 0]}
								layout={layout}
								onLayoutChange={(layout) => setLayout(layout)}
								className="layout"
								style={{ width: LAYOUT_WIDTH, minHeight: height }}
							>
								{layout.map((dataGrid) => (
									<div
										key={dataGrid.i}
										data-grid={dataGrid}
										className="inline-flex justify-center items-center bg-white bg-opacity-80 border border-gray-300 cursor-pointer select-none"
									>
										{CLASSES[dataGridI2classId(dataGrid.i)]}
									</div>
								))}
							</GridLayout>
						)}
					</div>
				</div>
				<button
					type="submit"
					className="col-span-12 btn btn-primary"
					disabled={!(form.q && layout.length) || isLoading}
				>
					{!isLoading ? 'Search' : 'Loading...'}
				</button>
			</form>

			{/* <pre>
				{JSON.stringify(preprocessLayout(layout, LAYOUT_NEW_WIDTH))}
			</pre> */}

			{(results || isLoading) && (
				<div className="flex min-h-screen p-4">
					{isLoading && (<div className="flex-grow flex justify-center items-center">Loading...</div>)}
					{results && (
						results.length ? (
							<Masonry
								breakpointCols={4}
								className="my-masonry-grid"
								columnClassName="my-masonry-grid_column"
							>
								{results.map(({ image_url, map }, i) => (
									<div key={i}>
										<div className="flex flex-col border border-gray-300">
											<div className="flex justify-between text-xs p-2 border-b border-gray-300">
												<a href={image_url} target="_blank" className="link link-primary w-32 truncate">{image_url}</a>
												<div className="text-right">
													Match: <span className="font-semibold">{(map * 100).toFixed(0)}%</span>
												</div>
											</div>
											<img src={image_url} alt="" />

										</div>
									</div>
								))}
							</Masonry>
						) : (<div className="flex-grow flex justify-center items-center">No results found.</div>)
					)}
				</div>
			)}
		</div>
	);
}

export default App
