<template>
    <div>
        <el-dialog title="全屏显示" :visible.sync="dialogVisible" :fullscreen="true" center>
            <HorizontalBarChart
                v-if="screenHeight"
                ref="HorizontalBarChart"
                :chart-data="barChartData"
                :style="{ width: screenWidth - 110 + 'px', height: screenHeight - 110 + 'px' }"
            />
        </el-dialog>
        <PageMain>
            <div id="scene" />
        </PageMain>
        <PageMain>
            <canvas id="three" />
        </PageMain>
        <PageMain class="viewNav">
            <el-row :gutter="10">  
                <el-col :span="12">
                    <map-chart ref="mapChart" class="mapChart" style="height: 500px;" />
                </el-col>
                <el-col :span="12">
                    <AllAgeEmployees :chart-data="circleChartData" style="height: 500px;" />
                </el-col>
                <el-col :span="24">
                    <BlockTitle
                        title="各部门人数"
                        full
                        share
                        download
                        @download="downloadChart($refs.chart.chart, `各部门人数`)"
                        @full="fullChart"
                    >
                        <HorizontalBarChart ref="chart" :chart-data="barChartData" style="height: 280px;" />
                    </BlockTitle>
                </el-col>
            </el-row>
        </PageMain>
        <PageMain class="watermarked">
            <div class="left-box">
                <OrgTree @treeClick="treeClick" />
            </div>
        </PageMain>
        <PageMain>
            <el-form label-position="top" label-width="80px" :model="form" :rules="rules">
                <el-form-item label="手机号" prop="iphone">
                    <el-input v-model="form.iphone" />
                </el-form-item>
                <el-form-item label="时间" prop="date">
                    <DateChoice size="small" :form="form" />
                </el-form-item>
            </el-form>
        </PageMain>
        <PageMain>
            <el-button v-throttle type="primary" @click="getList">我是节流按钮</el-button>
            <el-button v-debounce="getList" type="primary">我是防抖按钮</el-button>
            <Pagination
                v-show="total > 0"
                :total="total"
                :page.sync="page.NowPage"
                :limit.sync="page.OnePageCount"
                :page-sizes="[10, 15, 20]"
                @pagination="getList"
            />
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
                    v-for="(value1, key1, index1) in tableData['header_labels']"
                    :key="index1"
                    :label="value1['label']"
                    align="center"
                >
                    <el-table-column v-for="(value2, key2, index2) in value1['children']" :key="index2" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row[key2] }}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>
            <br>
            <el-table border :data="testData" style="width: 100%;" :span-method="arraySpanMethod1">
                <el-table-column prop="date" label="日期" />
                <el-table-column prop="name" label="姓名" />
                <el-table-column prop="address" label="地址" />
            </el-table>
        </PageMain>
        <PageMain>
            <el-button v-throttle type="primary" @click="getList('FileSaver')">FileSaver下载预览文件</el-button>
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
            <CascaderArea />
            <!-- 富文本 -->
            <Editor />
            <!-- 居中 -->
            <ExampleNotice />
            <!-- 上传文件可拖拽 -->
            <FileUpload />
            <!-- 图片放大预览 -->
            <ImagePreview width="200px" height="200px" :src="imgbase4" />
            <!-- 上传文件 -->
            <ImagesUpload action="/webapi/service-personnel/staffFile/v1/doSave" />
            <Result type="success" title="成功" desc="文字描述" />
            <Result type="warning" title="警告" />
            <Result type="error" title="失败" />
            <!-- 排版 -->
            <div v-for="(item, index) in data" :key="index" style="width: 200px; border: 1px solid #000; float: left;">
                <div>
                    {{ item.rr }}
                    <span style="float: right;">{{ item.date }}</span>
                </div>
            </div>
            <div style="clear: both;" />
        </PageMain>
        <PageMain>
            <video class="video-bg" playsinline="" autoplay="" muted="" loop="">
                <source src="@/assets/video/login_bg.mp4" type="video/mp4">
            </video>
        </PageMain>
        <!-- 下拉触底 -->
        <FixedActionBar />
    </div>
