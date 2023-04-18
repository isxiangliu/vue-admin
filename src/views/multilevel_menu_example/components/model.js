import * as THREE from 'three/build/three.module'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
export function initModel() {
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
    let floorMaterial = new THREE.MeshPhongMaterial({ color: 0x857ebb, shininess: 0 })
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
}

