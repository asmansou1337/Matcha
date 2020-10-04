
var token = document.getElementById('token').dataset.token;
        function decodeToken(token){
            var playload = JSON.parse(atob(token.split('.')[1]));
            return playload;

        }
        var user = decodeToken(token);
        var chatNotif = document.querySelector('.chatNotif')
        var notifCount = document.querySelector('.notifCount')
        // console.log(JSON.stringify(user))

        const socket = io();
        $(window).on('beforeunload', function(){
            socket.close();
        });
        socket.emit('identify', {
            playload: user
        });

        socket.on('chatNotif', data => {
            if (Number(data.userTo) === user.userId) {
                chatNotif.innerHTML =  data.unreadMsgs
                toastr["info"]("You Got A New Message", "Notification")
                console.log(JSON.stringify(data));
            }
        });

        socket.on('unreadNotif', data => {
            // console.log(JSON.stringify(data));
            if (Number(data.id) === user.userId) {
                notifCount.innerHTML =  data.unread
                if (data.msg == 1)
                    toastr["info"]("You Got A New Notification", "Notification")
                // console.log(JSON.stringify(data));
            }
        });

        

        // socket.on('connect', () => {
        //   socket.emit('identify', {
        //     playload: user
        //   });

        //   socket.on('visit', () => {
        //     console.log('visited')
        //       // incrementNotif();
        //       // visitNotif();
        //   });
        // });