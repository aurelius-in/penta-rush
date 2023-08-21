export { generateStraightShape, generateAShape, generateSquareShape, generateBShape, generateCShape, generateDShape, generateEShape, generateFShape, generateGShape, generateTShape, generateZShape, generateSShape, generateUShape, generateRandomShape };

function generateStraightShape() {
    const segment = getRandomSegment();
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
        [0, , 0, 0, 0],
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
