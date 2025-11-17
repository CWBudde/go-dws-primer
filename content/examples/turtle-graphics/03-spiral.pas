// Turtle Graphics Example: Colorful Spiral
// This demonstrates loops and gradually changing parameters

program ColorfulSpiral;

var
  i: Integer;
  distance: Integer;

begin
  // Start with a clean canvas
  SetBackground('#F0F0F0');
  SetPenWidth(2);
  SetSpeed(10);

  distance := 5;

  // Draw spiral with changing colors
  for i := 1 to 100 do
  begin
    // Cycle through colors
    if (i mod 4) = 0 then
      SetPenColor('#FF0000')
    else if (i mod 4) = 1 then
      SetPenColor('#00FF00')
    else if (i mod 4) = 2 then
      SetPenColor('#0000FF')
    else
      SetPenColor('#FFFF00');

    Forward(distance);
    TurnRight(90);
    distance := distance + 2;
  end;

  WriteLn('Spiral complete!');
end.
