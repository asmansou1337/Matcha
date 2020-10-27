
var token = document.getElementById('token').dataset.token;
        function decodeToken(token){
            var playload = JSON.parse(atob(token.split('.')[1]));
            return playload;

        }
        var user = decodeToken(token);
        var chatNotif = document.querySelector('.chatNotif')
        var notifCount = document.querySelector('.notifCount')
        $(window).on('beforeunload', function(){
            socket.close();
        });
        const socket = io();

        socket.on('chatNotif', data => {
            if (Number(data.userTo) === user.userId) {
                chatNotif.innerHTML =  data.unreadMsgs
                if (data.msg == 1)
                    toastr["info"]("You Got A New Message", "Notification")
            }
        });

        socket.on('unreadNotif', data => {
            if (Number(data.id) === user.userId) {
                notifCount.innerHTML =  data.unread
                if (data.msg == 1 && data.notify == 1)
                    toastr["info"]("You Got A New Notification", "Notification")
            }
        });