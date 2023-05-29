<template>
    <div class="card-container">
        <div v-if="symbol" class="symbol" />
        <div v-if="title" class="block-title">
            <div class="title">{{ title }}</div>
            <div v-if="full || share || download" class="buttons">
                <div v-if="full" class="base-btn" @click="handleClick('full')">
                    <i class="el-icon-full-screen" />
                </div>
                <div v-if="share" class="base-btn" @click="handleClick('share')">
                    <i class="el-icon-share" />
                </div>
                <div v-if="download" class="base-btn" @click="handleClick('download')">
                    <i class="el-icon-download" />
                </div>
            </div>
        </div>
        <slot />
    </div>
</template>

<script>
export default {
    name: 'BlockTitle',
    props: {
        symbol: {
            type: Boolean,
            default: true
        },
        /**
     * 标题栏
     */
        title: {
            type: String,
            default: ''
        },
        /* 开启下载功能 */
        download: {
            type: Boolean,
            default: false
        },
        /* 开启分享功能 */
        share: {
            type: Boolean,
            default: false
        },
        /* 开启全屏功能 */
        full: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {}
    },
    methods: {
        /**
         * @description 点击事件
         * @author xiangliu
         * @date 2022/12/20 21:04
         * @param type 类型 download-下载 share-分享 full-全屏
         */
        handleClick(type) {
            if (type === 'share') {
                this.copyLink()
                this.$message.success('分享链接已复制到剪贴板')
            }
            this.$emit(type)
        },
        copyLink() {
            const input = document.createElement('input')
            input.value = window.location
            input.id = 'input'
            document.body.appendChild(input)
            input.select()
            document.execCommand('Copy') // 执行浏览器复制命令
            let creatDom = document.getElementById('input')
            creatDom.parentNode.removeChild(creatDom)
        }
    }
}
</script>

<style scoped lang="scss">
@import '~@/assets/styles/variables.scss';
[data-mode='mobile'] {
    .base-btn {
        margin-left: 0 !important;
    }
}
.card-container {
    background-color: #fff;
    border-radius: 6px;
    padding: 20px 50px;
    position: relative;
    .symbol {
        position: absolute;
        top: 29px;
        left: 20px;
        display: inline-block;
        content: '';
        width: 8px;
        height: 8px;
        background-color: $primaryColor;
        margin-right: 24px;
    }
    .block-title {
        margin-bottom: 20px;
    }
}
.card-container + .card-container {
    margin-top: 20px;
}
.block-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: $primaryColor;
        font-size: 18px;
        line-height: 25px;
        font-weight: bold;
    }
    .buttons {
        .base-btn {
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background-color: #f3faff;
            border-radius: 4px;
            font-size: 18px;
            width: 28px;
            height: 28px;
        }
        .base-btn + .base-btn {
            margin-left: 26px;
        }
    }
}
</style>
