<template>
  <div class="orgTree">
    <div class="group-organize">
      <div>
        <svg-icon name="huiyizuzhi" class="group-icon" />
        <span> 集团组织架构</span>
      </div>
    </div>
    <div class="input-area">
      <div v-if="searchVal" class="searchNote">{{ serachIndex }} / {{ searchTotal }}</div>
      <el-input
        maxlength="20"
        :value="searchVal"
        @input="heandleSearch($event)"
        @keyup.enter.native="filterTree"
        placeholder="请输入关键字查询"
      />
    </div>
    <div class="org-tree-box" v-loading="treeLoading" ref="treeBox">
      <el-tree
        :data="data"
        :props="defaultProps"
        :default-expand-all="true"
        node-key="tid"
        ref="tree"
        :expand-on-click-node="false"
        :draggable="searchVal ? false : true"
      >
        <div slot-scope="{ node, data }" class="node-item">
          <div
            @click="clickLabel(data, node)"
            :class="[{ active: defaultNode ? defaultNode.tid == data.tid : currentId == data.tid }]"
          >
            <svg-icon v-if="data.orgLevelId > 1" name="enterprise" class="tree-icon" />
            <svg-icon v-else name="total" class="tree-icon" />
            <span
              :class="[
                { 'wait-effect': data.effectType == 1 },
                { 'repeal-effect': data.effectType == 3 },
                { 'search-item': searchVal && node.label.indexOf(searchVal) > -1 },
              ]"
              >{{ node.label }}</span
            >
            <!--  只有已经生效的，才会显示人数   -->
            <span v-if="data.effectType == 0">（{{ data.personCount }}）</span>
            <!-- 如果存在updateTid 则显示  -->
            <span class="update-flag" v-if="data.updateTid" @click.stop="clickUpdateLabel(data)"> 已修改信息待生效 </span>
          </div>
        </div>
      </el-tree>
    </div>
  </div>
</template>
<script>
import {data} from '@/mock/tree'
export default {
  name: 'OrgTree',
  props: {
    //默认节点,用于编辑生成新的tid后对节点的激活状态判断
    defaultNode: {
      type: Object,
      default: null,
    },
  },
  data() {

    return {
      currentId: -1,
      searchVal: '',
      data: [], //树节点数据
      defaultProps: {
        children: 'subList',
        label: 'orgName',
      },
      treeLoading: false, //树加载动画
      searchTotal: 0,
      serachIndex: 0,
    };
  },
  created() {
    this.getListOrgInfo();
  },
  computed: {},
  methods: {
    // 搜索框输入
    heandleSearch(e) {
      this.searchVal = e;
      let firstHeightDom = this.$el.getElementsByClassName('search-item');
      this.$nextTick(() => {
        this.searchTotal = firstHeightDom.length;
        this.serachIndex = 0;
      });
    },
    // 回车查找下一个
    filterTree() {
      if (!this.searchVal || this.searchTotal == 0) {
        return;
      }
      if (this.serachIndex == this.searchTotal) {
        this.serachIndex = 1;
      } else {
        this.serachIndex++;
      }
      this.positionScroll();
    },
    getListOrgInfo() {
      this.treeLoading = true;
      //   getListOrgInfo().then((res) => {
      this.data = data
      this.treeLoading = false;
      //   });
    },
    clickLabel(data, node) {
      this.currentId = data.tid;
      this.$emit('treeClick', data);
    },
    //滚动定位
    positionScroll() {
      let dom = this.$refs.treeBox;
      this.$nextTick(() => {
        //以第一个高亮的节点我基准进行滚动
        let firstHeightDom = document.getElementsByClassName('search-item');
        //如果第一个存在
        if (firstHeightDom[this.serachIndex - 1]) {
          for (let i = 0; i < firstHeightDom.length; i++) {
            firstHeightDom[i].classList.remove('height-show');
          }
          firstHeightDom[this.serachIndex - 1].classList.add('height-show');
          let diffTop = firstHeightDom[this.serachIndex - 1].offsetTop;
          let treeViewHeight = dom.clientHeight;
          //带动画滚动
          dom.scrollTo({ top: diffTop - treeViewHeight / 2, behavior: 'smooth' });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.orgTree {
    height: 100%;
    // title
    .group-organize {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 20px;
        height: 20px;
        .group-icon {
            color: #0796f0;
            margin-right: 3px;
            font-size: 20px;
        }
    }
    // 搜索框
    .input-area {
        padding: 18px 8px 0;
        height: 50px;
        box-sizing: border-box;
        .searchNote {
            position: absolute;
            right: 18px;
            z-index: 1;
            line-height: 40px;
            font-size: 14px;
        }
    }
    // 树
    .org-tree-box {
        margin-top: 10px;
        overflow: auto;
        flex: 1;
        min-height: 0;
        // 10+20+50
        height: calc(100% - 80px);
        padding: 0 8px;
        ::v-deep .el-tree {
            background-color: transparent;
        }
        .node-item {
            .tree-icon {
                margin-right: 5px;
            }

            font-size: 14px;
            width: 100%;
            .active {
                color: #0796f0;
            }
            .update-flag {
                margin-left: 5px;
                color: #f7b500;
                &:hover {
                    text-decoration: underline;
                }
            }
            .wait-effect {
                margin-left: 5px;
                color: #f7b500;
            }
            .repeal-effect {
                margin-left: 5px;
                color: #b3b3b3;
            }
        }
    }
    .height-show {
        color: gold !important;
    }
}
</style>
