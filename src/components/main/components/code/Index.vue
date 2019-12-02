<style scoped lang="less">
    .scan-code {
        .bt {
            margin-right: 10px;
        }
    }
</style>

<template>
    <div class="scan-code">
        <Button type="success" size="small" class="bt" @click="goFastPage">快速入口</Button>

    </div>
</template>

<script>
    export default {
        props: [],
        components: {
        },
        data () {
            return {
            }
        },
        created () {

        },
        mounted () {

        },
        computed: {},
        watch: {},
        methods: {
            goFastPage() {
                this.$router.push({name: 'o-scan'})
            }
        },
    }
</script>
