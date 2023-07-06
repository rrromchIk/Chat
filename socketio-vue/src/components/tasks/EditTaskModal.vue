<template>
    <div class="my-modal">
        <div class="my-modal-content">
            <div class="my-modal-header">
                <span class="modal-header-text">Edit task</span>
                <span class="close-modal" @click="closeModal">&times;</span>
            </div>
            
            <form class="add-form" @submit.prevent="editTask">
                <div class="form-group">
                    <label for="board">Board</label>
                    <select name="board" v-model="selectedBoard" required>
                        <option value="toDo">ToDo</option>
                        <option value="inProcess">In process</option>
                        <option value="done">Done</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="name">Name</label>
                    <input for="list" type="text" v-model="name" required>
                </div>

                <div class="form-group">
                    <label for="list">Date</label>
                    <input type="date" v-model="date" required>
                </div>

                <div class="form-group">
                    <label for="name">Description</label>
                    <textarea v-model="description" required></textarea> 
                </div>

                <div class="button-group">
                    <button class="button" type="button" @click="closeModal">Cancel</button>
                    <button class="button" type="submit">Save</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AddRoomModal",
        emits: ["closeModal", "updateTask"],
        props: [
            "activeBoard", "existingName", "existingDate", "existingDescription", "taskId"
        ],

        data() {
            return {
                selectedBoard: "inProcess",
                name: "",
                description: "",
                date: null
            }
        },

        methods: {
            closeModal() {
                this.$emit("closeModal");
            },

            editTask() {
                const newTask = { 
                    id: this.taskId,
                    userId: this.$store.state.userId,
                    status: this.selectedBoard,
                    name: this.name,
                    date: this.date,
                    description: this.description
                }

                this.$emit("updateTask", newTask);
            }
        },

        watch: {
            activeBoard() {
                this.selectedBoard = this.activeBoard;
            },

            existingName() {
                this.name = this.existingName;
            },

            existingDate() {
                this.date = this.existingDate;
            },

            existingDescription() {
                this.description = this.existingDescription;
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
    
    input, select, textarea {
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