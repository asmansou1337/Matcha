const tagContainer = document.querySelector('.tag-container');
const input = document.querySelector('.tag-container input');
let tagsTab = document.getElementById('tagsTab').value;
let tags = [];
const oldTags = document.getElementById('tagsTab').value.split(',');
      oldTags.forEach(tag => {
        if (tag !== '[]')
            tags.push(tag);  
      })
      document.getElementById('tagsTab').value = JSON.stringify(tags);

function createTag(label) {
  const span1 = document.createElement('span');
  span1.setAttribute('class', 'badge grey lighten-1 tag');
  const h6 = document.createElement('h6');
  const span2 = document.createElement('span');
  span2.innerHTML = label;
  const closeIcon = document.createElement('i');
  closeIcon.setAttribute('class', 'far fa-times-circle');
  closeIcon.setAttribute('aria-hidden', 'true');
  closeIcon.setAttribute('data-item', label);
  span1.appendChild(h6);
  h6.appendChild(span2);
  h6.appendChild(closeIcon);
  return span1;
}

function clearTags() {
  document.querySelectorAll('.tag').forEach(tag => {
    tag.parentElement.removeChild(tag);
  });
}

function addTags() {
  clearTags();
  tags.slice().reverse().forEach(tag => {
    tagContainer.prepend(createTag(tag));
  });
}

input.addEventListener('keyup', (e) => {
    e.preventDefault();
    if (e.key === 'Enter') {
      e.target.value.split(',').forEach(tag => {
        tags.push(tag);  
      });
      document.getElementById('tagsTab').value = JSON.stringify(tags);
      addTags();
      input.value = '';
    }
});

document.addEventListener('click', (e) => {
  console.log(e.target.tagName);
  if (e.target.tagName === 'I') {
    const tagLabel = e.target.getAttribute('data-item');
    const index = tags.indexOf(tagLabel);
    tags = [...tags.slice(0, index), ...tags.slice(index+1)];
    document.getElementById('tagsTab').value = JSON.stringify(tags);
    addTags();    
  }
})

// function submitTags() {
//     console.log('yes');
//     const tagsform = document.getElementById('tagsform');
//     //document.getElementById('tagsTab').value = JSON.stringify(tags);
//     //console.log('tabs -- ' +tagsTab);
//     //tagsform.append('tags', JSON.stringify(tags));
//     //tagsform.submit();
// }

// input.focus();

