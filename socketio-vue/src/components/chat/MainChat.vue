<template>
    <div id="message-side-bar">
        <h2 id="message-side-bar-header">Messages</h2>
          <div id="chats-container">
            <div id="container">
                <div id="container-header">
                    <span id="container-header-span">Chat rooms</span>
                    <button id="container-header-button" class="button fa" @click="showModal = true">&#xf044; New chat room </button>
                </div>
                
                <div id="container-content">
                    <div class="container-content-item" 
                        v-for="(chatRoom, index) in existingChatRooms" 
                        :key="index" 
                        @click="changeChatRoom(chatRoom)">
                        <i id="chat-room-name" class="fa">&#xf2bd; {{`${getChatName(chatRoom)}`}}</i>
                        <span v-show="getAmountOfUnreadMessagesForChat(chatRoom) > 0" class="unread-messages">
                            {{`${getAmountOfUnreadMessagesForChat(chatRoom)}`}}
                        </span>
                    </div>
                </div>
            </div>

            <full-chat :chat-room="chatRoom" :recieved-message="recievedMessage"/>
          </div>
      </div>

    

    <add-room-modal 
        v-show="showModal" 
        :usersToCreateChat="usersToCreateChat" 
        @close-modal="showModal=false"
        @add-chat-room="addChatRoom">
    </add-room-modal>

    
</template>

