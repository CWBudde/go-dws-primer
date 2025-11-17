// Turtle Graphics Example: Regular Polygon
// This demonstrates how to draw any regular polygon using a procedure

program RegularPolygon;

procedure DrawPolygon(sides: Integer; sideLength: Integer);
var
  i: Integer;
  angle: Real;
begin
  angle := 360.0 / sides;

  for i := 1 to sides do
  begin
    Forward(sideLength);
    TurnRight(angle);
  end;
end;

begin
  SetPenWidth(2);

  // Triangle
  SetPenColor('#E74C3C');
  SetPosition(-150, 100);
  DrawPolygon(3, 80);

  // Square
  SetPenColor('#3498DB');
  SetPosition(-50, 100);
  PenUp;
  Home;
  SetPosition(-50, 100);
  PenDown;
  DrawPolygon(4, 60);

  // Pentagon
  SetPenColor('#2ECC71');
  PenUp;
  SetPosition(50, 100);
  PenDown;
  DrawPolygon(5, 50);

  // Hexagon
  SetPenColor('#F39C12');
  PenUp;
  SetPosition(150, 100);
  PenDown;
  DrawPolygon(6, 40);

  WriteLn('Multiple polygons drawn!');
end.
