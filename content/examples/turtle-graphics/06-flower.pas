// Turtle Graphics Example: Flower Pattern
// This creates a beautiful flower using circles and rotation

program FlowerPattern;

var
  i: Integer;

begin
  SetBackground('#F0F8FF');
  SetPenWidth(2);
  SetSpeed(8);

  // Draw petals
  for i := 1 to 36 do
  begin
    // Gradient colors (simplified)
    if i < 12 then
      SetPenColor('#FF69B4')
    else if i < 24 then
      SetPenColor('#FF1493')
    else
      SetPenColor('#C71585');

    Circle(50);
    TurnRight(10);
  end;

  // Draw center
  SetFillColor('#FFD700');
  Dot(20);

  WriteLn('Beautiful flower created!');
end.
