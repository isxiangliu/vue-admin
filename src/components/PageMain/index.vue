<template>
    <div class="page-main watermarked">
        <div v-if="title" class="title-container">{{ title }}</div>
        <slot />
    </div>
</template>

<script>
import { genWaterMark } from '@/util/common';
export default {
    name: 'PageMain',
    props: {
        title: {
            type: String,
            default: ''
        }
    },
    mounted() {
    // const option = {
    //   content: '测试水印',
    //   className: 'watermarked',
    // };
    genWaterMark({});
  },
}
</script>

<style lang="scss" scoped>
.page-main {
    position: relative;
    margin: 20px;
    padding: 20px;
    background-color: #fff;
    .title-container {
        width: calc(100% + 40px);
        padding: 14px 20px;
        margin-left: -20px;
        margin-top: -20px;
        margin-bottom: 20px;
        border-bottom: 1px solid #eee;
    }
}
</style>
