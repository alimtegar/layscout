import { useState } from 'react';

import type SearchResultT from '../types/SearchResultT';

const RESIZED_LAYOUT_WIDTH = 640;

const SearchResult = ({ image_url, map, boxes, cols }: SearchResultT & { cols: number }) => {
    const [imgSize, setImgSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
    // const [classCounts, setClassCounts] = useState<{[key in ClassIdT]: number}>({
    //     0: 0,
    //     1: 0,
    //     2: 0,
    //     3: 0,
    //     4: 0,
    //     5: 0,
    // });

    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const { naturalWidth, naturalHeight } = e.currentTarget;
        setImgSize({ width: naturalWidth, height: naturalHeight });
    };

    return (
        <div>
            <div className="flex flex-col border border-gray-300">
                <div className="flex justify-between text-xs p-2 border-b border-gray-300">
                    <a href={image_url} target="_blank" className="link link-primary w-32 truncate">{image_url}</a>
                    <div className="text-right">
                        Match: <span className="font-semibold">{(map * 100).toFixed(0)}%</span>
                    </div>
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
                                const [initX1, initY1, initX2, initY2, _, classId] = box;

                                // setClassCounts((prevClassCounts) => ({
                                //     ...prevClassCounts,
                                //     [classId]: prevClassCounts[classId]+1,
                                // }))

                                const vw = window.innerWidth;
                                // vw - (sidePadding * 2) - (innerPadding * (cols - 1))
                                const containerW = (vw - (16 * 2) - (8 * (cols - 1))) / cols

                                const wRatio = containerW / RESIZED_LAYOUT_WIDTH;
                                const cardH = imgSize.height * containerW / imgSize.width;
                                const layoutH = RESIZED_LAYOUT_WIDTH * cardH / containerW;
                                const hRatio = cardH / layoutH;

                                const x1 = initX1 * wRatio
                                const y1 = initY1 * hRatio
                                const x2 = initX2 * wRatio
                                const y2 = initY2 * hRatio

                                const w = x2 - x1;
                                const h = y2 - y1;
                                return (
                                    <div
                                        key={`${x1}-${y1}-${w}-${h}`}
                                        className={`absolute border border-class-${classId}`}
                                        style={{
                                            left: x1,
                                            top: y1,
                                            width: w,
                                            height: h,
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