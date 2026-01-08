const dynamicText = '张三';
const greeting = `你好，${dynamicText}`;
const message = '欢迎' + '来到我的世界';

const obj = {
    title: '标题内容',
    desc: `这是${'描述'}内容`
};

function showAlert() {
    alert('警告' + '信息');
    console.log(`用户名：${'当前用户'}`);
}

const template = `
    <div>模板内容</div>
`;
