<template>
    <div class="my-modal">
        <div class="my-modal-content">
            <div class="my-modal-header">
                <span class="modal-header-text">Add new chat room</span>
                <span class="close-modal" @click="closeModal">&times;</span>
            </div>
            
            <form class="add-form" @submit.prevent="addChatRoom">
                <div class="form-group">
                    <label for="list">Users list</label>
                    <select name="list" v-model="selectedUser" required>
                        <option v-for="user in usersToCreateChat" :key="user" :value="user">
                                {{user.name}}
                        </option>
                    </select>
                </div>

                <div class="button-group">
                    <button class="button" type="button" @click="closeModal">Cancel</button>
                    <button class="button" type="submit" @click="closeModal">Add</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AddRoomModal",
        props: ["usersToCreateChat"],
        emits: ["closeModal", "addChatRoom"],

        data() {
            return {
                selectedUser: ""
            }
        },

        methods: {
            closeModal() {
                this.$emit("closeModal");
            },

            addChatRoom() {
                this.$emit("addChatRoom", this.selectedUser);
            }
        }
    }
</script>

<style scoped>
    .my-modal {
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        width: 100%; /* Full width */
        height: 100%; /* Full height */
        overflow: auto; /* Enable scroll if needed */
        background-color: hsla(0, 0%, 0%, 0.5);
    }

    .my-modal-content {
        margin: 8% auto; /* 15% from the top and centered */
        border-radius: 1rem;
        padding: 1rem;
        width: 30rem;
        background-color: white;
        display: flex;
        flex-direction: column;
    }

    .close-modal {
        display: block;
        margin-left: auto;
        color: #aaa;
        font-size: 28px;
        font-weight: bold;
    }
    
    .close-modal:hover,
    .close-modal:focus {
        color: black;
        text-decoration: none;
        cursor: pointer;
    }

    .modal-header-text {
        font-size: 22px;
        font-weight: bold;
    }

    .button-group {
        display: flex;
        padding: 5px;
        justify-content: flex-end;
    }
    
    .button-group > button {
        font-size: 16px;
        border: 1px solid black;
        padding: 3px;
        border-radius: 3px;
        margin-left: 5px;
    }
    
    .button-group > button:active {
        background-color: lightgray;
    }

    .my-modal-header {
        display: flex;
        align-items: center;
    }
    
    .header-text {
        font-size: 22px;
        font-weight: bold;
    }
    
    .modal-content-text {
        margin: 0px;
        padding: 20px 5px 5px 5px;
        font-size: 20px;
    }
    
    .add-form {
        padding: 20px;
        font-size: 20px;
    }
    
    input, select {
        border: 1px solid gray;
        border-radius: 5px;
        width: 70%;
        text-align: center;
    }
    
    .form-group {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

</style>