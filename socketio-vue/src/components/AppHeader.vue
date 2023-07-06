<template>
    <header>
        <div id="logo">
            {{logo}}
        </div>

        <div id="user-info">
            <div id="profile">
                <button type="button" class="button">
                    <i class="fa">&#xf2bd; {{userFullName}}</i>
                </button>
            </div>
        </div>
    </header>
</template>

<script>
export default {
    name: "AppHeader",

    data() {
        return {
            hasNotification: false
        }
    },

    props: [
        "logo", "userFullName" 
    ]
}
</script>

<style scoped>
    header {
        display: flex;
        background-color: #9B9B9B;
        padding: 15px 20px 15px 20px;
        color: white;
        justify-content: space-between;
        font-size: 24px;
    }

    #logo {
        order: 0;
    }

    #user-info {
        order: 1;
        display: flex;
        justify-content: space-between;
    }

    #notification-icon {
        margin-right: 10px;
    }

    #notification-button {
        font-size: 22px;
    }

    #notification-dot {
        visibility: hidden;
        display: inline-block;
        height: 10px;
        width: 10px;
        border: 1px solid #FF7D00;
        border-radius: 50%;
        background-color: #FF7D00;
        margin-left: -40%;
        margin-top: 5%;
        vertical-align: top;
        box-shadow: 1px 1px black;
    }

    .pulse {
        visibility: visible  !important;
        animation-name: flickering;
        animation-duration: 1.5s;
        animation-iteration-count: 10;
    }

    @keyframes flickering {
        from {box-shadow: 1px 1px black;
            transform: scale(0.8, 0.8);
        }
        to {box-shadow: none;
            transform: scale(1.1, 1.1);
            box-shadow: 1.2px 1.2px black;
        }
    }
</style>