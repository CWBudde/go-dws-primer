// Turtle Graphics Example: Concentric Circles
// This shows how to use the Circle command and positioning

program ConcentricCircles;

var
  i: Integer;
  radius: Integer;

begin
  SetBackground('#FFFFFF');
  SetPenWidth(2);

  radius := 20;

  // Draw concentric circles
  for i := 1 to 8 do
  begin
    // Alternate colors
    if (i mod 2) = 0 then
      SetPenColor('#FF6B6B')
    else
      SetPenColor('#4ECDC4');

    Circle(radius);
    radius := radius + 15;
  end;

  WriteLn('Concentric circles drawn!');
end.
