

const chatForm = document.getElementById('chatForm');
const chatMessages = document.querySelector('.chatMessages');
const cardTitle = document.querySelector('.chatTitle')
const chatBox = document.querySelector('.chatBox')

  // const socket = io();
  console.log(JSON.stringify(user))

   // Get user id, username and conversation id from URL
    const { to, matchedUsername, convId } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
  });

  var from = user.userId;
  var username = user.username;

    // console.log(to, from, matchedUsername, username, convId)
    if (typeof to !== 'undefined' && typeof from !== 'undefined' && typeof matchedUsername !== 'undefined' && 
    typeof username !== 'undefined' && typeof convId !== 'undefined') {
        // Join Conversation
        socket.emit('joinConv', { to, from, matchedUsername, username, convId });
        cardTitle.innerHTML = `Chatting with ${matchedUsername}`
        chatBox.style.display ='block'
        document.querySelector('.defaultChatBox').style.display = 'none'
    }
   

  //console.log(userTo, username, convId)
  // Message from server
  socket.on('error', error => {
    //   console.log(error)
    const div = document.createElement('div');
    div.classList.add('alert');
    div.classList.add('alert-danger');
    div.innerHTML = error;
    document.getElementById('error').appendChild(div);
});

  // Message from server
    socket.on('message', message => {
        // console.log(JSON.stringify(message));
        outputMessage(message);
    
        // // Scroll down
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    // Message submit
    chatForm.addEventListener('submit', e => {
        e.preventDefault();
    
        // Get message text
        const msg = e.target.elements.msg.value;
    
        // Emit message to server
        socket.emit('chatMessage', msg);
    
        // Clear input
        e.target.elements.msg.value = '';
        e.target.elements.msg.focus();
  });

  // Output message to DOM
function outputMessage(message) {
    var cl;
    const div = document.createElement('li');
    div.classList.add('d-flex');
    div.classList.add('mb-4');
    (message.username === username) ? div.classList.add('justify-content-end') : div.classList.add('justify-content-between'); 
    (message.username === username) ? cl = 'light-green lighten-2' : cl = 'bg-light'; 
    div.innerHTML = `<div class="${cl} rounded w-75 p-3 ml-2 z-depth-1">
    <div class="header">
      <strong class="primary-font">${message.username}</strong>
      <small class="pull-right text-muted"><i class="far fa-clock"></i> 12 mins ago</small>
    </div>
    <hr class="w-100">
    <p class="mb-0">
      ${message.msg}
    </p>
  </div>`;
    chatMessages.appendChild(div);
  }

