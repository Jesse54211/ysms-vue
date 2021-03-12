<template>
  <div>
    <el-row >
      <el-col :span="12" >
        <h3 style="color: #00b7ee">实验室101</h3>
        <video autoplay controls width="420px" height="250px" id="videoElement"></video>
      </el-col>
      <el-col :span="12">
        <h3 style="color: #00b7ee">实验室102</h3>
        <video autoplay controls width="420px" height="250px" id="videoElement2"></video>
      </el-col>
    </el-row>

    <el-row style="padding-top: 20px">
      <el-col :span="12">
        <h3 style="color: #00b7ee">实验室103</h3>
        <video autoplay controls width="420px" height="250px" id="videoElement3"></video>
      </el-col>
      <el-col :span="12">
        <h3 style="color: #00b7ee">实验室104</h3>
        <video autoplay controls width="420px" height="250px" id="videoElement4"></video>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import flvjs from 'flv.js'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  mounted() {
    this.$nextTick(() => {
      this.createVideo()
    })
  },
  methods: {
    createVideo() {
      if (flvjs.isSupported()) {
        var videoElement = document.getElementById('videoElement');
        var flvPlayer = flvjs.createPlayer({
          type: 'flv',
          url: 'http://47.100.224.112:9999/live/pc.flv' //你的url地址
        });
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load();
        flvPlayer.play();
        var videoElement2 = document.getElementById('videoElement2');
        var flvPlayer2 = flvjs.createPlayer({
          type: 'flv',
          url: 'http://47.100.224.112:9999/live/pc.flv' //你的url地址
        });
        flvPlayer2.attachMediaElement(videoElement2);
        flvPlayer2.load();
        flvPlayer2.play();
      }
    }
  }
}
</script>
