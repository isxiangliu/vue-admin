<template>
    <div>
        <div class="bg-banner" />
        <div id="login-box">
            <el-form ref="form" :model="form" :rules="rules" class="login-form" auto-complete="on" label-position="left">
                <div class="title-container">
                    <h3 class="title">{{ title }}管理后台</h3>
                </div>
                <div>
                    <el-form-item prop="account">
                        <el-input ref="name" v-model="form.account" placeholder="用户名" type="text" tabindex="1" auto-complete="on">
                            <svg-icon slot="prefix" name="user" />
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input
                            ref="password"
                            v-model="form.password"
                            :type="passwordType"
                            placeholder="密码"
                            tabindex="2"
                            auto-complete="on"
                        >
                            <svg-icon slot="prefix" name="password" />
                            <svg-icon slot="suffix" :name="passwordType === 'password' ? 'eye' : 'eye-open'" @click="showPassword" />
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="code">
                        <div class="image-code-box">
                            <el-input v-model.trim="form.code" placeholder="验证码" @keyup.enter.native="handleLogin" />
                            <VerifyCode ref="verifyCode" class="image-code" />
                        </div>
                    </el-form-item>
                </div>
                <el-checkbox v-model="form.remember">记住我</el-checkbox>
                <el-button :loading="loading" type="primary" style="width: 100%;" @click.native.prevent="handleLogin">登 录</el-button>
                <div style="margin-top: 20px; margin-bottom: -10px; color: #666; font-size: 14px; text-align: center; font-weight: bold;">
                    <span style="margin-right: 5px;">演示帐号一键登录：</span>
                    <el-button type="danger" size="mini" @click="testAccount('admin')">admin</el-button>
                </div>
            </el-form>
        </div>
        <Copyright v-if="$store.state.settings.showCopyright" />
    </div>
</template>

<script>
import CryptoJS from 'crypto-js'
export default {
    name: 'Login',
    data() {
        return {
            title: process.env.VUE_APP_TITLE,
            form: {
                account: localStorage.login_account || '',
                password: '',
                remember: !!localStorage.login_account
                // code: '',
            },
            rules: {
                account: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
                password: [
                    { required: true, trigger: 'blur', message: '请输入密码' },
                    { min: 6, max: 18, trigger: 'blur', message: '密码长度为6到18位' }
                ],
                code: [{ required: true, trigger: 'blur', message: '请输入验证码' }]
            },
            loading: false,
            passwordType: 'password',
            redirect: undefined
        }
    },
    watch: {
        $route: {
            handler: function(route) {
                this.redirect = route.query && route.query.redirect
            },
            immediate: true
        }
    },
    methods: {
        showPassword() {
            this.passwordType = this.passwordType === 'password' ? '' : 'password'
            this.$nextTick(() => {
                this.$refs.password.focus()
            })
        },
        handleLogin() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.loading = true
                    if (this.$refs.verifyCode && this.form.code === this.$refs.verifyCode.identifyCode) {
                        this.$store
                            .dispatch('user/login', {
                                username: this.form.account,
                                password: this.encrypt(this.form.account, this.form.password)
                            })
                            .then(res => {
                                this.loading = false
                                this.form.remember && localStorage.setItem('login_account', this.form.account)
                                this.$router.push({ path: this.redirect || '/' })
                            })
                            .catch(error => {
                                this.$refs.verifyCode.reFlashCode()
                                this.loading = false
                            })
                    } else {
                        this.$message.error('验证码错误，请重新输入！')
                        this.$refs.verifyCode.reFlashCode()
                        this.loading = false
                    }
                } else {
                    return false
                }
            })
        },
        testAccount(account) {
            this.form.account = account
            this.form.password = '123456'
            this.handleLogin()
        },
        /**
     * 密码加密
     * @param key 用户名
     * @param str 密码
     * @returns {string}
     */
        encrypt(key, str) {
            // 使用用户名进行MD5，32位，作为key
            let key_str = CryptoJS.MD5(key).toString().substring(8, 24)
            key = CryptoJS.enc.Utf8.parse(key_str)
            let iv = key
            // 对password进行AES加密
            let AESPass = CryptoJS.AES.encrypt(str, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC, // 补齐方式 CBC,ECB,etc.
                padding: CryptoJS.pad.ZeroPadding // 偏移规则设定  pack5，pkcs7，nopadding,etc.
            })
            // CryptoJS 的 encrypt函数不会直接返回字符串，需要toString或者Crypto-JS进行转码才能得到真实的结果。
            let pass = AESPass.toString()
            return pass
        }
    }
}
</script>

<style lang="scss" scoped>
[data-mode='mobile'] {
    #login-box {
        max-width: 80%;
    }
}
::v-deep input[type='password']::-ms-reveal {
    display: none;
}
.bg-banner {
    position: absolute;
    z-index: 0;
    width: 100%;
    height: 100%;
    // background-image: url(../assets/images/login-bg.jpg);
    background-image: url(../assets/images/home-bg.png);
    background-size: cover;
    background-position: center center;
}
#login-box {
    display: flex;
    justify-content: space-between;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    background: rgba(255, 255, 255, 0.8);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 5px #999;
    .login-form {
        width: 450px;
        padding: 50px 35px 30px;
        overflow: hidden;
        .svg-icon {
            vertical-align: -0.35em;
        }
        .title-container {
            position: relative;
            .title {
                font-size: 22px;
                color: #666;
                margin: 0 auto 30px;
                text-align: center;
                font-weight: bold;
                @include text-overflow;
            }
        }
        .image-code-box {
            display: flex;
            flex-direction: row;
            align-items: center;
        }
    }
    ::v-deep .el-input {
        display: inline-block;
        height: 48px;
        width: 100%;
        input {
            height: 48px;
        }
        .el-input__prefix {
            left: 10px;
        }
        .el-input__suffix {
            right: 10px;
        }
    }
    .el-checkbox {
        margin: 20px 0;
    }
}
.copyright {
    position: absolute;
    bottom: 30px;
    width: 100%;
    margin: 0;
    mix-blend-mode: difference;
}
</style>
