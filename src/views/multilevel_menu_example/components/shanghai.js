import * as THREE from 'three/build/three.module'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let height = {
    value: 0
}
export function initMap() {
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
    camera.position.set(-103.723, 533.241, 3017.000) // 树上面观察
    // camera.position.set(200, 30, 200) // 树下面观察
    camera.lookAt(scene.position) // 设置相机方向(指向的场景对象)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true// 添加阻尼感 真实

    const axesHelper = new THREE.AxesHelper(5000)
    scene.add(axesHelper)

    function animate() {
        height.value += 0.08
        if (height.value > 50) {
            height.value = 0.0
        }
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
        // 模型材质分为两个部分，第一部分是模型的线框材质，第二部分是模型的面材质，首先来说线框材质
        model.traverse(child => {
            // console.log(child)
            // 设置线框材质 
            if (child.isMesh) {
                // 这个判断模型是楼房还是其他  加载不同的材质
                if (['CITY_UNTRIANGULATED'].includes(child.name)) {
                    // 拿到模型线框的Geometry
                    const edges = new THREE.EdgesGeometry(child.geometry, 1)
                    // 设置模型材质
                    const lineMaterial = new THREE.LineBasicMaterial({
                        color: '#2685FE'
                    })
                    // 数据组合
                    const lineS = new THREE.LineSegments(edges, lineMaterial)
                    // 设置数据的位置
                    lineS.position.set(
                        child.position.x,
                        child.position.y,
                        child.position.z
                    )
                    lineS.rotation.x = -Math.PI / 2
                    scene.add(lineS)

                    // 面材质
                    const material = new THREE.MeshPhysicalMaterial({
                        color: '#32AAFF',
                        // 金属度
                        metalness: 0.5,
                        // 粗糙度
                        roughness: 0.1,
                        // 透明度
                        transmission: 0.9,
                        // 模型是否透明
                        transparent: true

                    })
                    const mesh = new THREE.Mesh(child.geometry, material)
                    mesh.position.set(
                        child.position.x,
                        child.position.y,
                        child.position.z
                    )
                    mesh.rotation.x = -Math.PI / 2
                    scene.add(mesh)

                    setCityMaterial(child)
                } else if (['ROADS'].includes(child.name)) {
                    // 道路
                    const material = new THREE.MeshBasicMaterial({
                        color: '#292E2F'

                    })
                    const roadsMesh = new THREE.Mesh(child.geometry, material)
                    roadsMesh.position.set(
                        child.position.x,
                        child.position.y,
                        child.position.z
                    )
                    roadsMesh.rotation.x = -Math.PI / 2
                    scene.add(roadsMesh)
                } else {
                    // 地面
                    const material = new THREE.MeshBasicMaterial({
                        color: '#040912'
                    })
                    const floorMesh = new THREE.Mesh(child.geometry, material)
                    floorMesh.rotation.x = -Math.PI / 2
                    floorMesh.position.set(
                        child.position.x,
                        child.position.y,
                        child.position.z
                    )
                    scene.add(floorMesh)
                }
            }
        })
        scene.add(model)
    })

    // 扩散散光
    function setCityMaterial(object) {
        // 上升线效果实现  (自定义材质)
        /**
         * @author xiangliu
         * @description: 这个效果的实现需要四个值
         * @date 2023-04-18 14:47
         * @param height      线上升到的高度
         * @param uFlowColor  上升线的颜色
         * @param uCityColor  建筑模型的颜色
         * @param z      模型点位的高度值z
         */

        const shader = new THREE.ShaderMaterial({
            uniforms: {
                height: height,
                uFlowColor: {
                    value: new THREE.Color('red')
                },
                uCityColor: {
                    value: new THREE.Color('#1B3045')
                }
            },
            vertexShader: `
                    varying vec3 vPosition;
                    void main()
                    {
                      vPosition = position;
                      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                    }`,
            fragmentShader: `
            //求距离的公式，平方和开根号
            float distanceTo(vec2 src,vec2 dst)
            {
             float dx=src.x-dst.x;
             float dy=src.y-dst.y;
             float dv=dx*dx+dy*dy;
             return sqrt(dv);
            }
            varying vec3 vPosition;
            uniform float height;
            uniform vec3 uFlowColor;
            uniform vec3 uCityColor;
            void main()
            {
             // 模型的基础颜色
             vec3 distColor=uCityColor;
             //定位当前点位位置
             vec2 position2D=vec2(vPosition.x,vPosition.y);
             //求点到原点的距离
             float Len=distanceTo(position2D,vec2(0,0));
             if(Len>height*30.0&&Len<(height*30.0+130.0)){
                 // 颜色渐变
                 float dIndex = sin((Len - height*30.0) / 130.0 * 3.14);
                 //通过上面的渐变值进行颜色混合
                 distColor= mix(uFlowColor, distColor, 1.0-dIndex);
             }
             //最终颜色
             gl_FragColor=vec4(distColor,1.0);
             }`,
            transparent: true
        })

        const city = new THREE.Mesh(object.geometry, shader)
        city.position.set(
            object.position.x,
            object.position.y,
            object.position.z
        )
        city.rotateX(-Math.PI / 2)
        scene.add(city)
    }

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
}
