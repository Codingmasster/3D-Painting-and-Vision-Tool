
let startX, startY; // Variables to store starting position
let drawing = false;
let rotating = false;
let currentShapeType = null;
let shapes = []; // Array to store shapes
let rotatingShape = null;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  background(0);
}
function clearCanvas() {
  clear();
  setup();
}

function startDrawing(shapeType) {
  currentShapeType = shapeType;
  rotating = false;

  // Attach mousePressed event handler for starting drawing
  mousePressed = function () {
    if (!drawing) {
      startX = mouseX;
      startY = mouseY;
      drawing = true;
    }
  };

  // Attach mouseDragged event handler for dynamic drawing
  mouseDragged = function () {
    if (drawing) {
      let currentX = mouseX;
      let currentY = mouseY;
      redrawShapes();
      if (currentShapeType === 'circle') {
        drawTemporaryCircle(startX, startY, currentX, currentY);
      }
      else if (currentShapeType === 'ellipse') {
        drawTemporaryEllipse(startX, startY, currentX, currentY);
      } else if (currentShapeType === 'triangle') {
        drawTemporaryTriangle(startX, startY, currentX, currentY);
      } else if (currentShapeType === 'square') {
        drawTemporarySquare(startX, startY, currentX, currentY);
      } else if (currentShapeType === 'rect') {
        drawTemporaryRect(startX, startY, currentX, currentY);
      } else if (currentShapeType === 'arc') {
        drawTemporaryArc(startX, startY, currentX, currentY);
      } else if (currentShapeType === 'quad') {
        drawTemporaryQuad(startX, startY, currentX, currentY);
      } else if (currentShapeType === 'line') {
        drawTemporaryLine(startX, startY, currentX, currentY);
      }
    }
  };

  // Attach mouseReleased event handler to stop drawing
  mouseReleased = function () {
    if (drawing) {
      let endX = mouseX;
      let endY = mouseY;
      if (currentShapeType === 'circle') {
        let diameter = dist(startX, startY, endX, endY) * 2;
        shapes.push({
          type: 'circle',
          x: (startX + endX) / 2,
          y: (startY + endY) / 2,
          diameter: diameter,
          angleX: 0,
          angleY: 0,
          angleZ: 0
        });
      }
      else if (currentShapeType === 'ellipse') {
        let diameterX = abs(endX - startX);
        let diameterY = abs(endY - startY);
        shapes.push({
          type: 'ellipse',
          x: (startX + endX) / 2,
          y: (startY + endY) / 2,
          diameterX: diameterX,
          diameterY: diameterY,
          angleX: 0,
          angleY: 0,
          angleZ: 0
        });
      }
      else if (currentShapeType === 'triangle') {
        let x3 = startX + (endX - startX) * 2;
        let centerX = (startX + endX + x3) / 3;
        let centerY = (startY + endY + startY) / 3;
        shapes.push({
          type: 'triangle',
          x1: startX,
          y1: startY,
          x2: endX,
          y2: endY,
          x3: x3,
          y3: startY,
          centerX: centerX,
          centerY: centerY,
          angleX: 0,
          angleY: 0,
          angleZ: 0
        });
      } else if (currentShapeType === 'square') {
        let sideLength = max(abs(endX - startX), abs(endY - startY));
        shapes.push({
          type: 'square',
          x: (startX + endX) / 2,
          y: (startY + endY) / 2,
          sideLength: sideLength,
          angleX: 0,
          angleY: 0,
          angleZ: 0
        });
      } else if (currentShapeType === 'rect') {
        let widthRect = abs(endX - startX);
        let heightRect = abs(endY - startY);
        shapes.push({
          type: 'rect',
          x: (startX + endX) / 2,
          y: (startY + endY) / 2,
          widthRect: widthRect,
          heightRect: heightRect,
          angleX: 0,
          angleY: 0,
          angleZ: 0
        });
      } else if (currentShapeType === 'arc') {
        let diameter = dist(startX, startY, endX, endY) * 2;
        let startAngle = atan2(endY - startY, endX - startX);
        shapes.push({
          type: 'arc',
          x: (startX + endX) / 2,
          y: (startY + endY) / 2,
          diameter: diameter,
          startAngle: startAngle,
          endAngle: startAngle + PI,
          angleX: 0,
          angleY: 0,
          angleZ: 0
        });
      } else if (currentShapeType === 'quad') {
        let centerX = (startX + mouseX) / 2;
        let centerY = (startY + mouseY) / 2;
        let halfWidth = abs(mouseX - startX) / 2;
        let halfHeight = abs(mouseY - startY) / 2;
        shapes.push({
          type: 'quad',
          centerX: centerX,
          centerY: centerY,
          halfWidth: halfWidth,
          halfHeight: halfHeight,
          angleX: 0,
          angleY: 0,
          angleZ: 0
        });
      }

      else if (currentShapeType === 'line') {
        shapes.push({
          type: 'line',
          x1: startX,
          y1: startY,
          x2: endX,
          y2: endY,
          angleX: 0,
          angleY: 0,
          angleZ: 0
        });
      }
      drawing = false;
      currentShapeType = null;
      redrawShapes();
    }
  };
}

