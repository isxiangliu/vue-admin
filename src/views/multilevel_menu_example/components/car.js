import * as THREE from 'three'
import { Scene, PerspectiveCamera, WebGLRenderer, AxesHelper, Mesh, GridHelper, AmbientLight, PlaneGeometry, MeshPhysicalMaterial, DoubleSide, SpotLight, CylinderGeometry } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import GUI from 'lil-gui'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

const TWEEN = require('@tweenjs/tween.js')

let scene, camera, renderer, controls, mesh
let doors = []

export function initCar() {
    // 初始化场景
    function initScene() {
        scene = new Scene()
    }

    // 初始化相机
    function initCamera() {
        camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)
        camera.position.set(4.25, 1.4, -4.5)
    }

    // 设置渲染器
    function initRenderer() {
        const container = document.getElementById('car')
        renderer = new WebGLRenderer({
            container,
            antialias: true   // 开启反锯齿 光滑
        })
        renderer.setSize(window.innerWidth, window.innerHeight)
        container.appendChild(renderer.domElement)
        //  document.body.appendChild(renderer.domElement)
    }

    // 坐标
    function initAxesHelper() {
        const axesHelper = new AxesHelper(3)
        scene.add(axesHelper)
    }

    // 轨道控制器
    function initOrbitControls() {
        controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true // 设置阻尼 左右滑动会有惯性

        // 最大最小缩放距离 不让用户看出圆柱体
        controls.maxDistance = 9
        controls.minDistance = 1

        // 最大最小角度
        controls.minPolarAngle = 0
        controls.maxPolarAngle = 1.5

        // 开启自动旋转
        controls.autoRotate = true
        controls.autoRotateSpeed = 0.8  // 速率 值越小转动越慢
    }

    // 绘制地面网格
    function initGridHelper() {
        const grid = new GridHelper(20, 40, 'red', 0xffffff) // 20*40 红色 白色
        grid.material.opacity = 0.2
        grid.material.transparent = true // 设置透明度需要开启
        scene.add(grid)
    }

    let bodyMaterial = new THREE.MeshPhysicalMaterial({
        color: '#6e2121',
        metalness: 1, // 金属度
        roughness: 0.5, // 粗糙度
        clearcoat: 1.0, // 喷一层漆
        clearcoatRoughness: 0.03 // 漆的粗糙度
    })
    let glassMaterial = new THREE.MeshPhysicalMaterial({
        color: '#793e3e',
        metalness: 0.25,
        roughness: 0,
        transmission: 1.0 // 透光性 transmission属性可以让一些很薄的透明表面 例如玻璃 变得更真实
    })
    
    // gltf 模型
    function loadCarModel() {
        //  定义解析加载器
        const dracoLoader = new DRACOLoader().setDecoderPath('gltf/')
        dracoLoader.setDecoderConfig({ type: 'js' })
        dracoLoader.preload()
        const loader = new GLTFLoader(manager)
        loader.setDRACOLoader(dracoLoader)
        loader.load('seraphine/LamborghiniDraco.gltf', gltf => {
            const carModel = gltf.scene
            carModel.rotation.y = Math.PI
            carModel.traverse(obj => {
                //  console.log(obj.name);
                if (obj.name === 'Object_103' || obj.name === 'Object_64' || obj.name === 'Object_77') {
                    // 车身
                    obj.material = bodyMaterial
                } else if (obj.name === 'Object_90') {
                    // 玻璃
                    obj.material = glassMaterial
                } else if (obj.name === 'Empty001_16' || obj.name === 'Empty002_20') {
                    // 门
                    doors.push(obj)
                }
            })
            scene.add(carModel)
        }, xhr => {
            // console.log(xhr)
            // 侦听模型加载进度
            // console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        }, error => {
            //  加载出错时的回调
            console.log(error)
            console.log('An error happened')
        }
        )
    }
    
    const manager = new THREE.LoadingManager()
    manager.onProgress = function(item, loaded, total) {
        total != 9 ? total = 9 : total
        let jindu_text_con = document.getElementById('jindu-text-con')
        let jindu_text = document.getElementById('jindu-text')
        let jindu = document.getElementById('jindu')

        let onProgress = parseInt((loaded / total) * 100)
        jindu_text.innerText = onProgress + '%'
        jindu.style.width = onProgress + '%'
        if (onProgress == 100) {
            jindu_text_con.style.display = 'none'
        }
    }

    // 环境光处理
    function initAmbientLight() {
        const ambientLight = new AmbientLight('#fff', 0.5)
        scene.add(ambientLight)
    }

    function initFloor() {
        const floorGeometry = new PlaneGeometry(20, 20) // 平面宽高
        const material = new MeshPhysicalMaterial({
            // 双面绘制
            side: DoubleSide,
            color: 0x808080,
            // 金属度 0 非金属
            metalness: 0,
            // 粗糙度 越小越光滑
            roughness: 0.1
        })
        mesh = new Mesh(floorGeometry, material)
        mesh.rotation.x = Math.PI / 2
        scene.add(mesh)
    }

    function initSpotLight() {
        const spotLight = new SpotLight('#fff', 2)
        spotLight.angle = Math.PI / 8 // 散射角度 跟水平线的夹角
        spotLight.penumbra = 0.2    // 横向：聚光维的半影衰减百分比
        spotLight.decay = 2         // 纵向：沿着光照距离的衰减量
        spotLight.distance = 30
        spotLight.shadow.radius = 10
        // 阴影映射宽度 阴影映射高度
        spotLight.shadow.mapSize.set(4096, 4096)
        spotLight.position.set(-5, 10, 1)
        // 光照射的方向
        spotLight.target.position.set(0, 0, 0)
        spotLight.castShadow = true
        scene.add(spotLight)
    }

    // 圆柱体 模拟 展厅
    function initCylinder() {
        const geometry = new CylinderGeometry(12, 12, 20, 32)
        const material = new MeshPhysicalMaterial({
            color: 0x6c6c6c,
            side: DoubleSide
        })
        const cylinder = new Mesh(geometry, material)
        scene.add(cylinder)
    }

    function initGUI() {
        let obj = {
            bodyColor: '#6e2121',
            glassColor: '#aaa',
            carOpen,
            carClose,
            carIn,
            catOut
        }
        const gui = new GUI()
        gui.addColor(obj, 'bodyColor').name('车身颜色').onChange(value => {
            bodyMaterial.color.set(value)
        })
        gui.addColor(obj, 'glassColor').name('玻璃颜色').onChange(value => {
            glassMaterial.color.set(value)
        })
        gui.add(obj, 'carOpen').name('打开车门')
        gui.add(obj, 'carClose').name('关闭车门')
        gui.add(obj, 'carIn').name('车内视角')
        gui.add(obj, 'catOut').name('车外视角')
    }

    function carOpen() {
        for (let i = 0; i < doors.length; i++) {
            setAnimationDoor({ x: 0 }, { x: Math.PI / 3 }, doors[i])
        }
    }
    function carClose() {
        for (let index = 0; index < doors.length; index++) {
            setAnimationDoor({ x: Math.PI / 3 }, { x: 0 }, doors[index])
        }
    }
    function carIn() {
        controls.autoRotate = false
        // 相机位置 轨道位置  开始-结束
        setAnimationCamera({ cx: 4.25, cy: 1.4, cz: -4.5, ox: 0, oy: 0.5, oz: 0 }, { cx: -0.27, cy: 0.83, cz: 0.60, ox: 0, oy: 0.5, oz: -3 })
    }
    function catOut() {
        controls.autoRotate = true
        setAnimationCamera({ cx: -0.27, cy: 0.83, cz: 0.6, ox: 0, oy: 0.5, oz: -3 }, { cx: 4.25, cy: 1.4, cz: -4.5, ox: 0, oy: 0.5, oz: 0 })
    }

    function setAnimationDoor(start, end, mesh) {
        const tween = new TWEEN.Tween(start).to(end, 1000).easing(TWEEN.Easing.Quadratic.Out)
        tween.onUpdate(that => {
            //  console.log(that);
            mesh.rotation.x = that.x
        })
        tween.start()
    }

    function setAnimationCamera(start, end) {
        const tween = new TWEEN.Tween(start).to(end, 3000).easing(TWEEN.Easing.Quadratic.Out)
        tween.onUpdate(that => {
            //   camera.postition  和 controls.target 一起使用
            camera.position.set(that.cx, that.cy, that.cz)
            controls.target.set(that.ox, that.oy, that.oz)
        })
        tween.start()
    }

    function init() {
        initScene()         // 场景
        initCamera()        // 相机
        initRenderer()      // 渲染器
        // initAxesHelper()    // 坐标
        initOrbitControls() // 轨道控制器
        //  initGridHelper()    // 地面网格
        loadCarModel()      // gltf 模型
        initAmbientLight()  // 环境光
        initFloor()         // 地板
        initSpotLight()         // 聚光灯(模拟一个手电筒)
        initCylinder()       // 圆柱体
        initGUI()            // 控制器
    }

    init()

    function render(time) {
        // 动画
        renderer.render(scene, camera)
        requestAnimationFrame(render)
        controls.update()  // 设置阻尼 要更新
        TWEEN.update(time)
    }
    render()

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()

        renderer.setSize(window.innerWidth, window.innerHeight)
    })
}