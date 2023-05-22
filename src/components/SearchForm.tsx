import { useState } from 'react';
import { GridLayout } from 'react-grid-layout-next';

import {
    CLASS_COLOR_MAP,
    CLASS_MAP,
    LAYOUT_COLS,
    LAYOUT_COL_HEIGHT,
    LAYOUT_COL_WIDTH,
    LAYOUT_HEIGHT,
    LAYOUT_ROW_HEIGHT,
    LAYOUT_WIDTH,
} from '../Constants';

import type { FormEvent } from 'react';
import type { Layout } from 'react-grid-layout-next';
import type SearchFormT from '../types/SearchFormT';

type Props = {
    isLoading: boolean,
    onSubmit: (e: FormEvent<HTMLFormElement>, form: SearchFormT, layout: Layout) => void,
};

const SearchForm = ({ isLoading, onSubmit, ...rest }: Props) => {
    const [counter, setCounter] = useState(0);
    const [form, setForm] = useState({
        q: '',
        limit: 10,
        precision_level: 10,
    });
    const [layout, setLayout] = useState<Layout>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prevForm) => ({
            ...prevForm,
            [e.target.name]: e.target.value,
        }))
    };
    const dataGridI2classId = (i: string) => +i.replace(/_\d+$/, '');

    return (
        <form className="grid grid-cols-12 gap-4 p-4" {...rest} onSubmit={(e) => onSubmit(e, form, layout)}>
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
                    <div
                        className="flex items-center bg-white h-14 px-3 border-b border-gray-300 overflow-x-scroll"
                        style={{ width: LAYOUT_WIDTH }}
                    >
                        {/* <div className="-mx-1"> */}
                        {Object.entries(CLASS_MAP).map(([classId, claas_]) => (
                            <button
                                key={classId}
                                className={`btn btn-class-${classId} btn-xs btn-outline mx-1`}
                                type="button"
                                onClick={() => {
                                    setLayout((prevLayout) => [
                                        ...prevLayout,
                                        {
                                            i: classId + '_' + counter,
                                            x: 0,
                                            y: 0,
                                            w: LAYOUT_COL_WIDTH,
                                            h: LAYOUT_COL_HEIGHT,
                                        },
                                    ]);
                                    setCounter(counter + 1);
                                }}
                            >
                                <span>{claas_}</span>
                                &nbsp;
                                <span className="-mt-0.5">+</span>
                            </button>
                        ))}
                        {/* </div> */}
                    </div>

                    {layout && (
                        <GridLayout
                            allowOverlap
                            cols={LAYOUT_COLS}
                            rowHeight={LAYOUT_ROW_HEIGHT}
                            width={LAYOUT_WIDTH}
                            margin={[0, 0]}
                            layout={layout}
                            onLayoutChange={(layout) => setLayout(layout)}
                            className="layout"
                            style={{
                                width: LAYOUT_WIDTH,
                                minHeight: LAYOUT_HEIGHT,
                                // minHeight: 'calc(100% - 56px)',

                                // Grid lines styles
                                backgroundSize: `${LAYOUT_ROW_HEIGHT}px ${LAYOUT_ROW_HEIGHT}px`,
                                backgroundImage: `linear-gradient(to right, #bbbbbb 1px, transparent 1px), linear-gradient(to bottom, #bbbbbb 1px, transparent 1px)`,
                            }}
                        >
                            {layout.map((dataGrid) => (
                                <div
                                    key={dataGrid.i}
                                    data-grid={dataGrid}
                                    className={`inline-flex justify-center items-center bg-class-${dataGridI2classId(dataGrid.i)} bg-opacity-90 text-white text-sm uppercase font-semibold cursor-pointer select-none`}
                                >
                                    {CLASS_MAP[dataGridI2classId(dataGrid.i)]}
                                </div>
                            ))}
                        </GridLayout>
                    )}
                </div>
            </div>
            <button
                type="submit"
                className="col-span-12 btn"
                disabled={!(form.q && layout.length) || isLoading}
            >
                {!isLoading ? 'Search' : 'Loading...'}
            </button>
        </form>
    );
};

export default SearchForm;