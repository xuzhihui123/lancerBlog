## 1、代码

```js
<template>
  <div class="wrapper">
    <canvas ref="canvasRef" class="canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "un-login"
})

let canvasRef = ref()

interface IPos {
  x: number
  y: number
}

class MapCanvas {
  private canvasRef: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private img: HTMLImageElement
  private startPos: IPos = { x: 0, y: 0 } // 开始坐标
  private touchs: TouchList // 存储多手指位置
  private movePos: IPos // 存储移动坐标位置
  private imgX = 0 // 图片初始化X轴位置
  private imgY = 0 // 图片初始化Y轴位置
  private isMove = false // 是否移动
  private imgScale = 0.5 // 图片缩放比例
  private MINIMUM_SCALE = 0.2 // 最小缩放
  private MAX_SCALE = 5 // 最大缩放
  constructor(canvas: HTMLCanvasElement) {
    this.canvasRef = canvas
    const { width, height } = this.canvasRef.getBoundingClientRect()
    this.canvasRef.width = width
    this.canvasRef.height = height
    this.ctx = canvas.getContext("2d")
    this.initCavas()
  }

  /**
   * 初始化
   * @memberof MapCanvas
   */
  async initCavas() {
    await this.loadImage("https://t7.baidu.com/it/u=4162611394,4275913936&fm=193&f=GIF")
    this.imgX = this.canvasRef.width / 2 - (this.img.width * this.imgScale) / 2
    this.drawImage()
    // PC端事件监听
    this.canvasRef.addEventListener("mousedown", this.startMouse.bind(this))
    this.canvasRef.addEventListener("mousemove", this.moveMouse.bind(this))
    this.canvasRef.addEventListener("mouseup", this.endMouse.bind(this))
    this.canvasRef.addEventListener("mousewheel", this.mouseWheel.bind(this)) // 监听滚轮
    this.canvasRef.addEventListener("wheel", this.mouseWheel.bind(this)) // 监听滚轮
    // 移动端事件监听
    this.canvasRef.addEventListener("touchstart", this.startTouch.bind(this))
    this.canvasRef.addEventListener("touchmove", this.moveTouch.bind(this))
    this.canvasRef.addEventListener("touchend", this.endMouse.bind(this))
  }

  /**
   * 图片加载
   * @private
   * @param {string} url
   * @returns
   * @memberof MapCanvas
   */
  private loadImage(url: string) {
    return new Promise((reject, resolve) => {
      this.img = new Image()
      this.img.crossOrigin = "Anonymous"
      this.img.onload = function () {
        reject("")
      }
      this.img.onerror = function (error) {
        console.error(error, "error=====")
        resolve(error)
      }
      this.img.src = url
    })
  }

  /**
   * 绘制图片
   * @private
   * @memberof MapCanvas
   */
  private drawImage() {
    // 清除上一帧绘制
    this.ctx.clearRect(0, 0, this.canvasRef.width, this.canvasRef.height)
    // 绘制图片
    this.ctx.drawImage(
      this.img,
      0,
      0,
      this.img.width,
      this.img.height,
      this.imgX,
      this.imgY,
      this.img.width * this.imgScale,
      this.img.height * this.imgScale
    )
  }

  /**
   * 开始拖拽
   * @private
   * @param {(React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>)} e
   * @memberof MapCanvas
   */
  private startMouse(e) {
    const { pageX, pageY } = e
    this.isMove = true
    this.startPos = this.windowToCanvas(pageX, pageY)
  }

  /**
   * 开始触摸
   * @private
   * @param {React.TouchEvent<HTMLElement>} e
   * @memberof MapCanvas
   */
  private startTouch(e) {
    const { touches } = e
    this.isMove = true
    // 判断是否为多手指
    if (touches.length < 2) {
      const { clientX, clientY } = touches[0]
      this.startPos = this.windowToCanvas(clientX, clientY) // clientX：触摸点相对浏览器窗口的位置
    } else {
      this.touchs = touches
    }
  }

  /**
   * 拖拽移动
   * @private
   * @param {(React.MouseEvent<HTMLElement> } e
   * @memberof MapCanvas
   */
  private moveMouse(e) {
    if (!this.isMove) return false
    const { pageX, pageY } = e
    this.movePos = this.windowToCanvas(pageX, pageY)
    const x = this.movePos.x - this.startPos.x,
      y = this.movePos.y - this.startPos.y
    this.imgX += x
    this.imgY += y
    this.startPos = { ...this.movePos } // 更新最新位置
    this.drawImage()
  }

  /**
   * 移动端拖动缩放
   * @private
   * @param {React.TouchEvent<HTMLElement>} e
   * @memberof MapCanvas
   */
  private moveTouch(e) {
    if (!this.isMove || !e.touches) return false
    const { clientX, clientY } = e.touches[0]
    // 如果是单指
    if (e.touches.length < 2) {
      this.movePos = this.windowToCanvas(clientX, clientY)
      const x = this.movePos.x - this.startPos.x,
        y = this.movePos.y - this.startPos.y
      this.imgX += x
      this.imgY += y
      this.startPos = { ...this.movePos } // 更新最新位置
    } else {
      const now = e.touches
      // 处理位置
      const pos = this.windowToCanvas(clientX, clientY)
      const newPos = {
        x: Number(((pos.x - this.imgX) / this.imgScale).toFixed(2)),
        y: Number(((pos.y - this.imgY) / this.imgScale).toFixed(2))
      }
      const curPos = this.getDistance(now[0], now[1]) // 当前位置
      const startPos = this.getDistance(this.touchs[0], this.touchs[1]) // 前一个位置
      // 判断位置是放大还是缩小
      if (curPos > startPos) {
        // 放大
        this.imgScale += 0.03
        if (this.imgScale >= this.MAX_SCALE) {
          this.imgScale = this.MAX_SCALE
        }
      } else {
        this.imgScale -= 0.03
        if (this.imgScale <= this.MINIMUM_SCALE) {
          this.imgScale = this.MINIMUM_SCALE
        }
      }
      // 计算图片的位置， 更具当前缩放比例，计算新的位置
      this.imgX = (1 - this.imgScale) * newPos.x + (pos.x - newPos.x)
      this.imgY = (1 - this.imgScale) * newPos.y + (pos.y - newPos.y)
      this.touchs = now
    }
    this.drawImage()
  }

  /**
   * 拖拽结束
   * @private
   * @param {(React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>)} e
   * @memberof MapCanvas
   */
  private endMouse(e) {
    this.isMove = false
  }

  /**
   * 监听滚轮
   * @private
   * @param {(React.WheelEvent<HTMLElement> & { wheelDelta: number })} e
   * @memberof MapCanvas
   */
  private mouseWheel(e) {
    const { clientX, clientY, wheelDelta } = e
    const pos = this.windowToCanvas(clientX, clientY)
    // 计算图片的位置
    const newPos = {
      x: Number(((pos.x - this.imgX) / this.imgScale).toFixed(2)),
      y: Number(((pos.y - this.imgY) / this.imgScale).toFixed(2))
    }
    // 判断是放大还是缩小
    if (wheelDelta > 0) {
      // 放大
      this.imgScale += 0.05
      if (this.imgScale >= this.MAX_SCALE) {
        this.imgScale = this.MAX_SCALE
      }
    } else {
      // 缩小
      this.imgScale -= 0.05
      if (this.imgScale <= this.MINIMUM_SCALE) {
        this.imgScale = this.MINIMUM_SCALE
      }
    }
    // 计算图片的位置， 根据当前缩放比例，计算新的位置
    this.imgX = (1 - this.imgScale) * newPos.x + (pos.x - newPos.x)
    this.imgY = (1 - this.imgScale) * newPos.y + (pos.y - newPos.y)
    this.drawImage() // 开始绘制图片
  }

  /**
   * 处理鼠标的位置
   * @private
   * @param {number} startX
   * @param {number} startY
   * @returns {IPos}
   * @memberof MapCanvas
   */
  private windowToCanvas(startX: number, startY: number): IPos {
    const { left, top, width, height } = this.canvasRef.getBoundingClientRect()
    return {
      x: startX - left - (width - this.canvasRef.width) / 2,
      y: startY - top - (height - this.canvasRef.height) / 2
    }
  }

  /**
   * 勾股定理，求两点间的直线距离
   * @private
   * @param {React.Touch} p1
   * @param {React.Touch} p2
   * @returns {number}
   * @memberof MapCanvas
   */
  private getDistance(p1, p2): number {
    const x = p2.pageX - p1.pageX
    const y = p2.pageY - p1.pageY
    return Math.sqrt(x * x + y * y)
  }
}

onMounted(() => {
  new MapCanvas(canvasRef.value)
})
</script>

<style scoped lang="scss">
.wrapper {
  .canvas {
    width: 100%;
    height: 100vh;
    background-color: #000;
  }
}
</style>

```

