<template>
  <div class="date-choice-box">
    <!--开始-->
    <el-date-picker
      class="flex-width"
      v-model="form.startDate"
      :picker-options="pickerStart"
      type="date"
      format="yyyy-MM-dd"
      placeholder="选择开始日期"
      :disabled="startDisabled"
    >
    </el-date-picker>
    <!--分隔符-->
    <span class="margin-left margin-right">-</span>
    <!-- 结束 -->
    <el-date-picker
      class="flex-width"
      v-model="form.endDate"
      :picker-options="pickerEnd"
      type="date"
      format="yyyy-MM-dd"
      placeholder="选择结束日期"
      :disabled="endDisabled"
    >
    </el-date-picker>
  </div>
</template>
<script>
export default {
  name: 'DateChoice',
  props: {
    form: {
      //开始日期
      startDate: {
        type: String,
        default: '',
      },
      //结束日期
      endDate: {
        type: String,
        default: '',
      },
    },
    //开始的禁用
    startDisabled: {
      type: Boolean,
      default: false,
    },
    //结束的禁用
    endDisabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      pickerStart: {
        disabledDate: (time) => {
          return this.pickDateStart(time);
        },
      },
      pickerEnd: {
        disabledDate: (time) => {
          return this.pickDateEnd(time);
        },
      },
    };
  },
  computed: {},
  methods: {
    pickDateStart(time) {
      if (this.form.endDate) {
        return time.getTime() > this.form.endDate;
      } else {
        return false;
      }
    },
    pickDateEnd(time) {
      if (this.form.startDate) {
        return time.getTime() < this.form.startDate;
      } else {
        return false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.date-choice-box {
    width: 100%;
    display: flex;
    align-items: center;
    .margin-right {
        margin-right: 10px;
    }
    .margin-left {
        margin-left: 10px;
    }
    .flex-width {
        flex: 1;
    }
}
</style>