function startRotating() {
  rotating = true;

  mousePressed = function () {
    let selectedShape = null;
    for (let shape of shapes) {
      if (shape.type === 'circle' && dist(mouseX, mouseY, shape.x, shape.y) <= shape.diameter / 2) {
        selectedShape = shape;
        break;
      }
      else if (shape.type === 'ellipse' && dist(mouseX, mouseY, shape.x, shape.y) <= max(shape.diameterX, shape.diameterY) / 2) {
        selectedShape = shape;
        break;
      } else if (shape.type === 'triangle' && isPointInTriangle(mouseX, mouseY, shape)) {
        selectedShape = shape;
        break;
      } else if (shape.type === 'square' && isPointInSquare(mouseX, mouseY, shape)) {
        selectedShape = shape;
        break;
      } else if (shape.type === 'rect' && isPointInRect(mouseX, mouseY, shape)) {
        selectedShape = shape;
        break;
      } else if (shape.type === 'arc' && isPointInArc(mouseX, mouseY, shape)) {
        selectedShape = shape;
        break;
      } else if (shape.type === 'quad' && isPointInQuad(mouseX, mouseY, shape)) {
        selectedShape = shape;
        break;
      } else if (shape.type === 'line' && isPointInLine(mouseX, mouseY, shape)) {
        selectedShape = shape;
        break;
      }
    }
    rotatingShape = selectedShape;
  };

  mouseDragged = function () {
    if (rotating && rotatingShape) {
      let deltaMouseX = mouseX - pmouseX;
      let deltaMouseY = mouseY - pmouseY;
      rotatingShape.angleX += deltaMouseY * 0.01;
      rotatingShape.angleY += deltaMouseX * 0.01;
      rotatingShape.angleZ += deltaMouseX * 0.01; // Update for 2D rotation
      redrawShapes();
    }
  };
}

function redrawShapes() {
  background(0);
  stroke(255);
  for (let shape of shapes) {
    if (shape.type === 'circle') {
      drawCircle(shape);
    }
    else if (shape.type === 'ellipse') {
      drawEllipse(shape);
    }
    else if (shape.type === 'triangle') {
      drawTriangle(shape);
    } else if (shape.type === 'square') {
      drawSquare(shape);
    } else if (shape.type === 'rect') {
      drawRect(shape);
    } else if (shape.type === 'arc') {
      drawArc(shape);
    } else if (shape.type === 'quad') {
      drawQuad(shape);
    } else if (shape.type === 'line') {
      drawLine(shape);
    }
  }
}

function drawTemporaryCircle(x1, y1, x2, y2) {
  let diameter = dist(x1, y1, x2, y2) * 2;
  circle((x1 + x2) / 2 - width / 2, (y1 + y2) / 2 - height / 2, diameter);
}
function drawTemporaryEllipse(x1, y1, x2, y2) {
  let diameterX = abs(x2 - x1);
  let diameterY = abs(y2 - y1);
  ellipse((x1 + x2) / 2 - width / 2, (y1 + y2) / 2 - height / 2, diameterX, diameterY);
}

function drawTemporaryTriangle(x1, y1, x2, y2) {
  let x3 = x1 + (x2 - x1) * 2;
  triangle(x1 - width / 2, y1 - height / 2, x2 - width / 2, y2 - height / 2, x3 - width / 2, y1 - height / 2);
}

function drawTemporarySquare(x1, y1, x2, y2) {
  let sideLength = max(abs(x2 - x1), abs(y2 - y1));
  rectMode(CENTER);
  rect((x1 + x2) / 2 - width / 2, (y1 + y2) / 2 - height / 2, sideLength, sideLength);
}

function drawTemporaryRect(x1, y1, x2, y2) {
  let widthRect = abs(x2 - x1);
  let heightRect = abs(y2 - y1);
  rectMode(CENTER);
  rect((x1 + x2) / 2 - width / 2, (y1 + y2) / 2 - height / 2, widthRect, heightRect);
}

function drawTemporaryArc(x1, y1, x2, y2) {
  let diameter = dist(x1, y1, x2, y2) * 2;
  let startAngle = atan2(y2 - y1, x2 - x1);
  arc((x1 + x2) / 2 - width / 2, (y1 + y2) / 2 - height / 2, diameter, diameter, startAngle, startAngle + PI);
}

function drawTemporaryQuad(x1, y1, x2, y2) {
  let centerX = (x1 + x2) / 2;
  let centerY = (y1 + y2) / 2;
  let halfWidth = abs(x2 - x1) / 2;
  let halfHeight = abs(y2 - y1) / 2;

  push();
  translate(centerX - width / 2, centerY - height / 2, 0);
  beginShape();
  vertex(-halfWidth, -halfHeight);
  vertex(halfWidth, -halfHeight);
  vertex(halfWidth, halfHeight);
  vertex(-halfWidth, halfHeight);
  endShape(CLOSE);
  pop();
}


function drawTemporaryLine(x1, y1, x2, y2) {
  line(x1 - width / 2, y1 - height / 2, x2 - width / 2, y2 - height / 2);
}

function drawCircle(shape) {
  push();
  translate(shape.x - width / 2, shape.y - height / 2, 0);
  rotateX(shape.angleX);
  rotateY(shape.angleY);
  rotateZ(shape.angleZ); // Use angleZ for 2D rotation around Z axis
  circle(0, 0, shape.diameter);
  pop();
}
function drawEllipse(shape) {
  push();
  translate(shape.x - width / 2, shape.y - height / 2, 0);
  rotateX(shape.angleX);
  rotateY(shape.angleY);
  rotateZ(shape.angleZ); // Use angleZ for 2D rotation around Z axis
  ellipse(0, 0, shape.diameterX, shape.diameterY);
  pop();
}



function drawTriangle(shape) {
  push();
  translate(shape.centerX - width / 2, shape.centerY - height / 2, 0);
  rotateX(shape.angleX);
  rotateY(shape.angleY);
  rotateZ(shape.angleZ); // Use angleZ for 2D rotation around Z axis
  triangle(shape.x1 - shape.centerX, shape.y1 - shape.centerY,
    shape.x2 - shape.centerX, shape.y2 - shape.centerY,
    shape.x3 - shape.centerX, shape.y3 - shape.centerY);
  pop();
}

function drawSquare(shape) {
  push();
  translate(shape.x - width / 2, shape.y - height / 2, 0);
  rotateX(shape.angleX);
  rotateY(shape.angleY);
  rotateZ(shape.angleZ); // Use angleZ for 2D rotation around Z axis
  rectMode(CENTER);
  rect(0, 0, shape.sideLength, shape.sideLength);
  pop();
}

function drawRect(shape) {
  push();
  translate(shape.x - width / 2, shape.y - height / 2, 0);
  rotateX(shape.angleX);
  rotateY(shape.angleY);
  rotateZ(shape.angleZ); // Use angleZ for 2D rotation around Z axis
  rectMode(CENTER);
  rect(0, 0, shape.widthRect, shape.heightRect);
  pop();
}

function drawArc(shape) {
  push();
  translate(shape.x - width / 2, shape.y - height / 2, 0);
  rotateX(shape.angleX);
  rotateY(shape.angleY);
  rotateZ(shape.angleZ); // Use angleZ for 2D rotation around Z axis
  arc(0, 0, shape.diameter, shape.diameter, shape.startAngle, shape.endAngle);
  pop();
}

function drawQuad(shape) {
  push();
  translate(shape.centerX - width / 2, shape.centerY - height / 2, 0);
  rotateX(shape.angleX);
  rotateY(shape.angleY);
  rotateZ(shape.angleZ); // Use angleZ for 2D rotation around Z axis
  beginShape();
  vertex(-shape.halfWidth, -shape.halfHeight);
  vertex(shape.halfWidth, -shape.halfHeight);
  vertex(shape.halfWidth, shape.halfHeight);
  vertex(-shape.halfWidth, shape.halfHeight);
  endShape(CLOSE);
  pop();
}


function drawLine(shape) {
  push();
  translate((shape.x1 + shape.x2) / 2 - width / 2, (shape.y1 + shape.y2) / 2 - height / 2, 0);
  rotateX(shape.angleX);
  rotateY(shape.angleY);
  rotateZ(shape.angleZ); // Use angleZ for 2D rotation around Z axis
  line(shape.x1 - (shape.x1 + shape.x2) / 2, shape.y1 - (shape.y1 + shape.y2) / 2,
    shape.x2 - (shape.x1 + shape.x2) / 2, shape.y2 - (shape.y1 + shape.y2) / 2);
  pop();
}

function isPointInTriangle(px, py, shape) {
  let { x1, y1, x2, y2, x3, y3 } = shape;
  let d1 = sign(px, py, x1, y1, x2, y2);
  let d2 = sign(px, py, x2, y2, x3, y3);
  let d3 = sign(px, py, x3, y3, x1, y1);
  let hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0);
  let hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0);
  return !(hasNeg && hasPos);
}

function isPointInSquare(px, py, shape) {
  let { x, y, sideLength } = shape;
  return (px >= x - sideLength / 2 && px <= x + sideLength / 2 &&
    py >= y - sideLength / 2 && py <= y + sideLength / 2);
}

function isPointInRect(px, py, shape) {
  let { x, y, widthRect, heightRect } = shape;
  return (px >= x - widthRect / 2 && px <= x + widthRect / 2 &&
    py >= y - heightRect / 2 && py <= y + heightRect / 2);
}

function isPointInArc(px, py, shape) {
  let { x, y, diameter, startAngle, endAngle } = shape;
  let distToCenter = dist(px, py, x, y);
  let angleToPoint = atan2(py - y, px - x);
  if (angleToPoint < 0) angleToPoint += TWO_PI;
  return (distToCenter <= diameter / 2 && angleToPoint >= startAngle && angleToPoint <= endAngle);
}

function isPointInQuad(px, py, shape) {
  let halfWidth = shape.halfWidth;
  let halfHeight = shape.halfHeight;
  let centerX = shape.centerX;
  let centerY = shape.centerY;
  return (
    px >= centerX - halfWidth && px <= centerX + halfWidth &&
    py >= centerY - halfHeight && py <= centerY + halfHeight
  );
}

function isPointInLine(px, py, shape) {
  let { x1, y1, x2, y2 } = shape;
  let d1 = dist(px, py, x1, y1);
  let d2 = dist(px, py, x2, y2);
  let lineLen = dist(x1, y1, x2, y2);
  return (d1 + d2 >= lineLen - 1 && d1 + d2 <= lineLen + 1);
}

function sign(px, py, x1, y1, x2, y2) {
  return (px - x2) * (y1 - y2) - (x1 - x2) * (py - y2);
}