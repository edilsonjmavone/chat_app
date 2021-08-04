import "dotenv/config"
import  express   from "express";
import * as socketio from "socket.io";
import http from 'http'
import path from "path";



const app = express();
const port = process.env.PORT || 3333
const time = process.env.TIMES
const server = http.createServer(app)
const io = new socketio.Server(server)
console.log(time)

app.use(express.static(path.join(__dirname,"./public/")))



io.on("connection", (socket: any)=>{
      console.log(`Connected socket: ${socket.id}`);
      

      socket.on("msg", function(mesage: any){
            
            io.emit('hey', mesage)
      })

      
})


server.listen(port,()=>
      console.log(`hello in port:${port}`)
)
