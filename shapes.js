export { generateStraightShape, generateAShape, generateSquareShape, generateBShape, generateCShape, generateDShape, generateEShape, generateFShape, generateGShape, generateTShape, generateZShape, generateSShape, generateUShape, generateRandomShape };
export const SQUARE_COLOR_INDEX = 1;
export const T_SHAPE_COLOR_INDEX = 2;
export const A_SHAPE_COLOR_INDEX = 3;
export const B_SHAPE_COLOR_INDEX = 4;
export const C_SHAPE_COLOR_INDEX = 5;
export const D_SHAPE_COLOR_INDEX = 6;
export const E_SHAPE_COLOR_INDEX = 7;
export const F_SHAPE_COLOR_INDEX = 8;
export const G_SHAPE_COLOR_INDEX = 9;
export const Z_SHAPE_COLOR_INDEX = 10;
export const S_SHAPE_COLOR_INDEX = 11;
export const U_SHAPE_COLOR_INDEX = 12;
export const STRAIGHT_COLOR_INDEX = 13;

export const SHAPES_COLORS = [
  null,  // No color for index 0
  "#f00", // Red for shape 1
  "#0f0", // Green for shape 2
  "#00f", // Blue for shape 3
  "#ff0", // Yellow for shape 4
  "#0ff", // Cyan for shape 5
  "#f0f", // Magenta for shape 6
  "#f90", // Orange for shape 7
  "#90f", // Violet for shape 8
  "#09f", // Teal for shape 9
  "#f09", // Rose for shape 10
  "#966", // Brown for shape 11
  "#6f9", // Lime Green for shape 12
  "#609"  // Indigo for shape 13
];

function generateStraightShape() {
    const segment = STRAIGHT_COLOR_INDEX;
    return [
        [segment, segment, segment, segment, segment],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}
function generateAShape() {
    const segment = A_SHAPE_COLOR_INDEX;
    return [
        [segment, segment, segment, segment, 0],
        [0, segment, 0, 0, 0],
        [0, 0, 0, 0, 0], // Corrected line
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}

function generateSquareShape() {
    const segment = SQUARE_COLOR_INDEX;
    return [
        [0, 0, segment, segment, 0],
        [0, 0, segment, segment, 0],
        [0, 0, segment, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}

function generateBShape() {
    const segment = B_SHAPE_COLOR_INDEX;
    return [
        [segment, segment, segment, 0, 0],
        [0, 0, segment, 0, 0],
        [0, 0, segment, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}

function generateCShape() {
    const segment = C_SHAPE_COLOR_INDEX;
    return [
        [0, 0, segment, segment, 0],
        [0, 0, segment, segment, 0],
        [0, 0, 0, segment, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}

function generateDShape() {
    const segment = D_SHAPE_COLOR_INDEX;
    return [
        [0, segment, 0, 0, 0],
        [segment, segment, segment, 0, 0],
        [0, segment, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}

function generateEShape() {
    const segment = E_SHAPE_COLOR_INDEX;
    return [
        [segment, 0, 0, 0, 0],
        [segment, 0, 0, 0, 0],
        [segment, segment, segment, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}

function generateFShape() {
    const segment = F_SHAPE_COLOR_INDEX;
    return [
        [0, 0, segment, 0, 0],
        [0, 0, segment, 0, 0],
        [segment, segment, segment, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}

function generateGShape() {
    const segment = G_SHAPE_COLOR_INDEX;
    return [
        [segment, segment, 0, 0, 0],
        [segment, 0, 0, 0, 0],
        [segment, 0, 0, 0, 0],
        [segment, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}


function generateTShape() {
    const segment = T_SHAPE_COLOR_INDEX;
    return [
        [0, segment, 0, 0, 0],
        [segment, segment, segment, 0, 0],
        [segment, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}

function generateZShape() {
    const segment = Z_SHAPE_COLOR_INDEX;
    return [
        [segment, segment, 0, 0, 0],
        [0, segment, 0, 0, 0],
        [0, segment, 0, 0, 0],
        [0, segment, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}


function generateSShape() {
    const segment = S_SHAPE_COLOR_INDEX;
    return [
        [0, segment, segment, 0, 0],
        [segment, segment, 0, 0, 0],
        [0, segment, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}

function generateUShape() {
    const segment = U_SHAPE_COLOR_INDEX;
    return [
        [segment, 0, segment, 0, 0],
        [segment, segment, segment, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}
function generateRandomShape() {
    const shapeGenerators = [
        generateStraightShape, 
        generateSquareShape, 
        generateTShape, 
        generateZShape, 
        generateSShape,
generateAShape, 
generateBShape, 
generateCShape, 
generateDShape, 
generateEShape, 
generateFShape, 
generateGShape, 
        generateUShape
    ];
    const randomIndex = Math.floor(Math.random() * shapeGenerators.length);
    return shapeGenerators[randomIndex]();
}
