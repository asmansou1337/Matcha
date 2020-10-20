
const tagContainer = document.querySelector('.tagsDiv');
const input = document.querySelector('.tagsDiv input');
// let tagsTab = document.getElementById('tagsTab').value;
var tags = []
var tagsLists = []


document.addEventListener('click', (e) => {
  // console.log(e.target.tagName);
  if (e.target.tagName === 'INPUT') {
    var array = []
    var checkboxes = document.querySelectorAll('input[type=checkbox]:checked')

    for (var i = 0; i < checkboxes.length; i++) {
      array.push(checkboxes[i].value)
    }
    document.getElementById('tagsTab').value = JSON.stringify(array)
// console.log(array)
  }
 
 })
