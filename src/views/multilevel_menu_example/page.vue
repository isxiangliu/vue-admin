<template>
  <div>
    <PageMain>
      <video class="video-bg" playsinline="" autoplay="" muted="" loop="">
        <source src="@/assets/video/login_bg.mp4" type="video/mp4" />
      </video>
    </PageMain>
    <PageMain class="watermarked">
      <div class="left-box">
        <OrgTree @treeClick="treeClick"></OrgTree>
      </div>
    </PageMain>
    <PageMain>
      <el-form label-position="top" label-width="80px" :model="form" :rules="rules">
        <el-form-item label="手机号" prop="iphone">
          <el-input v-model="form.iphone"></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="date">
          <DateChoice size="small" :form="form"></DateChoice>
        </el-form-item>
      </el-form>
    </PageMain>
    <PageMain>
      <el-button type="primary" v-throttle @click="getList">我是节流按钮</el-button>
      <el-button type="primary" v-debounce="getList">我是防抖按钮</el-button>
      <Pagination
        v-show="total > 0"
        :total="total"
        :page.sync="page.NowPage"
        :limit.sync="page.OnePageCount"
        :pageSizes="[10, 15, 20]"
        @pagination="getList"
      >
      </Pagination>
    </PageMain>
    <PageMain>
      <el-table
        :data="tableData['col_values']"
        style="width: 100%;"
        :header-cell-class-name="hiddenHeaderRow"
        :span-method="arraySpanMethod2"
        :cell-class-name="addClass2"
      >
        <el-table-column
          :label="value1['label']"
          v-for="(value1, key1, index1) in tableData['header_labels']"
          :key="index1"
          align="center"
        >
          <el-table-column v-for="(value2, key2, index2) in value1['children']" :key="index2" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row[key2] }}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <br />
      <el-table border :data="testData" style="width: 100%;" :span-method="arraySpanMethod1">
        <el-table-column prop="date" label="日期"> </el-table-column>
        <el-table-column prop="name" label="姓名"> </el-table-column>
        <el-table-column prop="address" label="地址"> </el-table-column>
      </el-table>
    </PageMain>
    <PageMain>
      <el-button type="primary" v-throttle @click="getList('FileSaver')">FileSaver下载预览文件</el-button>
    </PageMain>
    <PageMain>
      <!-- 图标 -->
      <svg-icon name="user" />
      <!-- 权限 -->
      <Auth :value="['department.create', 'department.edit']">
        1111
        <template slot="no-auth"> 2222 </template>
        <span v-auth="'department.create'">333</span>
      </Auth>
      <!-- 级联 -->
      <CascaderArea> </CascaderArea>
      <!-- 富文本 -->
      <Editor></Editor>
      <!-- 居中 -->
      <ExampleNotice> </ExampleNotice>
      <!-- 上传文件可拖拽 -->
      <FileUpload></FileUpload>
      <!-- 下拉触底 -->
      <FixedActionBar></FixedActionBar>
      <!-- 图片放大预览 -->
      <ImagePreview width="200px" height="200px" :src="imgbase4"></ImagePreview>
      <!-- 上传文件 -->
      <ImagesUpload action="/webapi/service-personnel/staffFile/v1/doSave"></ImagesUpload>
      <Result type="success" title="成功" desc="文字描述"></Result>
      <Result type="warning" title="警告"></Result>
      <Result type="error" title="失败"></Result>
      <!-- 排版 -->
      <div style="width: 200px; border: 1px solid #000; float: left;" v-for="(item, index) in data" :key="index">
        <div>
          {{ item.rr }}
          <span style="float: right;">{{ item.date }}</span>
        </div>
      </div>
      <div style="clear: both;"></div>
    </PageMain>
  </div>
