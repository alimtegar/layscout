import ClassIdT from './types/ClassIdT';

export const CLASS_IDS = [0, 1, 2, 3, 4, 5];
export const CLASS_MAP: { [key in ClassIdT]: string } = {
	0: 'button',
	1: 'input',
	2: 'heading',
	3: 'image',
	4: 'link',
	5: 'text',
};
export const CLASS_COLOR_MAP: { [key in ClassIdT]: string } = {
    0: 'red-500',    // button
    1: 'yellow-500', // input
    2: 'green-500',  // heading
    3: 'blue-500',   // image
    4: 'purple-500', // link
    5: 'pink-500',   // text
};

export const VIEWPORT_HEIGHT = window.innerHeight;
export const VIEWPORT_WIDTH = window.innerWidth;
export const LAYOUT_RATIO = 4 / 3;
export const LAYOUT_HEIGHT = VIEWPORT_HEIGHT - 154;
export const LAYOUT_WIDTH = LAYOUT_HEIGHT * LAYOUT_RATIO;
// const LAYOUT_MIN_HEIGHT = LAYOUT_WIDTH / LAYOUT_RATIO;
export const LAYOUT_ROW_HEIGHT = 11;
export const LAYOUT_COL_HEIGHT = 4;
export const LAYOUT_COL_WIDTH = 16;
export const LAYOUT_COLS = LAYOUT_WIDTH / LAYOUT_ROW_HEIGHT;