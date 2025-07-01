<script setup></script>

<template>
  <div id="App">
    <el-container>
      <router-view></router-view>
      <el-footer class="footer-beian">
        <el-row justify="center" align="middle">
          <el-col :xs="24" :sm="24" :md="12" :lg="8">
            <span class="beian-text">
              <a href="http://beian.miit.gov.cn/" style="color: #b0b3b8; text-decoration: none">
                备案号： 粤ICP备2025434826号
              </a>
            </span>
          </el-col>
        </el-row>
      </el-footer>
    </el-container>
  </div>
</template>

<style>
:root body {
  height: 100vh;
  background: #ffffff;
}
.content-container {
  display: inline-block;
  padding: 20px;
  margin: 20px;
  min-width: 1200px;
  width: 97%;
  border-radius: 10px;
  background: white;
}
.input-tip {
  margin: 0 10px;
  line-height: 40px;
}
.input-field {
  margin-right: 40px;
}
.content-row {
  margin-bottom: 20px;
}
.footer-beian {
  text-align: center;
  padding: 20px 0;
  background-color: #23272f; /* 深灰黑色背景 */
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
}

.beian-text {
  color: #b0b3b8; /* 浅灰色文字 */
  font-size: 16px;
  letter-spacing: 1px;
}

@media (max-width: 600px) {
  .footer-beian {
    padding: 12px 0;
  }
  .beian-text {
    font-size: 14px;
  }
}
</style>
