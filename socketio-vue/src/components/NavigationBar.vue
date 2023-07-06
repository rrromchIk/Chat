<template>
    <nav>
        <ul>
            <li v-for="(page, index) in pages" :key="index"><a :href=page.link target="_self">{{page.text}}</a></li>
        </ul>
    </nav>
</template>

<script>
    export default {
        name: "NavigationBar",
        props: ["pages"]
    }
</script>

<style scoped>
    ul {
        list-style-type: none;
    }

    nav {
        margin: 40px;
    }

    li {
        margin-bottom: 10px;
        font-size: 24px;
    }
</style>