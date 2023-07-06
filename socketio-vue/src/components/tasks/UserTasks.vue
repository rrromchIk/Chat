<template>
    <div id="tasks-side-bar">
        <h2 id="tasks-side-bar-header">Tasks</h2>
          <div id="tasks-container">

            <div class="container">
                <div class="container-header">
                    <span class="container-header-span">ToDo</span>
                </div>
                
                <div class="container-content">
                    <div class="container-content-item" 
                        v-for="(task, index) in toDoTasks" :key="index" >
                       
                        <i class="task-name" @click="openEditModal(task)">{{`${task.name}    ${getFormattedDate(task.date)}`}}</i>
                    </div>
                </div>

                <button class="container-header-button button fa" @click="openModal('toDo')"> + Add task</button>
            </div>

             
            <div class="container">
                <div class="container-header">
                    <span class="container-header-span">In process</span>
                </div>
                
                <div class="container-content">
                    <div class="container-content-item" 
                        v-for="(task, index) in inProcessTasks" :key="index" >
                        
                        <i class="task-name" @click="openEditModal(task)">{{`${task.name}    ${getFormattedDate(task.date)}`}}</i>
                    </div>
                </div>

                <button class="container-header-button button fa" @click="openModal('inProcess')"> + Add task</button>
            </div>

            <div class="container">
                <div class="container-header">
                    <span class="container-header-span">Done</span>
                    
                </div>
                
                <div class="container-content">
                    <div class="container-content-item" 
                        v-for="(task, index) in doneTasks" :key="index" >
                        
                        <i class="task-name" @click="openEditModal(task)">{{`${task.name}    ${getFormattedDate(task.date)}`}}</i>
                    </div>
                </div> 

                <button class="container-header-button button fa" @click="openModal('done')"> + Add task</button>
            </div>
          </div>
      </div>

      <add-task-modal 
        v-show="showAddModal"
        :active-board="activeBoard"
        @close-modal="showAddModal=false"
        @add-task="createTask"/>

      <edit-task-modal
        v-show="showEditModal"
        :active-board="activeBoard"
        :existing-name="existingName"
        :existing-date="existingDate"
        :existing-description="existingDescription"
        :task-id="taskId"
        @close-modal="showEditModal=false"
        @update-task="updateTask"/>
     
</template>

<script>
    import axios from 'axios';
    import moment from 'moment';
    import AddTaskModal from './AddTaskModal.vue';
    import EditTaskModal from './EditTaskModal.vue';

    export default {
        name: "UserTasks",
        components: {AddTaskModal, EditTaskModal},
        data() {
            return {
                toDoTasks: [],
                inProcessTasks: [],
                doneTasks: [],
                showAddModal: false,
                showEditModal: false,
                activeBoard: null,
                existingName: null,
                existingDate: null,
                existingDescription: null,
                taskId: null
            }
        },

        async created() {
            const result = await axios.get(`${process.env.VUE_APP_SOCKET_ENDPOINT}/tasks/${this.$store.state.userId}`)
                        .then(response => response.data);
            result.forEach(task => {
                switch(task.status) {
                    case "toDo":  this.toDoTasks.push(task); break;
                    case "inProcess":  this.inProcessTasks.push(task); break;
                    case "done":  this.doneTasks.push(task); break;
                }    
            })

            console.log("Extracted tasks: " + JSON.stringify(result));                
        },

        methods: {
            getFormattedDate(date) {
                return moment(date).format("DD:MM");
            },

            createTask(task) {
                console.log("create task method invoked with task: " + JSON.stringify(task));

                axios.post(`${process.env.VUE_APP_SOCKET_ENDPOINT}/tasks/`, task)
                    .then(response => {
                        if(response.status == 201) {
                            let createdTask = response.data.createdTask[0];
                            console.log("Task that is stored localy after create: " + JSON.stringify(createdTask));
                            switch(createdTask.status) {
                                case "toDo":  this.toDoTasks.push(createdTask); break;
                                case "inProcess":  this.inProcessTasks.push(createdTask); break;
                                case "done":  this.doneTasks.push(createdTask); break;
                            }
                        }
                    });
            },

            updateTask(newTask) {
                this.toDoTasks = this.toDoTasks.filter(task => task._id != newTask.id);
                this.inProcessTasks = this.inProcessTasks.filter(task => task._id != newTask.id);
                this.doneTasks = this.doneTasks.filter(task => task._id != newTask.id);

                console.log(`Update task method invoked for task ${newTask.id}. New task: ` + JSON.stringify(newTask));

                axios.put(`${process.env.VUE_APP_SOCKET_ENDPOINT}/tasks/${newTask.id}`, newTask)
                    .then(response => {
                        if(response.status == 201) {
                            let task = response.data;
                            console.log("Updated task: " + JSON.stringify(task));
                            switch(task.status) {
                                 case "toDo":  this.toDoTasks.push(task); break;
                                 case "inProcess":  this.inProcessTasks.push(task); break;
                                 case "done":  this.doneTasks.push(task); break;
                            }
                            task._id = newTask.id;
                        } else {
                            console.log("Error while updating");
                        }
                    });
            },

            openModal(board) {
                this.showAddModal = true,
                this.activeBoard = board;
            },

            openEditModal(task) {
                this.taskId = task._id;
                this.showEditModal = true;
                this.activeBoard = task.status;
                this.existingName = task.name,
                this.existingDate = moment(task.date).format("YYYY-MM-DD"),
                this.existingDescription = task.description;
            } 
        }
    }
</script>

<style scoped>

#tasks-side-bar {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    height: 100%;
}

#tasks-side-bar-header {
    font-size: 28px;
    text-align: left;
    padding: 30px 0 30px 0;
}

#tasks-container {
    display: flex;
    flex-direction: row;
    gap: 5%;
    height: 65vh;
}

.container {
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

.container-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.container-header-span {
    font-size: 16px;
    font-weight: bold;
    order: 0;
}

.container-header-button {
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

.task-name {
    font-size: 18px;
}
  
</style>