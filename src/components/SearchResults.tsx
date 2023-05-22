import Masonry from 'react-masonry-css';

import SearchResult from '../components/SearchResult';
import SearchResultT from '../types/SearchResultT';

type Props = {
    searchResults: SearchResultT[] | null,
    cols: number,
    isLoading: boolean,
};

const SearchResults = ({ searchResults, cols, isLoading }: Props) => (searchResults || isLoading) ? (
    <div className="flex min-h-screen p-4">
        {isLoading && (<div className="flex-grow flex justify-center items-center">Loading...</div>)}
        {searchResults && (
            searchResults.length ? (
                <Masonry
                    breakpointCols={cols}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                >
                    {searchResults.map((searchResult) => (
                        <SearchResult
                            {...searchResult}
                            cols={cols}
                            key={searchResult.image_url}
                        />
                    ))}
                </Masonry>
            ) : (<div className="flex-grow flex justify-center items-center">No results found.</div>)
        )}
    </div>
) : null;

export default SearchResults;