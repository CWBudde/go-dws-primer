// Turtle Graphics Example: Drawing a Star
// This example shows how to create a five-pointed star

program DrawStar;

var
  i: Integer;

begin
  // Set colors
  SetBackground('#001122');
  SetPenColor('#FFD700');
  SetPenWidth(3);

  // Draw a five-pointed star
  for i := 1 to 5 do
  begin
    Forward(150);
    TurnRight(144);
  end;

  WriteLn('Star completed!');
end.
