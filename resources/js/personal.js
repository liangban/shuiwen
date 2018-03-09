//注意：导航 依赖 element 模块，否则无法进行功能性操作
var url='http://www.tomylee.top'
layui.use(['element','form','apis','laydate','laypage','layer','upload'], function() {
    var element = layui.element;
    var form = layui.form;
    var api = layui.apis;
    var laydate = layui.laydate;
    var layer = layui.layer;
    var upload = layui.upload;
// console.log(api).
    var msg;
    var userid=1;
    $('.load_btn button').on('click', function () {
        console.log(1)
        var n = $(this).index('.load_btn li button')
        console.log(n)
        if (n == 0) {
            window.location.href = '../page/gerenzhongxin.html'
        }
        else if (n == 1) {
            window.location.href = '../page/gerenziliao.html'
        }
        else if (n == 2) {
            window.location.href = '../page/xiazaiqingdan.html'
        }
    })
    $.ajax({
        url: url + '/user',
        xhrFields: {withCredentials: true},
        type: 'get',
        success: function (data) {
            if(data.status==true){
            msg=data;
            userid=data.data.userID
            console.log(userid)

            api.getuser(userid, function (data) {
                console.log(data.data)
                if (data.data.userType == 0) {
                    data.data.userType = '系统用户'
                }
                else if (data.data.userType == 1) {
                    data.data.userType = '注册用户'
                }
                else if (data.data.userType == 2) {
                    data.data.userType = '管理员'
                }
                if (data.data.userStatus == 0) {
                    data.data.userStatus = '未申请';
                    // $('.shenhe').show();
                }
                else if (data.data.userStatus == 1) {
                    data.data.userStatus = '申请中';
                    console.log($('.shenhe').text())
                }
                else if (data.data.userStatus == 2) {
                    data.data.userStatus = '申请成功';
                    // $('.shenhe').hide();
                }
                if(data.data.userProperty==0){
                    console.log(1);
                                      $('.info option:first-child').attr('selected')
                                        $('.com').hide()
                                    }
                                    else {
                                        $('.sec layui-anim dd:last-child').addClass('layui-this')
                                        $('.com').show()
                                        console.log(2);
                                        form.render()
                                    }
                if(data.data.companyName==null){
                    data.data.companyName="";
                }
                var result = '';
                result = '<li><span class="layui-col-md5">登录邮箱</span><span class="layui-col-md5 email">' +
                    data.data.loginName +
                    '</span></li>' +
                    '<li><span class="layui-col-md5">用户名称</span><span class="layui-col-md5 username"><input type="text"' +
                    'name="userName" value="' + data.data.userName + '" readonly></span>' +
                    '</li>' +
                    '<li><span class="layui-col-md5">手机号码</span><span class="layui-col-md5 phone"><input type="text"' +
                    'name="phoneNumber" value="' + data.data.phoneNumber + '"' +
                    'readonly></span></li>' +
                    '<li><span class="layui-col-md5">用户类别</span><span class="layui-col-md5">' + data.data.userType + '</span></li>' +
                    '<li><span class="layui-col-md5">登录密码</span><span class="layui-col-md5"><a href="javascript:void(0)" class="amend">修改密码</a></span>' +
                    '</li>' +
                    '<li class="layui-form-item"><span class="layui-col-md5">类型</span><span class="layui-col-md5 layui-input-block sec">' +
                    '<select name="userProperty" lay-verify="required" value="" lay-filter="formDemos" disabled>' ;
                    // '<option value=""></option>'+
                    if(data.data.userProperty==0){
                         result+='<option value="0" selected>个人</option>' ;
                          result+='<option value="1" >单位</option>' ;
                    }
                   else{
                     result+='<option value="0" >个人</option>' ;
                    result+='<option value="1" selected>单位</option>' ;
                   }
                    
                    result+='</select>' +
                    '</div>' +
                    '</div></span></li>' +
                    '<li class="com"><span class="layui-col-md5 ">公司名称</span><span class="layui-col-md5"><input type="text"' +
                    'name="companyName" value="' + data.data.companyName + '"' +
                    'readonly></span></li>' +
                    '<li><span class="layui-col-md5">账号状态</span><span class="layui-col-md5 zhuangtai">' + data.data.userStatus + ' <a' +
                    ' href="#" class="shenhe">申请审核</a></span></li>'
                // console.log(result)
                $('.information ul').html(result);

                // if(data.data.userProperty==){
                //
                // }
                form.render();
                console.log($('.sec dd').length)
                console.log($('.zhuangtai').text())
                if (data.data.userStatus == '未申请') {
                    console.log(0)
                    $('.shenhe').show()
                }
                else if (data.data.userStatus == '申请中') {
                    console.log(1)
                    $('.shenhe').hide()
                }
                else if (data.data.userStatus == '申请成功') {
                    console.log(2)
                    $('.shenhe').hide()
                }
                $.each($('.sec option'), function (i, v) {
                    if (i == data.data.userProperty) {
                        $(this).attr('selected', 'selected')
                        if (i == 0) {
                            $('.com').hide()
                        }
                        else {
                            $('.com').show()
                        }
                    }
                })

            })
        }
        else {
                console.log(data)
                msg=data;
                $('.history_btn').hide()
                // layer.msg(data.msg)
            }  
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            // layer.msg('网络错误')
        }
    })

form.on('select(formDemos)',function (data) {
    if(data.value==0){
        console.log(data)
        $('.com').hide()

    }else {
        $('.com').show()
    }
})


    form.on('submit(saveuser)',function(data){
        var userName=data.field.userName;
        var phoneNumber=data.field.phoneNumber;
        var userProperty=data.field.userProperty;
        var companyName=data.field.companyName;
        console.log(userName,phoneNumber,userProperty,companyName)
        if(msg.code==200){

        }
        else{
            layer.msg(msg.msg)
        }
        api.xiugaiuser(userid,userName,phoneNumber,userProperty,companyName,function(data){
            console.log(data)
            if(data.status==true){
                layer.msg(data.msg)
            }
            else {
                layer.msg(data.msg)
                layer.msg(data.data[0].msg)
                window.location.reload
            }
        })
    })
    form.on('submit(xiugaipassword)',function(data){
        var oldPassword=data.field.oldPassword;
        var password=data.field.password;
        var confirmPassword=data.field.confirmPassword;
        console.log(data)
        console.log(oldPassword,password,confirmPassword);
        api.xiugaipassword(userid,oldPassword,password,confirmPassword,function(data){
            console.log(data)
            if(data.status==true){
                layer.msg(data.msg)
                $('.layui-layer-close').click();
            }
            else {
                if(data.data==null){
                    layer.msg(data.msg)
                }
                else{
                    layer.msg(data.data[0].msg)
                }
                    window.location.reload
                }
        })
    })
    console.log(1)
    // $(function(){
        $('.units').hide();
        $(document).on('click',".layui-form-radio",function(){
            console.log($(this).children('span').text())
            if($(this).children('span').text()=='单位用户'){
                $('.units').fadeIn();
            }
            else if($(this).children('span').text()=='个人用户'){
                $('.units').fadeOut();
            }
        })
        $('.footer').load('footer.html');
        $('.history .down_doc li button').on('click', function () {
            $(this).parents('.down_doc').next().toggle();
        })
        $('.info_btn,.type_btn').on('click', function () {
            console.log(0)
            if ($(this).attr('data-info') == '0') {
                $(this).attr('data-info', '1')
                $(this).removeAttr("lay-submit")
                $(this).removeAttr("lay-filter")
                $(this).html('<i></i>' + '保存');
                $(this).parents('.info').find('input').removeAttr('readonly')
                $(this).parents('.info').find('select').removeAttr('disabled');
                form.render();
            }
            else {
                $(this).attr('data-info', '0');
                $(this).html('<i></i>' + '编辑');
                $(this).attr('lay-submit',"");
                $(this).attr('lay-filter',"saveuser")
                $(this).parents('.info').find('input').attr('readonly', 'readonly');
                $(this).parents('.info').find('select').attr('disabled','disabled');
                form.render();
            }
        })
        $(document).on('click','.amend',function(){
            layer.open({
                title: '修改密码',
                type:1,
                area:'500px',
                content: $('.amendpass')
            });
        })
        $(document).on('click','.shenhe',function(){
//            uploadInst();
            layer.open({
                title: '账号审核',
                type:1,
                area:'500px',
                content: $('.check')
            });
        })
    // })

})