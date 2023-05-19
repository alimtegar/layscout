import { useState, useRef, useEffect } from 'react';

import SearchResultT from '../types/SearchResultT';

const SearchResult = ({ image_url, map, boxes }: SearchResultT) => {
    const [viewportWidth, setViewportWidth] = useState<number>(window.innerWidth);
    // const [imgContainerSize, setImgContainerSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
    const [imgSize, setImgSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

    // const imgContainerRef = useRef<HTMLDivElement>(null)

    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const { naturalWidth, naturalHeight } = e.currentTarget;
        setImgSize({ width: naturalWidth, height: naturalHeight });
    };

    // useEffect(() => {
    //     const { current } = imgContainerRef;
    //     if (current) {
    //         const { offsetWidth, offsetHeight } = current;
    //         setImgContainerSize({ width: offsetWidth, height: offsetHeight });
    //     }
    // }, []);

    return (
        <div>
            <div className="flex flex-col border border-gray-300">
                <div className="flex justify-between text-xs p-2 border-b border-gray-300">
                    <a href={image_url} target="_blank" className="link link-primary w-32 truncate">{image_url}</a>
                    <div className="text-right">
                        Match: <span className="font-semibold">{(map * 100).toFixed(0)}%</span>
                    </div>
                    {/* {JSON.stringify(imgContainerSize)} */}
                </div>

                <div className="relative">
                    <img
                        src={image_url}
                        alt={image_url}
                        onLoad={handleImageLoad}
                    />
                    <div className="absolute top-0">
                        <div className="relative">
                            {boxes.map((box) => {
                                const [x1, y1, x2, y2] = box;

                                const BREAKPOINT_COLS = 4
                                const LAYOUT_NEW_WIDTH = 640
                                // const cardW = 395
                                // viewportWidth - (sidePadding * 2) - (innerPadding * (BREAKPOINT_COLS - 1))
                                const cardW = (viewportWidth - (16 * 2) - (8 * (BREAKPOINT_COLS - 1))) / BREAKPOINT_COLS
                                console.log(viewportWidth, cardW)

                                const wRatio = cardW / LAYOUT_NEW_WIDTH;
                                const cardH = imgSize.height * cardW / imgSize.width;
                                const layoutH = LAYOUT_NEW_WIDTH * cardH / cardW;
                                const hRatio = cardH / layoutH;

                                const newX1 = x1 * wRatio
                                const newY1 = y1 * hRatio
                                const newX2 = x2 * wRatio
                                const newY2 = y2 * hRatio

                                const w = newX2 - newX1;
                                const h = newY2 - newY1;
                                return (
                                    <div
                                        key={`${x1}-${y1}-${w}-${h}`}
                                        style={{
                                            position: 'absolute',
                                            left: newX1,
                                            top: newY1,
                                            width: w,
                                            height: h,
                                            border: '1px solid red'
                                        }}
                                    />
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchResult;