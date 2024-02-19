// Draws a rectangle with the specified position, size, fill, stroke, and stroke width (line width)
const drawRectangle = (ctx, x, y, width, height, fillStyle = "black", lineWidth = 0, strokeStyle = "black") => {
    // Save the previous drawing state so that this function is pure
    ctx.save();

    // Set the various drawing state properties and draw the rectangle (fill and/or stroke)
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fill();
    if (lineWidth > 0) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
    }
    ctx.closePath();

    // Get the drawing state back to the previous one
    ctx.restore();
}

// Draws an arc with the specified position, radius, fill, stroke, stroke width (line width), start angle, and end angle
const drawArc = (ctx, x, y, radius, fillStyle = "black", lineWidth = 0, strokeStyle = "black", startAngle = 0, endAngle = Math.PI * 2) => {
    // Save the previous drawing state so that this function is pure
    ctx.save();

    // Set the various drawing state properties and draw the arc (fill and/or stroke)
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle);
    ctx.fill();
    if (lineWidth > 0) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
    }
    ctx.closePath();

    // Get the drawing state back to the previous one
    ctx.restore();
}

// Draws a line with the specified start position, end position, stroke, and stroke width (line width)
const drawLine = (ctx, x1, x2, y1, y2, lineWidth = 1, strokeStyle = "black") => {
    // Save the previous drawing state so that this function is pure
    ctx.save();

    // Set the various drawing state properties and draw the line
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();

    // Get the drawing state back to the previous one
    ctx.restore();
}

// Make drawRectangle(), drawArc(), and drawLine() public
export { drawRectangle, drawArc, drawLine };