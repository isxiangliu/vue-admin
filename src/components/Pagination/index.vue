<template>
    <div :class="{ hidden: hidden }" class="pagination-container">
        <el-pagination
            :background="background"
            :current-page.sync="currentPage"
            :page-size.sync="pageSize"
            :layout="layout"
            :page-sizes="pageSizes"
            :total="total"
            v-bind="$attrs"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </div>
</template>

<script>
import { scrollTo } from '@/util/common'

export default {
    name: 'Pagination',
    props: {
        total: {
            required: true,
            type: Number
        },
        page: {
            type: Number,
            default: 1
        },
        limit: {
            type: Number,
            default: 15
        },
        pageSizes: {
            type: Array,
            default() {
                return [10, 15, 20, 50, 100]
            }
        },
        layout: {
            type: String,
            default: 'total, sizes, prev, pager, next, jumper'
        },
        background: {
            type: Boolean,
            default: true
        },
        autoScroll: {
            type: Boolean,
            default: true
        },
        hidden: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        currentPage: {
            get() {
                return this.page
            },
            set(val) {
                this.$emit('update:page', val)
            }
        },
        pageSize: {
            get() {
                return this.limit
            },
            set(val) {
                this.$emit('update:limit', val)
            }
        }
    },
    methods: {
        handleSizeChange(val) {
            // 切换每页数量，将页码置为1
            this.currentPage = 1
            this.$emit('pagination', { page: this.currentPage, limit: val })
            if (this.autoScroll) {
                scrollTo(0, 800)
            }
        },
        handleCurrentChange(val) {
            this.$emit('pagination', { page: val, limit: this.pageSize })
            if (this.autoScroll) {
                scrollTo(0, 800)
            }
        }
    }
}
</script>

<style scoped>
.pagination-container {
    background: #fff;
    padding: 32px 16px;
    text-align: right;
}
.pagination-container.hidden {
    display: none;
}
</style>

