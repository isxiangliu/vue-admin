//手机号验证{validateFunction:validateMobile}
export function validateMobile(rule, value, callback) {
	const mobile =/^1[2-9]([0-9]{9}$)|^0[0-9]{2,3}-?[0-9]{8}$/;
	if (!mobile.test(value)) {
		callback('请输入正确的手机号！');
	}
	return true
}

//邮箱验证{format: 'email',errorMessage: '请输入正确的邮箱地址'}
export function validateEmail(rule, value, callback) {
	const email = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
	if (!email.test(value)) {
		callback('请输入正确的邮箱地址！');
	}
	return true
}

//表单验证填写 (必须为数字){validateFunction:validateNumber}
export function validateNumber(rule, value, callback) {
	const regNu = /^[0-9]*$/;
	if (!regNu.test(value)) {
		callback('请输入纯数字！');
	}
	return true
};

//长度验证{minLength:3,maxLength:14,errorMessage:'长度为3~14位'}
export function validateLength(rule, value, callback) {
	if (value.length < 3 || value.length >= 14) {
		callback('长度为3位 ~ 14位！');
	}
	return true
};

//邮政编码
export function validatePostalCode(rule, value, callback) {
	const regNu = /[1-9]\d{5}(?!\d)/;
	if (!regNu.test(value)) {
		callback('邮政编码错误！');
	}
	return true
};

//身份证号码
export function validateIdentitycard(rule, value, callback) {
	const regNu = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
	if (!regNu.test(value)) {
		callback('身份证号码错误！');
	}
	return true
};
