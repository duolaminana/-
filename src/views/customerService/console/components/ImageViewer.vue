<script>
export default {
  data() {
    return {
      position: {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      }
    };
  },
  props: {
    visible: { type: Boolean, default: false },
    image: {
      type: Object,
      default: function() {
        return {
          format: "",
          fsize: 0,
          height: 0,
          width: 0,
          loading: true,
          media_id: "",
          media_url: "",
          media_crc32: 0
        };
      }
    }
  },
  methods: {
    hide() {
      this.$emit("update:visible", false);
    },
    initImgviewer() {
      const activeWidth = this.image.width;
      const activeHeight = this.image.height;
      const offsetWidth = this.$refs.viewerWrap.offsetWidth;
      const offsetHeight = this.$refs.viewerWrap.offsetHeight;
      if (
        activeWidth / offsetWidth > activeHeight / offsetHeight &&
        activeWidth > offsetWidth * 0.75
      ) {
        this.position.width = offsetWidth * 0.75;
        this.position.height =
          (offsetWidth / activeWidth) * 0.75 * activeHeight;
      } else if (
        activeWidth / offsetWidth < activeHeight / offsetHeight &&
        activeHeight > offsetHeight * 0.75
      ) {
        this.position.height = offsetHeight * 0.75;
        this.position.width =
          (offsetHeight / activeHeight) * 0.75 * activeWidth;
      } else {
        this.position.height = activeHeight;
        this.position.width = activeWidth;
      }
      this.position.left = (offsetWidth - this.position.width) / 2;
      this.position.top = (offsetHeight - this.position.height) / 2;
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          this.initImgviewer();
        });
      }
    }
  }
};
</script>

<template>
  <div v-show="visible" ref="viewerWrap" @click.self="hide" class="image-viewer-container">
    <img
      :src="fullUrl(image.media_url)"
      alt
      :style="{
          'transform': 'translate(' + (position.left+100) + 'px,' + (position.top ) + 'px)',
     '-webkit-transform': 'translate(' + (position.left+100) + 'px,' + (position.top) + 'px)',
     'width': position.width + 'px',
     'height': position.height + 'px'}"
    >
  </div>
</template>

<style lang="scss" scoped>
.image-viewer-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
}
</style>
