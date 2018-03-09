layui.use(['element','form','apis','laydate','laypage','layer','upload'], function() {
    var element = layui.element;
    var form = layui.form;
    var api = layui.apis;
    var laydate = layui.laydate;
    var layer = layui.layer;
    var upload = layui.upload;
    var user=JSON.parse(window.localStorage['users']);
    // console.log(user)
    if(user==undefined){
        layer.msg('未登录')
        window.location.href='../page/index.html';
    }
    else {
        $('.login_2,.login_1').removeAttr('href')
        $('.login_1 span').text(user.username)
        $('.login_2 span').text('退出登录')
    }
})