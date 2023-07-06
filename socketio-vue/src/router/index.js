import { createWebHistory, createRouter } from "vue-router";
import MainChat from "../components/chat/MainChat";
import UserTasks from "../components/tasks/UserTasks";

const routes = [
    { path: '/', component: MainChat },
    { path: '/tasks', component: UserTasks }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;

