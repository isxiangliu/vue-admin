/**
 * 显示ECharts加载动画效果
 * @param chart echarts实例
 */
export function showChartLoading(chart) {
    if (!chart) {
        return
    }

    chart.showLoading({
        text: '',
        lineWidth: 2, // 旋转动画（spinner）的线宽
        spinnerRadius: 16, // 旋转动画（spinner）的半径
        maskColor: 'rgba(255,255,255,0)'
    })
}

/**
 * 隐藏ECharts动画加载效果
 * @param chart echarts实例
 */
export function hiddenChartLoading(chart) {
    if (!chart) {
        return
    }
    chart.hideLoading()
}

/**
 * 下载blob类型的数据
 * @param blob
 * @param fileName 文件名
 */
export const blobDownload = (blob, fileName, type) => {
    blob = new Blob([blob], { type: type })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

/**
 * 下载文件
 * @param base64Str base64
 * @param fileName 文件名
 */
export function downloadFile(base64Str, fileName) {
    const blob = dataURLtoBlob(base64Str)
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
}

/**
* base64转blob
* @param base64Str
* @return {Blob}
*/
export function dataURLtoBlob(base64Str) {
    var arr = base64Str.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], {
        type: mime
    })
}

/**
 * 生成uuid
 */
export const generateUUID = () => {
    let d = new Date().getTime()
    if (window.performance && typeof window.performance.now === 'function') {
        d += performance.now() // use high-precision timer if available
    }
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
    return uuid
}

// 序列化反序列化法
export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj))
}

/**
 * 超过自定义高度 分页向上滚动
 * @param {number} to
 * @param {number} duration
 * @param {Function} callback
 */
Math.easeInOutQuad = function(t, b, c, d) {
    t /= d / 2
    if (t < 1) {
        return c / 2 * t * t + b
    }
    t--
    return -c / 2 * (t * (t - 2) - 1) + b
}
var requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) { window.setTimeout(callback, 1000 / 60) }
})()
function move(amount) {
    document.documentElement.scrollTop = amount
    document.body.parentNode.scrollTop = amount
    document.body.scrollTop = amount
}
function position() {
    return document.documentElement.scrollTop || document.body.parentNode.scrollTop || document.body.scrollTop
}
export function scrollTo(to, duration, callback) {
    const start = position()
    const change = to - start
    const increment = 20
    let currentTime = 0
    duration = (typeof (duration) === 'undefined') ? 500 : duration
    var animateScroll = function() {
        // increment the time
        currentTime += increment
        // find the value with the quadratic in-out easing function
        var val = Math.easeInOutQuad(currentTime, start, change, duration)
        // move the document.body
        move(val)
        // do the animation unless its over
        if (currentTime < duration) {
            requestAnimFrame(animateScroll)
        } else {
            if (callback && typeof (callback) === 'function') {
                // the animation is done so lets callback
                callback()
            }
        }
    }
    animateScroll()
}

/**
 * 水印图
 * @param options：{
 * @param width        // 宽度
 * @param height       // 高度
 * @param content      // 水印内容
 * @param font         // 水印字体
 * @param color        // 水印颜色
 * @param rotateDegree // 偏转角度（deg）
 * @param x            // X轴偏移量
 * @param y            // Y轴偏移量
 * }
 */
function createImgBase(options) {
    const canvas = document.createElement('canvas')
    const text = options.content
    // 因为要实现文字交错效果，所以这里生成两倍宽度的图片
    canvas.width = options.width * 2
    canvas.height = options.height
    const ctx = canvas.getContext('2d')
    if (ctx) {
        // X轴阴影距离，负值表示往上，正值表示往下
        ctx.shadowOffsetX = 2
        // Y轴阴影距离，负值表示往左，正值表示往右
        ctx.shadowOffsetY = 2
        // 阴影的模糊程度
        ctx.shadowBlur = 2
        ctx.font = options.font
        ctx.fillStyle = options.color
        ctx.rotate(options.rotateDegree)
        ctx.textAlign = 'left'
        ctx.fillText(text, options.x, options.y)
    }
    return canvas.toDataURL('image/png')
}

export function genWaterMark({
    className = 'watermarked',
    width = 340,
    height = 240,
    content = '水印',
    font = '14px PingFang SC, sans-serif',
    color = 'rgba(156, 162, 169, 0.4)',
    rotate = -14,
    position = 'absolute',
    top = 0,
    left = 0,
    zIndex = 998
}) {
    const option = {
        width,
        height,
        content,
        font,
        color,
        rotateDegree: (rotate * Math.PI) / 180
    }

    // 为了实现交错水印的效果，此处生成两张位置不同的水印 固定相对位置
    const dataUri1 = createImgBase({
        ...option,
        x: 100,
        y: 140
    })
    const dataUri2 = createImgBase({
        ...option,
        x: 400,
        y: 340
    })

    let defaultStyle = document.createElement('style')
    defaultStyle.innerHTML = `.${className}:after {
content: '';
display: block;
width: 100%;
height: 100%;
${top || top === 0 ? `top: ${top}px;` : ''}
${left || left === 0 ? `left: ${left}px;` : ''}
background-repeat: repeat;
pointer-events: none;
}`

    let styleEl = document.createElement('style')
    styleEl.innerHTML = `.${className}:after
{
${position ? `position: ${position}` : ''};
${zIndex ? `z-index:${zIndex}` : ''};
background-image: url(${dataUri1}), url(${dataUri2});
background-size: ${option.width * 2}px ${option.height}px;
}`
    document.head.appendChild(defaultStyle)
    document.head.appendChild(styleEl)
}