<script>
    import SocketioService from '../../services/socketio.service.js';
    import AddRoomModal from './AddRoomModal.vue';
    import FullChat from './FullChat.vue';
    import axios from 'axios';

    export default {
        name: "MainChat",
        components: {AddRoomModal, FullChat},

        data() {
            return {
                showModal: false,
                chatRoom: null,
                existingChatRooms: [],
                usersToCreateChat: [],
                allUsers: [],
                recievedMessage: null,
                unreadMessages: []
            }
        },

        async created() {
            //--------------- SUBSCRIPTION TO GETTING MESSAGES IN REAL TIME -----------------------
            SocketioService.recieveMessage(this.addMessage);

            //--------------- SUBSCRIPTION FOR GETTINNG NEW CHAT ROOMS IN REAL TIME ---------------
            SocketioService.newChatRoomAdded(this.newChatRoom);

            //------------------------ EXTRACTING EXISTING CHATS FOR OUR USER ----------------------//
            const extractedChatRooms = await axios.get(`${process.env.VUE_APP_SOCKET_ENDPOINT}/chatRooms/${this.$store.state.userId}`)
                        .then(response => response.data)

            console.log("Extracted chat rooms for user id: " + this.$store.state.userId);
            console.log(extractedChatRooms);
            
            this.existingChatRooms = extractedChatRooms;

            //----------------------- JOINING CLIENT SOCKET TO ALL EXISTING CHAT ROOMS -----------------------//
            this.existingChatRooms.forEach(chatRoom => SocketioService.joinChatRoom(chatRoom));

            //----------------------- EXTRACTING ALL AVAILABLE CHATS TO WRITE -------------------------------//
            /* extract all available user to write */
            let result = await axios.get(`${process.env.VUE_APP_SOCKET_ENDPOINT}/users`).then(response => response.data);
            
            //---------------------- Check if chat with user already exist--------------------
            //If not we add that user to arrat of users we can write to.
            result.forEach(user => {
                this.allUsers.push({name: user.fullName, id: user.id});

                const isUserInAnyRoomExceptAll = this.existingChatRooms.some(chatRoom =>
                    chatRoom.id !== "all" && chatRoom.members.some(member => member.id === user.id)
                );

                if(!isUserInAnyRoomExceptAll) {
                    this.usersToCreateChat.push({name: user.fullName, id: user.id});
                }
            });

            if(this.existingChatRooms.every(chatRoom => chatRoom.id != "all")) {
                this.usersToCreateChat.push({name: "All", id: "all"})
            }
        
            console.log("Users to create chat: " + JSON.stringify(this.usersToCreateChat));
        },  

        methods: {
            //----------- CB function when recieving message ---------------
            addMessage(recievedMessage) {
                this.recievedMessage = recievedMessage;
                this.addToUnread(recievedMessage);
            },

            addToUnread(recievedMessage) {
                let chatRoomId = this.chatRoom != null ? this.chatRoom.id : -1;
                if(recievedMessage.chatId != chatRoomId && recievedMessage.senderName != this.$store.state.userName) {
                    this.unreadMessages.push(recievedMessage);
                }

                console.log("Unread messages: " + JSON.stringify(this.unreadMessages));
            },

            deleteFromUnread(chatRoom) {
                this.unreadMessages = this.unreadMessages.filter(msg => msg.chatId != chatRoom.id);
            },

            getAmountOfUnreadMessagesForChat(chatRoom) {
                let count = 0;

                this.unreadMessages.forEach(msg => {
                    if(msg.chatId == chatRoom.id) {
                        count++;
                    }
                })

                return count;
            },

            getChatName(chatRoom) {
                return chatRoom.members
                    .filter(member => member.name != this.$store.state.userName)
                    .map(member => member.name)
                    .join(", ");
            },

            changeChatRoom(chatRoom) {
                this.chatRoom = chatRoom;
                this.deleteFromUnread(chatRoom);
            },

            addChatRoom(user) {
                const currentUserName = this.$store.state.userName;
                const currentUserId = this.$store.state.userId;

                let chatRoom;
                if(user.id == "all") {
                    chatRoom = {
                        id: "all",
                        members: this.allUsers
                    }
                } else {
                    chatRoom = {
                        id: Math.min(user.id, currentUserId) + "" + Math.max(user.id, currentUserId),
                        members: [{name: user.name, id: user.id}, {name: currentUserName, id: currentUserId}]
                    }
                }
                
                //STORE CHAT ROOM in DB
                SocketioService.addChatRoom(chatRoom);

                //STORE CHAT ROOM LOCALY
                this.existingChatRooms.push(chatRoom); 
                this.usersToCreateChat = this.usersToCreateChat.filter(userFromArr => userFromArr.id !== user.id);
            },

            newChatRoom(chatRoom) {
                if(chatRoom.members.some(member => member.id == this.$store.state.userId)) {
                    //-------------- JOINING SOCKET TO THIS NEW CHAT -------------------
                    SocketioService.joinChatRoom(chatRoom);

                    //STORE CHAT ROOM LOCALY
                    this.existingChatRooms.push(chatRoom); 

                    //DELETE FROM AVAILABLE USERS TO WRITE USERS FROM THIS CHAT
                    if(chatRoom.id != "all") {
                        chatRoom.members.forEach(user => {
                            this.usersToCreateChat = this.usersToCreateChat.filter(userFromArr => userFromArr.id !== user.id);
                        })
                    } else {
                        this.usersToCreateChat = this.usersToCreateChat.filter(userFromArr => userFromArr.id !== "all");
                    }
                }
            }
        }
    }
</script>

<style>

    #message-side-bar {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        height: 100%;
    }

    #message-side-bar-header {
        font-size: 28px;
        text-align: left;
        padding: 30px 0 30px 0;
    }

    #chats-container {
        display: flex;
        flex-direction: row;
        gap: 5%;
        height: 65vh;
    }

    .unread-messages {
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: red;
        color: white;
        text-align: center;
        font-size: 12px;
        line-height: 20px;
        margin-left: 5px;
    }

    #container {
        background-color: #C3C9EC;
        display: flex;
        flex-direction: column;
        border: 2px solid gray;
        border-radius: 5px;
        padding: 2%;
        width: 25%;
        height: 100%;
        overflow-y: auto;
    }

    #container-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }

    #container-header-span {
        font-size: 16px;
        font-weight: bold;
        order: 0;
    }

    #container-header-button {
        order: 1;
        font-size: 20px;
    }

    .container-content-item {
        background-color: #CCCCCC;
        border-radius: 10px;
        padding: 5%;
        text-align: center;
        margin-bottom: 10px;
        cursor: pointer;
        border: 1px solid black;
    }

    .container-content-item:hover {
        background-color: #AEAED7;
    }

    .container-content-item:focus {
        background-color: #AEAED7;
    }

    #chat-room-name {
        font-size: 18px;
    }
</style>