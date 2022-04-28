## VistualList.vue

- 这个可以当作通用的虚拟wrapper 
- visibleData 是当前视图的数据 数据结构可以自定义
- props的传过来的data为所有数据
- props的replaceFields 可自行删除
- 需要在本组件外层设置固定高度或者传入viewportHeight设置固定高

```vue
<template>
  <div ref="virtualList" class="virtual-list">
    <div ref="viewportRef" @scroll="handleScroll" :style="containerStyle" class="virtual-container">
      <div :style="totalHeightStyle">
        <div :style="scrolleTopStyle">
          <div v-for="item in visibleData" :key="item[key]">
            <slot :item="item" name="renderContext">
              {{ item[label] }}
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VirtualList',
  props: {
    // 数据
    data: {
      type: Array,
      default: () => ([])
    },
    // 替换 treeNode 中 label,key,children 字段为 data 中对应的字段
    replaceFields: {
      type: Object,
      default: () => ({
        key: 'key',
        label: 'label'
      })
    },
    // 每行的高度
    itemHeight: {
      type: Number,
      default: 32
    },
    // 显示区域的高度
    viewportHeight: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      startOffset: 0, // 偏移量
      scrollTop: 0, // 滚动的长度
      // 截取数据的范围
      rangeState: {
        startIndex: 0,
        endIndex: 0
      },
      // 可视区域的高度
      viewHeight: 190,
      totalHeight: 0 // 总高度
    }
  },
  computed: {
    containerStyle () {
      return {
        overflowY: 'auto',
        overflowAnchor: 'none',
        maxHeight: `${this.viewHeight}px`
      }
    },
    totalHeightStyle () {
      return {
        height: `${this.totalHeight}px`,
        position: 'relative',
        overflow: 'hidden',
        zIndex: 0
      }
    },
    scrolleTopStyle () {
      return {
        display: 'flex',
        flexDirection: 'column',
        transform: `translateY(${this.startOffset}px)`,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0
      }
    },
    key () {
      return this.replaceFields.key
    },
    label () {
      return this.replaceFields.label
    },
    // 是否开启虚拟滚动
    isVirtual () {
      return this.totalHeight > this.viewHeight
    },
    // 截取数据
    visibleData () {
      return this.totalList.slice(this.rangeState.startIndex, Math.min(this.rangeState.endIndex + 1, this.totalList.length))
    },
    // 总行数
    visibleCount () {
      return Math.ceil(this.viewHeight / this.itemHeight)
    },
    // 记录滚动列表的 paddingTop 用于校正滚动距离
    scrollListPadding () {
      const viewportRef = this.$refs.viewportRef
      const getPadding = property => window.getComputedStyle(viewportRef)[property].replace(/\D/g, '')
      return {
        top: Number(getPadding('paddingTop')),
        bottom: Number(getPadding('paddingBottom'))
      }
    }
  },
  watch: {
    viewportHeight () {
      this.setViewportHeight()
    },
    data (_new, _old) {
      this.setData()
      if (_old.length === 0) {
        this.updateRangeState()
      } else if (_new.length < this.visibleCount) {
        this.init()
      } else if (_new.length !== _old.length) {
        this.$nextTick(() => {
          const newStartOffset = this.startOffset
          this.rangeState = {
            ...this.rangeState
          }
          this.$nextTick(() => {
            this.startOffset = newStartOffset
          })
        })
      }
    },
    itemHeight () {
      this.setTotalHeight()
      this.updateRangeState()
    },
    visibleCount () {
      this.updateRangeState()
    },
    scrollTop () {
      this.updateRangeState()
    },
    rangeState () {
      this.updateScrollOffset()
    }
  },
  created () {
    this.setData()
  },
  mounted () {
    this.setViewportHeight()
    this.init()
  },
  methods: {
    setViewportHeight () {
      if (this.viewportHeight === 0) {
        const height = this.$refs.virtualList.parentElement.clientHeight
        this.viewHeight = height === 0 ? this.viewHeight : height
      } else {
        this.viewHeight = this.viewportHeight
      }
    },
    setTotalHeight () {
      this.totalHeight = this.totalList.length * this.itemHeight
    },
    setData () {
      this.totalList = this.data
      this.setTotalHeight()
    },
    init () {
      this.startOffset = 0
      this.rangeState = {
        itemIndex: 0,
        itemOffsetPtg: 0,
        startIndex: 0,
        endIndex: this.visibleCount
      }
    },
    handleScroll () {
      const viewportRef = this.$refs.viewportRef
      if (!viewportRef) {
        return
      }
      const { scrollTop: rawScrollTop, clientHeight, scrollHeight } = viewportRef
      // 限制滚动的长度，滚动距离 大于 最大的滚动长度，则取最大的
      this.scrollTop = this.getValidScrollTop(rawScrollTop, scrollHeight - clientHeight)
      this.$emit('scroll')
    },
    // 开始和结束元素变化后需要更新偏移
    updateScrollOffset () {
      const viewportRef = this.$refs.viewportRef
      if (!viewportRef || !this.isVirtual) {
        return
      }
      const { scrollTop, clientHeight, scrollHeight } = viewportRef
      // 获取 滚动条比例
      const scrollPtg = this.getScrollPercentage({ scrollTop, clientHeight, scrollHeight })

      const scrollListPadding = this.scrollListPadding

      let newStartOffset = this.getItemAbsoluteTop({
        scrollTop: scrollTop - (scrollListPadding.top + scrollListPadding.bottom) * scrollPtg,
        scrollPtg,
        clientHeight,
        itemHeight: this.itemHeight,
        itemOffsetPtg: this.rangeState.itemOffsetPtg
      })
      for (let index = this.rangeState.itemIndex - 1; index >= this.rangeState.startIndex; index--) {
        newStartOffset -= this.itemHeight
      }
      this.startOffset = newStartOffset
    },
    // 重新计算 截取的数据范围
    updateRangeState () {
      const viewportRef = this.$refs.viewportRef
      // 总数量
      const itemCount = this.totalList.length
      // 可视区域显示的数量
      const visibleCount = this.visibleCount
      if (!viewportRef) {
        return
      }
      const { scrollTop: rawScrollTop, clientHeight, scrollHeight } = viewportRef
      // 获取滚动出去的比例
      const scrollPtg = this.getScrollPercentage({
        scrollTop: rawScrollTop,
        clientHeight,
        scrollHeight
      })
      const { itemIndex, itemOffsetPtg, startIndex, endIndex } = this.getRangeIndex(
        scrollPtg,
        itemCount,
        visibleCount
      )
      this.rangeState = {
        itemIndex: Math.min(itemCount - 1, itemIndex),
        itemOffsetPtg,
        startIndex,
        endIndex
      }
    },
    getRangeIndex (scrollPtg, itemCount, visibleCount) {
      const { index, offsetPtg } = this.getLocationItem(scrollPtg, itemCount)
      const beforeCount = Math.ceil(scrollPtg * visibleCount)
      const afterCount = Math.ceil((1 - scrollPtg) * visibleCount)
      const startIndex = Math.max(0, index - beforeCount) // 不超出最小值
      let endIndex = Math.min(itemCount - 1, index + afterCount) // 不超出最大的数量
      if (startIndex === 0) {
        endIndex = this.visibleCount
      }
      return {
        itemIndex: index,
        itemOffsetPtg: offsetPtg,
        startIndex,
        endIndex
      }
    },
    // 滚动出去的比例
    getScrollPercentage ({ scrollTop, scrollHeight, clientHeight }) {
      const scrollLength = scrollHeight - clientHeight
      const value = this.getValidScrollTop(scrollTop, scrollLength)
      return value === 0 ? 0 : value / scrollLength
    },
    getValidScrollTop (scrollTop, scrollRange) {
      return scrollTop < 0 ? 0 : scrollTop > scrollRange ? scrollRange : scrollTop
    },
    getLocationItem (scrollPtg, itemCount) {
      // 第一个数据的位置
      const itemIndex = Math.floor(scrollPtg * itemCount)
      // 第一个数据在滚动条中的比例，就是已经滚动的比例
      const itemTopPtg = itemIndex / itemCount
      // 第一个元素的偏移量，就是说第一个元素滚动超出可视区域的比例
      const offsetPtg = (scrollPtg - itemTopPtg) / (1 / itemCount)
      return {
        index: itemIndex,
        offsetPtg: Number.isNaN(offsetPtg) ? 0 : offsetPtg
      }
    },
    // 计算元素相对于整个滚动区域顶部的偏移量
    getItemAbsoluteTop ({ scrollTop, ...rest }) {
      return scrollTop + this.getItemRelativeTop(rest)
    },
    // 计算元素相对于视口顶部的偏移量
    getItemRelativeTop ({ itemHeight, itemOffsetPtg, scrollPtg, clientHeight }) {
      if (scrollPtg === 1) {
        return clientHeight - itemHeight
      }
      return Math.floor(clientHeight * scrollPtg - itemHeight * itemOffsetPtg)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

```