</template>
<script>
import ExampleNotice from '@/components/ExampleNotice/main.vue';
//校验规则
import { validateMobile } from '@/util/validate';
//水印
import { genWaterMark } from '@/util/common';
//文件下载
import FileSaver from 'file-saver';
import { imgbase4, tableData, testData } from '@/assets/utils/test';
export default {
  components: {
    ExampleNotice,
  },
  data() {
    return {
      data: [
        { rr: '3232放电饭锅大概地方43', date: '2022/02/02' },
        { rr: '323243辅导书的回复郭德纲防守打法', date: '2022/02/02' },
        { rr: '323243鬼地方个地方官多个电饭锅电饭锅', date: '2022/02/02' },
      ],
      form: {},
      rules: {
        iphone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' },
        ],
      },
      total: 30,
      page: {
        NowPage: 1,
        OnePageCount: 15,
      },
      tableData: tableData,
      imgbase4: imgbase4,
      testData: testData,
    };
  },
  created() {},
  mounted() {
    // const option = {
    //   content: '测试水印',
    //   className: 'watermarked',
    // };
    genWaterMark({});
  },
  computed: {},
  methods: {
    getList(val) {
      console.log('表格数据更新');
      const blob = new Blob(['htmlCode!'], { type: '' });
      const file = new File(['DevPoint，开发技术点'], 'info.md', { type: 'text/plain' });
      if (val == 'FileSaver') {
        console.log(blob);
        // file为文件（文件地址或后台返回的二进制blob文件）
        // fileName为文件名称（结尾必须包含文件格式如.pdf）
        // FileSaver.saveAs(Blob/File/Url, fileName)
        FileSaver.saveAs(
          'https://www.lilnong.top/static/pdf/B-4-RxJS%E5%9C%A8React%E4%B8%AD%E7%9A%84%E5%BA%94%E7%94%A8-%E9%BE%99%E9%80%B8%E6%A5%A0_.pdf',
          'hello.pdf'
        );
        // FileSaver.saveAs("https://httpbin.org/image", "图像.jpg");
        // FileSaver.saveAs(file,"info.md");
      }
    },
    treeClick(res) {
      console.log(res);
    },

    hiddenHeaderRow({ rowIndex }) {
      if (rowIndex === 1) {
        //隐藏第二行
        return 'hiddenClass';
      }
    },
    //合并
    arraySpanMethod2({ rowIndex, columnIndex }) {
      if (rowIndex <= 1) {
        if (columnIndex % 3 === 1) {
          //1 5 7
          return [1, 2]; // 返回的是需要合并的行和列的数量，不是下标，是固定的
        } else if (columnIndex % 3 === 2) {
          //2 5 8
          return [0, 0];
        }
      }
    },
    // 通过坐标添加类名
    addClass2({ rowIndex, columnIndex }) {
      if (rowIndex === 1) {
        return 'sonStyle';
      } else if (rowIndex === 0 && columnIndex % 3 == 0) {
        return 'sonStyle';
      }
    },
    arraySpanMethod1({ rowIndex, columnIndex }) {
        if (rowIndex ==3 ) { //当前第二行
            console.log(rowIndex, columnIndex);
            if (columnIndex%2===1) {  
                console.log(columnIndex,'zz');
                return [1,2]   //行 列
            }
            else if (columnIndex==2) {
                 console.log(columnIndex,'qq');
                return [0,0]
            }
        }
    },
  },
};
</script>
 <style lang="scss" scoped>
[data-mode='mobile'] {
    .left-box {
        width: 100%;
    }
}
.svg-icon {
    font-size: 20px;
}
.video-bg {
    width: 100%;
    height: 100%;
}
.left-box {
    box-sizing: border-box;
    transition: width 0.3s ease-in-out, transform 0.3s ease-in-out;
    display: flex;
    flex-direction: column;
    height: 500px;
    width: 400px;
    position: relative;
}
::v-deep .hiddenClass {
    display: none;
}
::v-deep .sonStyle {
    font-weight: bold;
    background-color: #f0f9eb;
    font-size: 14px;
    color: #27a2ff;
}
</style>