</template>
<script>
import ExampleNotice from '@/components/ExampleNotice/main.vue'
// 校验规则
import { validateMobile } from '@/util/validate'
// 水印
import { genWaterMark } from '@/util/common'
// 文件下载
import FileSaver from 'file-saver'
import { imgbase4, tableData, testData, mapData, departmentChart, circleTestData } from '@/assets/utils/test'
import MapChart from './components/MapChart'
import HorizontalBarChart from './components/HorizontalBarChart'
import BlockTitle from './components/BlockTitle'
import AllAgeEmployees from './components/AllAgeEmployees'
import Chart from '@/mixin/chart'
import * as THREE from 'three/build/three.module'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
export default {
    components: {
        ExampleNotice,
        MapChart,
        HorizontalBarChart,
        BlockTitle,
        AllAgeEmployees
    },
    mixins: [Chart],
    data() {
        return {
            data: [
                { rr: '3232放电饭锅大概地方43', date: '2022/02/02' },
                { rr: '323243辅导书的回复郭德纲防守打法', date: '2022/02/02' },
                { rr: '323243鬼地方个地方官多个电饭锅电饭锅', date: '2022/02/02' }
            ],
            form: {},
            rules: {
                iphone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: validateMobile, trigger: 'blur' }
                ]
            },
            total: 30,
            page: {
                NowPage: 1,
                OnePageCount: 15
            },
            tableData: tableData,
            imgbase4: imgbase4,
            testData: testData,
            mapData: mapData,
            circleTestData: circleTestData,
            circleChartData: {},
            barChartData: {
                department: [],
                data: []
            }
        }
    },
    watch: {
        screenHeight(val) {
            this.screenHeight = val
        },
        screenWidth(val) {
            this.screenWidth = val
        }
    },
    created() {
    },
    mounted() {
        // const option = {
        //   content: '测试水印',
        //   className: 'watermarked',
        // };
        genWaterMark({}) // 水印
        this.fetchMapData() // 地图
        this.getDepartmentInfoChart() // 部门人数
        this.getAgeRangePageChart() // 各年龄员工分布
        // 获取浏览器窗口大小
        window.onresize = () => {
            return (() => {
                this.screenHeight = window.innerHeight
                this.screenWidth = window.innerWidth
            })()
        }
        this.init()
        this.initMap()
    },
    methods: {
        initMap() {
            const scene = new THREE.Scene()
            const container = document.getElementById('scene')
            const renderer = new THREE.WebGLRenderer({ container, antialias: true }) // 新建一个WebGLRenderer
            container.appendChild(renderer.domElement) // body元素中插入canvas对象

            const camera = new THREE.PerspectiveCamera(
                60, 
                window.innerWidth / window.innerHeight, 
                1, 
                100000
            )
            camera.position.set(6000, 9000, 6000) // 树上面观察
            // camera.position.set(200, 30, 200) // 树下面观察
            camera.lookAt(scene.position) // 设置相机方向(指向的场景对象)

            const controls = new OrbitControls(camera, renderer.domElement)
            controls.enableDamping = true// 添加阻尼感 真实

            const axesHelper = new THREE.AxesHelper(5000)
            scene.add(axesHelper)

            function animate() {
                renderer.render(scene, camera)
                controls.update()
                requestAnimationFrame(animate) // 请求再次执行渲染函数render
                if (resizeRendererToDisplaySize(renderer)) {
                    const canvas = renderer.domElement
                    camera.aspect = canvas.clientWidth / canvas.clientHeight
                    camera.updateProjectionMatrix()
                }
            }
            animate()

            const loader = new GLTFLoader()
            loader.load('/seraphine/shanghai.gltf', gltf => {
                let model = gltf.scene
                // model.scale.set(4, 4, 4)
                // model.rotation.y = Math.PI 
                // model.rotation.z = Math.PI / 4
                scene.add(model)
            })
            // 创建点光源和环境光源
            const point = new THREE.PointLight(0xffffff)
            point.position.set(6000, 9000, 6000) // 点光源位置
            scene.add(point) // 点光源添加到场景中
            // 环境光
            const ambient = new THREE.AmbientLight(0x888888)
            scene.add(ambient)

            // 此属性返回当前显示设备的物理像素分辨率与CSS像素分辨率的比值 解决模糊
            function resizeRendererToDisplaySize(renderer) {
                const canvas = renderer.domElement
                var width = window.innerWidth
                var height = window.innerHeight
                var canvasPixelWidth = canvas.width / window.devicePixelRatio
                var canvasPixelHeight = canvas.height / window.devicePixelRatio
                const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height
                if (needResize) {
                    renderer.setSize(width, height, false)
                }
                return needResize
            }
            
        },
        init() {
            const scene = new THREE.Scene()
            scene.background = new THREE.Color('#eee')
            // 给场景加个雾
            scene.fog = new THREE.Fog('#eee', 20, 100)
            const canvas = document.querySelector('#three')
            const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
            // 添加影子
            renderer.shadowMap.enabled = true
            const camera = new THREE.PerspectiveCamera(
                50,
                window.innerWidth / window.innerHeight,
                0.1,
                1000
            )
            camera.position.set(0, 0, 10)
            
            const controls = new OrbitControls(camera, renderer.domElement)
            controls.enableDamping = true// 添加阻尼感 真实
            const axesHelper = new THREE.AxesHelper(3)
            scene.add(axesHelper)
            function animate() {
                renderer.render(scene, camera)
                controls.update()
                requestAnimationFrame(animate)
                if (resizeRendererToDisplaySize(renderer)) {
                    const canvas = renderer.domElement
                    camera.aspect = canvas.clientWidth / canvas.clientHeight
                    camera.updateProjectionMatrix()
                }
            }
            animate()

            const gltfLoader = new GLTFLoader()
            gltfLoader.load('/seraphine/scene.gltf', gltf => {
                let model = gltf.scene
                // 遍历模型每部分
                model.traverse(i => {
                    // 将图片作为纹理加载
                    let explosionTexture = new THREE.TextureLoader().load(
                        '/seraphine/textures/Mat_cwfyfr1_userboy17.bmp_diffuse.png'
                    )
                    // 调整纹理图的方向
                    explosionTexture.flipY = false
                    // 将纹理图生成基础网格材质(MeshBasicMaterial)
                    const material = new THREE.MeshBasicMaterial({
                        map: explosionTexture
                    })
                    // 给模型每部分上材质
                    i.material = material

                    // 让模型等每个部分都能产生阴影
                    if (i.isMesh) {
                        i.castShadow = true
                        i.receiveShadow = true
                    }
                })
                model.position.z = 1.5
                model.rotation.y = Math.PI / 2
                scene.add(model)
            })
            
            // 此属性返回当前显示设备的物理像素分辨率与CSS像素分辨率的比值 解决模糊
            function resizeRendererToDisplaySize(renderer) {
                const canvas = renderer.domElement
                var width = window.innerWidth
                var height = window.innerHeight
                var canvasPixelWidth = canvas.width / window.devicePixelRatio
                var canvasPixelHeight = canvas.height / window.devicePixelRatio
                const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height
                if (needResize) {
                    renderer.setSize(width, height, false)
                }
                return needResize
            }

            // 添加光与影
            let floorGeometry = new THREE.PlaneGeometry(3000, 3000) // 平面几何体
            let floorMaterial = new THREE.MeshPhongMaterial({color: 0x857ebb, shininess: 0})
            let floor = new THREE.Mesh(floorGeometry, floorMaterial)
            floor.rotation.x = -0.5 * Math.PI
            floor.receiveShadow = true
            floor.position.y = -0.001
            scene.add(floor)
            
            // 平行光
            const dirLight = new THREE.DirectionalLight(0xffffff, 0.6)
            // 光源等位置
            dirLight.position.set(-10, 8, -5)
            // 可以产生阴影
            dirLight.castShadow = true
            dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024)
            scene.add(dirLight)
            
            // 添加多个光源，让场景看起来更真实
            const hemLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6)
            hemLight.position.set(0, 48, 0)
            scene.add(hemLight)
        },

        getList(val) {
            console.log('表格数据更新')
            const blob = new Blob(['htmlCode!'], { type: '' })
            const file = new File(['DevPoint，开发技术点'], 'info.md', { type: 'text/plain' })
            console.log(file)
            if (val == 'FileSaver') {
                console.log(blob)
                // file为文件（文件地址或后台返回的二进制blob文件）
                // fileName为文件名称（结尾必须包含文件格式如.pdf）
                // FileSaver.saveAs(Blob/File/Url, fileName)
                FileSaver.saveAs(
                    'https://www.lilnong.top/static/pdf/B-4-RxJS%E5%9C%A8React%E4%B8%AD%E7%9A%84%E5%BA%94%E7%94%A8-%E9%BE%99%E9%80%B8%E6%A5%A0_.pdf',
                    'hello.pdf'
                )
                // FileSaver.saveAs("https://httpbin.org/image", "图像.jpg");
                // FileSaver.saveAs(file,"info.md");
            }
        },
        treeClick(res) {
            console.log(res)
        },

        hiddenHeaderRow({ rowIndex }) {
            if (rowIndex === 1) {
                // 隐藏第二行
                return 'hiddenClass'
            }
        },
        // 合并
        arraySpanMethod2({ rowIndex, columnIndex }) {
            if (rowIndex <= 1) {
                if (columnIndex % 3 === 1) {
                    // 1 5 7
                    return [1, 2] // 返回的是需要合并的行和列的数量，不是下标，是固定的
                } else if (columnIndex % 3 === 2) {
                    // 2 5 8
                    return [0, 0]
                }
            }
        },
        // 通过坐标添加类名
        addClass2({ rowIndex, columnIndex }) {
            if (rowIndex === 1) {
                return 'sonStyle'
            } else if (rowIndex === 0 && columnIndex % 3 == 0) {
                return 'sonStyle'
            }
        },
        arraySpanMethod1({ rowIndex, columnIndex }) {
            if (rowIndex == 3) {
                // 当前第二行
                if (columnIndex % 2 === 1) {
                    return [1, 2] // 行 列
                } else if (columnIndex == 2) {
                    return [0, 0]
                }
            }
        },
        // 获取地图数据
        async fetchMapData() {
            const mapChart = this.$refs.mapChart
            if (!mapChart) {
                return
            }
            mapChart.showChartLoading()
            // const mapData = await getHomeMap().finally(() => mapChart.hiddenChartLoading());
            const mapData = this.mapData
            mapChart.hiddenChartLoading()
            mapChart.init(mapData)
        },
        // 各部门人数
        getDepartmentInfoChart() {
            const res = departmentChart
            let nameList = res.list[0].name
            let chartName = []
            for (let key in nameList) {
                chartName.push(nameList[key])
            }
            this.barChartData.department = chartName

            let numList = res.list[0].data
            let chartNumber = []
            for (let key in numList) {
                chartNumber.push(numList[key])
            }
            this.barChartData.data = chartNumber
        },
        // 各年龄员工分布
        getAgeRangePageChart() {
            this.circleChartData = this.circleTestData
        }
    }
}
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
.viewNav {
    background-color: #00031b;
}
#three {
    width: 100%;
    height: 100%;
}
#scene {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>

