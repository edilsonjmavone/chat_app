
      init()
      //Using Socket.io
      const url = window.location.href
      const socket = io(url)
      const sub = document.querySelector('#submit')
      const cUserName = "user_name"
      const chatMsgs = []

      function init(){
        checkCookie()
        checkChats()
      }

      function requestName(){
          let userName = prompt("Enter your name!!")

            if(userName=="" || userName == null){
                  userName = "stranger"
                  alert(`Now your name is "${userName}"`)
                  document.querySelector('#msg').placeholder = `type as ${userName}`
                  return userName


            }else{
                 // alert(`Now your name is "${userName}"`)
                  document.querySelector('#msg').placeholder = `type as ${userName}`
                  return userName
            }
      }




      //EVENTS

      // WebSokeckt events
      socket.on("new_client", data =>{
            alert(`a new stranger is among us !!`)
      })

      socket.on('hey', data => addMsg(data, true))


      document.addEventListener('keydown', event =>{
            if(event.key=="Enter"){
                  send()
            }
      })





      // METHODS>>>>>>
      function ready(){
            socket.emit("user_ready", getCookie("user_name"))
      }
      function setCookie(name){
            console.log("seting cookies")
            document.cookie = `user_name=${name}`
           // ready()
      }

      function getCookie(cname) {
            let name = cname + "=";
            let decodedCookie = decodeURIComponent(document.cookie);
            let ca = decodedCookie.split(';');

            for(let i = 0; i <ca.length; i++) {
                  let c = ca[i];
                  while (c.charAt(0) == ' ') {
                        c = c.substring(1);
                  }

              if (c.indexOf(name) == 0) {
                  return c.substring(name.length, c.length);
              }
            }
            return "";
      }

      function checkCookie() {
            console.log("checking cookies")
            let username = getCookie("user_name");
            if (username != "") {
                  alert("Welcome again " + username);
                  document.querySelector('#msg').placeholder = `type as ${username}`
                 // ready()
            } else{
                  username = requestName()
                  setCookie(username);

            }
      }

      function addMsg(data,store){
            let ele = document.createElement('li')
            let br = document.createElement('br')
            ele.textContent= `From ${data.author}: ${data.message}`
            document.querySelector("#dataB").appendChild(ele)
            document.querySelector("#dataB").appendChild(br)
            if (store) {
              chatMsgs.push(data)
              storeChat()
            }

      }

      function send(){
            let message = document.querySelector('#msg')

            if(message){
                  const data = {
                        message :message.value,
                        author :getCookie("user_name")
                  }
                  socket.emit("msg", data)
                  message.value = ""
                  console.log(data);
                  return
            }else{
                  alert("type something!!!")
                  return
            }

      }

      function storeChat(){
        localStorage.setItem("chats",JSON.stringify(chatMsgs))
      }

      function checkChats(){
        const data = localStorage.getItem("chats")
        if (data) {
          chatMsgs.push = JSON.parse(data)
          chatMsgs.forEach( element => {
              addMsg(element,false)
          })
        }else{
            console.log("there ins't a chat");
        }


      }
