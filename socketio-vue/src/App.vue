<template>
  <app-header 
    :logo="logo" 
    :user-full-name="userFullName">
  </app-header>
  
  <div id="main-content">
    <navigation-bar :pages="pagesForNavigation"></navigation-bar>
    
    <router-view/>
  </div>
</template>

<script>
  import SocketioService from './services/socketio.service.js';
  import AppHeader from './components/AppHeader.vue';
  import NavigationBar from './components/NavigationBar.vue';
  import {useStore} from 'vuex';
  
  export default {
    name: 'App',
    components: {
      AppHeader, NavigationBar
    },

    data() {
      return {
        logo: "CMS",
        userFullName: null,
        userId: null,

        pagesForNavigation: [{
            text: "Dashboard",
            link: "#"
          }, {
            text: "Students",
            link: `http://${process.env.VUE_APP_LOCAL_HOST}:5501/html/index.html`
          }, { 
            text: "Tasks",
            link: "#"
          }
        ]        
      }
    },

    created() {
      let params = new URLSearchParams(window.location.search.substring(1));
      this.userFullName = params.get("name");
      this.userId = params.get("id");

      console.log("Create VUE app");
      console.log("User id: " + this.userId);
      console.log("User fullName: " + this.userFullName);

      useStore().commit("setUserId", this.userId);
      useStore().commit("setUserName", this.userFullName);

      SocketioService.setupSocketConnection(this.userId);
    },

    beforeUnmount() {
      SocketioService.disconnect();
    }
  }
</script>

<style>
  body {
    background-color:#9BD0AB;
  }

  #app {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  #main-content {
    display: flex;
    height: 100%;
  }

  a:link, a:visited, a:hover, a:active {
    color: black;
    text-decoration: none;
  }

  .button {
    background-color: transparent;
  }

  button:focus, button:active {
    border: none;
    outline: none;
  }

  .dropdown-menu {
    font-size: 18px;
  }

</style>

