<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: 'App'
    }
</script>

<style lang="less">
    .size {
        min-width: 1280px;
        height: 100%;
    }

    html, body {
        .size;
        overflow: hidden;
        margin: 0;
        padding: 0;
    }

    #app {
        .size;
    }
    .side-menu-wrapper {
        & > .ivu-menu {
            .ivu-menu-item {
                font-size: 14px;
            }
            & > li.ivu-menu-item, & > li.ivu-menu-submenu {
                font-size: 16px;
            }

        }
    }

</style>
