# Turtle Graphics Examples

This directory contains example programs demonstrating the turtle graphics capabilities of DWScript Primer.

## Available Examples

### 01-square.pas
**Level**: Beginner
**Concepts**: Basic movement, turning, loops
A simple square drawn using the turtle graphics commands.

### 02-star.pas
**Level**: Beginner
**Concepts**: Angles, background colors, pen properties
Creates a five-pointed star with custom colors.

### 03-spiral.pas
**Level**: Intermediate
**Concepts**: Loops, changing parameters, color cycling
Draws a colorful spiral that grows outward.

### 04-circles.pas
**Level**: Beginner
**Concepts**: Circle command, concentric patterns
Creates a series of concentric circles with alternating colors.

### 05-polygon.pas
**Level**: Intermediate
**Concepts**: Procedures, parameters, positioning
Demonstrates how to draw multiple regular polygons using a reusable procedure.

### 06-flower.pas
**Level**: Intermediate
**Concepts**: Rotation, circles, complex patterns
Creates a beautiful flower pattern using overlapping circles.

## Turtle Graphics Commands

### Movement
- `Forward(distance)` - Move forward by distance
- `Backward(distance)` - Move backward by distance
- `TurnLeft(angle)` - Turn left by angle in degrees
- `TurnRight(angle)` - Turn right by angle in degrees

### Pen Control
- `PenUp()` - Lift pen (stop drawing)
- `PenDown()` - Put pen down (start drawing)
- `SetPenColor(color)` - Set pen color (hex string like '#FF0000')
- `SetPenWidth(width)` - Set pen width in pixels

### Drawing
- `Circle(radius)` - Draw a circle
- `Dot(size)` - Draw a filled dot
- `BeginFill()` - Begin filling a shape
- `EndFill()` - End filling and fill the shape

### Position
- `Home()` - Return to center, heading north
- `SetPosition(x, y)` - Move to specific coordinates
- `GetX()` - Get current X position
- `GetY()` - Get current Y position
- `GetHeading()` - Get current heading angle

### Canvas
- `Clear()` - Clear the canvas
- `SetBackground(color)` - Set background color
- `ShowTurtle()` - Show the turtle cursor
- `HideTurtle()` - Hide the turtle cursor
- `SetSpeed(speed)` - Set animation speed (1-10, 0 = instant)

## Tips

1. **Colors**: Use hex color strings like `'#FF0000'` for red, `'#00FF00'` for green, etc.
2. **Angles**: Turtle starts facing north (up). 0° = North, 90° = East, 180° = South, 270° = West
3. **Coordinates**: (0, 0) is the center of the canvas. Positive X is right, positive Y is up.
4. **Speed**: Set speed to 0 for instant drawing, or 1-10 for animated drawing.
5. **Debugging**: Use `WriteLn()` to output messages to the console while drawing.

## Creating Your Own

Try modifying these examples or creating your own! Some ideas:
- Draw a house with a roof
- Create a rainbow with arcs
- Draw a chessboard pattern
- Create a fractal tree (advanced)
- Make an animated pattern that changes over time
