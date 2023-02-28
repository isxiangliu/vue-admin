<template>
  <div class="nav-tar">
    <router-link
      v-slot="{ navigate }"
      custom
      :to="to"
      :class="{
        title: true,
        'is-link': $store.state.settings.enableDashboard,
      }"
      :title="title"
      tag="div"
    >
      <div @click="navigate">
        <img v-if="showLogo" :src="logo" class="logo" />
        <span v-if="showTitle">{{ title }}</span>
      </div>
    </router-link>
    <div
      :class="['nav-title', { active: currentIndex == index }]"
      @click="titleClick(index)"
      v-for="(item, index) in titleBar"
      :key="item.id"
    >
      <span>{{ item.title }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Logo',
  props: {
    showLogo: {
      type: Boolean,
      default: true,
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      title: process.env.VUE_APP_TITLE,
      logo: require('@/assets/images/min-logo.png'),
      titleBar: [
        { id: 0, title: '首页' },
        { id: 1, title: '组织管理' },
        { id: 2, title: '招聘管理' },
        { id: 3, title: '人事管理' },
      ],
      currentIndex: 0,
    };
  },
  computed: {
    to() {
      let rtn = {};
      if (this.$store.state.settings.enableDashboard) {
        rtn.name = 'dashboard';
      }
      return rtn;
    },
  },
  methods: {
    titleClick(index) {
      this.currentIndex = index;
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
    position: fixed;
    z-index: 1000;
    top: 0;
    width: inherit;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: $g-sidebar-logo-height;
    text-align: center;
    overflow: hidden;
    text-decoration: none;
    margin-right: 40px;
    &.is-link {
        cursor: pointer;
    }
    .logo {
        width: 30px;
        height: 30px;
        & + span {
            margin-left: 10px;
        }
    }
    span {
        display: block;
        font-weight: bold;
        color: #fff;
        @include text-overflow;
    }
}
.nav-tar {
    display: flex;
    .nav-title {
        text-align: center;
        padding: 8px 0;
        line-height: 50px;
        cursor: pointer;
        span {
            padding: 0 12px;
        }
        &.active {
            border-bottom: 3px solid red;
        }
    }
}
</style>
