const colorsString = ['one', 'two', 'three', 'four', 'five', 'six', 'seven'];

for (let i = 0; i < colorsString.length; i++) {
  document.getElementById(`input-${colorsString[i]}`).addEventListener('keyup', function(event) {
    if (event.target.value.startsWith('#') & event.target.value.length == 7) {
      document.getElementById(`color-${colorsString[i]}`).style.backgroundColor = event.target.value;
    }; 
  });
}