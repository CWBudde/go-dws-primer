// Turtle Graphics Example: Drawing a Square
// This example demonstrates basic turtle movement and turning

program DrawSquare;

var
  i: Integer;

begin
  // Set pen color
  SetPenColor('#0066cc');
  SetPenWidth(2);

  // Draw a square
  for i := 1 to 4 do
  begin
    Forward(100);
    TurnRight(90);
  end;

  WriteLn('Square drawn!');
end.
