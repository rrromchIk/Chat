<template>
    <div id="container" v-if="chatRoom !== null">
        <div id="chat-content">
            <div id="chat-content-header">
                <div style="display: flex; justifyContent: space-between;">
                    <span id="chatName">Chat room {{ `${getChatName(chatRoom)}` }}</span>

                    <div id="members">
                        <span class="header-text">Members</span>
                        <br>
                        <i v-for="member in chatRoom.members" :key="member" class="fa">&#xf2bd;</i>
                    </div>
                </div>
                
                <span class="header-text">Messages</span>
            </div>
           
            <div id="messages">
                <div v-for="message in messages" :key="message" class="message-item" :class="{receiver: !message.isRecieved }">
                    <div class="sender-info">
                        <i class="fa">&#xf2bd;</i>
                        <span class="sender-name">{{message.senderName }}</span>
                    </div>
                    
                    <div class="message">{{ message.messageText }}
                        <span class="message-time">{{message.sendingTime}}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div id="message-input">
            <form @submit.prevent="sendMessage">
                <input type="text" placeholder="Type in message" v-model="inputMessageText"/>
                <button type="submit"><img src="../../assets/right-arrow.png" alt="" height="30" width="30"></button>
            </form>
        </div>
    </div>
</template>

<script>
    import SocketioService from '../../services/socketio.service'; 
    import axios from 'axios';
    import moment from 'moment'

    export default {
        name: "FullChat",
        props: ["chatRoom", "recievedMessage"],

        data() {
            return {
                inputMessageText: null,
                messages: []
            }
        },

        methods: {
            //------------------- SENDING MESSAGE -------------------
            sendMessage() {
                const message = {
                    chatId: this.chatRoom.id,
                    senderName: this.$store.state.userName,
                    content: this.inputMessageText,
                    time: new Date()
                }

                //Message is stored in DB on server.
                SocketioService.sendMessage(message);
                this.inputMessageText = null;
            },

            //Convert message from format that is stored in db to format that  can be rendered
            convertMessage(inputMessage) {
                const date = new Date(inputMessage.time);
                const sendingTime = moment(date).format("HH:mm")
                const isRecieved = inputMessage.senderName != this.$store.state.userName;
                const senderName = inputMessage.senderName;
                const messageText = inputMessage.content;

                return {senderName,  sendingTime, isRecieved, messageText}
            },

            getChatName(chatRoom) {  
                return chatRoom.members
                    .filter(member => member.name != this.$store.state.userName)
                    .map(member => member.name)
                    .join(", ");  
            },
        },

        watch: {
            //Watcher of chatRoom property to extract messages when we move through the chat rooms.
            async chatRoom() {
                //--------------- EXTRACT ALL MESSAGES in CHAT ---------------------
                const extractedMessages = await axios.get(`${process.env.VUE_APP_SOCKET_ENDPOINT}/messages/${this.chatRoom.id}`)
                        .then(response => response.data)
                const convertedMessages = extractedMessages.map(msg => this.convertMessage(msg));

                console.log("Extracted messages for chat room {" + this.chatRoom.id + "} " + extractedMessages.map(msg => msg.content).join(", "));
                
                this.messages = convertedMessages;
            },

            //Watcher of recievedMessage to add to local storage if it is from current chat
            recievedMessage() {
                //----------------- Our client socket can be in many different rooms -----------------
                //Therefore we need to check if recieved message chat id equals to our opened chat
                if(this.chatRoom != null && this.recievedMessage.chatId == this.chatRoom.id) { 
                    //----------- STORE MESSAGE LOCALY ------------------
                    this.messages.push(this.convertMessage(this.recievedMessage));  
                }
            }
        }  
    }
</script>

<style scoped>
    #container {
        background-color: #C3C9EC;
        display: flex;
        flex-direction: column;
        border: 2px solid gray;
        border-radius: 5px;
        padding: 2%;
        width: 60%;
        height: 100%;  
    }

    #members > i {
        font-size: 16px;
        margin-left: 1%;
    }

    #chat-content {
        flex-grow: 1;
    }

    #chat-content-header {
        padding-bottom: 5px;
    }

    #chatName {
        font-size: 18px;
        font-weight: bold;
    }

    .header-text {
        font-size: 16px;
        font-weight: 500;
        padding: 5px 0 5px 0;
        margin-bottom: 10px;
    }


    #messages {
        display: flex;
        flex-direction: column;
        max-height: 40vh;
        overflow-y: auto;
    }

    .message-item {
        display: flex;
        flex-direction: row;
        margin-bottom: 10px;  
    }

    .sender-info {
        padding: 2px;
        display: flex;
        flex-direction:column; 
        justify-content: start;
    }

    .sender-name {
        max-width: 6vh;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .sender-info > i {
        text-align: center;
    }

    .receiver {
        flex-flow: row-reverse;
    }

    .receiver .message {
        background-color: #007bff;
        color: white;
    }

    .message {
        background-color: #f2f2f2;
        padding: 5px 30px 5px 5px;
        border-radius: 10px;
        font-size: 14px;
        position: relative;
        max-width: 50%;
        word-wrap: break-word;
    }

    .message-time {
        position: absolute;
        bottom: 1px;
        right: 4px;
        font-size: 10px;
    }

    #message-input {
        display: flex;
        width: 100%;
        justify-content: center;
    }  

    form {
        display: flex;
        width: 100%;
    }
    
    input[type="text"] {
        flex-grow: 1;
        padding: 10px;
        border: none;
        border-radius: 20px;
        outline: none;
    }
    
    button[type="submit"] {
        padding: 10px 20px;
        margin-left: 10px;
        border: none;
        border-radius: 20px;
        background-color:#9BD0AB;
        color: white;
        cursor: pointer;
        outline: none;
    }
</style>