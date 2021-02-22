const colorsString = ['01', '02', '03', '04', '05', '06', '07'];

for (let i = 0; i < colorsString.length; i++) {
  document.getElementById(`input-${colorsString[i]}`).addEventListener('keyup', function(event) {
    if (event.target.value.startsWith('#') & event.target.value.length == 7) {
      document.getElementById(`color-${colorsString[i]}`).style.backgroundColor = event.target.value;
    }; 
  });
}