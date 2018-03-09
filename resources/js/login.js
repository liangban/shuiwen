//注意：导航 依赖 element 模块，否则无法进行功能性操作
layui.use(['element','form','apis','laydate','laypage','layer','upload'], function(){
    var element = layui.element;
    var form=layui.form;
    var api=layui.apis;
    var laydate = layui.laydate;
    var layer = layui.layer;
    var upload = layui.upload;
    // console.log(api)

    function  addZero(i) {
        return i>=10?i:'0'+i;
    }



    $('.top').load('../page/top.html')
    //执行实例


    $.ajax({
        url:url+'/user',
        type:'get',
        xhrFields: {withCredentials: true},
        success:function(data){
            if(data.status==true){
                console.log(data)
                var userID=data.data.userID;
                var userType=data.data.userType;
                if(!userID==''){
                    console.log(userID)
                    $('.login_2,.login_1').removeAttr('href')
                    $('.login_2 span').text(data.data.username)
                    $('.login_1 span').text('退出登录')
                }
                if(userType==0){
//              	$('.login ul li:nth-child(3)').
                }
                else if(userType==1){
                	
                }else if(userType==2){
                	$('.login ul li:nth-child(3)').html("<a href='../pages/index.html'>管理员中心</a>")
//              	$('.login ul li:nth-child(3)').attr('href','../pages/index2.html')
                }
            }
            else{
                console.log(1)
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            // layer.msg('网络错误')
        }

    })


    // 执行一个laydate实例
    laydate.render({
        elem: '#dateTime' ,//指定元素
        type: 'date',
        range:true,
        done: function(value, date, endDate){
            console.log(value); //得到日期生成的值，如：2017-08-18
            console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
            console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
            addZero(date.month);
            $('.startTime').val(date.year+'-'+addZero(date.month)+'-'+addZero(date.date));
            $('.endTime').val(endDate.year+'-'+addZero(endDate.month)+'-'+addZero(endDate.date));


        }
    });
    laydate.render({
        elem: '#date' ,//指定元素
        type: 'month',
        range:true,
        done: function(value, date, endDate){
            console.log(value); //得到日期生成的值，如：2017-08-18
            console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
            console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
            // $('.startData').val(date.year+'-'+date.month+'-'+date.date+' '+addZero(date.hours)+':'+addZero(date.minutes)+':'+addZero(date.seconds));
            // $('.endData').val(endDate.year+'-'+endDate.month+'-'+endDate.date+' '+addZero(endDate.hours)+':'+addZero(endDate.minutes)+':'+addZero(endDate.seconds));
        }
    });
    var laypage = layui.laypage;

    //执行一个laypage实例
    laypage.render({
        elem: 'down_page' //注意，这里的 test1 是 ID，不用加 # 号
        ,count: 50,//数据总数，从服务端得到,
        limit:10,
        groups:5,
        prev:'上一页',
        next:'下一页'
    });
    $('.auth_code img').on('click',function(){
        var date=new Date();
        $(this).attr('src','http://www.tomylee.top/verification/captcha?'+date.getTime())
        return false
    })
    //立即登录

    form.on('submit(register_now)',function(data){
        var loginName=data.field.loginName;
        var password=data.field.password;
        var verifyCode=data.field.verifyCode;
        console.log(loginName,password,verifyCode)
        api.register(loginName,password,verifyCode,function(data){
            console.log(data)
            if(data.status==true){
                console.log(data.data.userID)
                window.localStorage['users']=JSON.stringify(data.data);

                var userID = localStorage.getItem("userID");
                // console.log(userID)
                layer.msg('登录成功')
                   window.location.href='index.html'
                // history.go(-1)
                
//              self.location=document.referrer;
                form.render();
            }
            else {
            	if(data.data==null){
                	$('input[name="verifyCode"]').val('')
                	console.log(verifyCode.value)
                    $('.main .layui-form-item img').click()
            		layer.msg(data.msg)
                    // window.location.reload()
            	}
                else{
                	$('input[name="verifyCode"]').val('')
                	console.log(verifyCode)
                    $('.main .layui-form-item img').click()
                	layer.msg(data.data[0].msg)
                    // window.location.reload()
                }
                
                
            }
        })
    })
    //注销登录
    $(document).on('click','.loginout',function(){
        api.loginout(function(data){
            console.log(data)
        })
    })
    form.on('submit(register)',function(data){
        var loginName=data.field.loginName;
        var password=data.field.password;
        var confirmPassword=data.field.confirmPassword;
        var captcha=data.field.captcha;
        console.log(loginName,password,confirmPassword,captcha)
        api.forgetpassword(loginName,password,confirmPassword,captcha,function(data){
            console.log(data)
            if(data.status==true){
                localStorage.setItem('email1',loginName);
                console.log(localStorage.getItem('email1'))
                layer.msg(data.msg)
                $("input").parents('.layui-form-item').css('border-color','#e6e6e6')
                setTimeout(function(){
                    window.location.href='/page/yonghudenglu.html'
                },2000)
            }
            else {
                if(data.data==null){
                    layer.msg(data.msg)
                    $('input[name="captcha"]').parents('.layui-form-item').css('border-color','#f90000')
                }
                else{
                    if(data.data[0].field=="confirmPassword"){
                        $('input[name="confirmPassword"]').parents('.layui-form-item').css('border-color','#f90000')
                    }   
                    else if(data.data[0].field=="password"){
                        $('input[name="password"]').parents('.layui-form-item').css('border-color','#f90000')
                    }
                    else if(data.data[0].field=="captcha"){
                        $('input[name="captcha"]').parents('.layui-form-item').css('border-color','#f90000')
                    }
                    layer.msg(data.data[0].msg)
                    
                }
            }
        })
    })
    $('.main .layui-form-item input[name="loginName"]').val(localStorage.getItem('email1'));
    var email;

    $('.forget_code').on('click',function(){
        email=$("input[name='loginName']").val()
        var to=2
        console.log(email);
        api.forgetcodepassword(to,email,function(data){
            console.log(data)
            if(data.status==true){
                layer.msg(data.msg)
                // window.location.reload();
            }
            else {
                layer.msg(data.msg)
                console.log(1)
                // window.location.reload
            }
        })
    })

    $('.code').on('click',function(){
        email=$("input[name='loginName']").val()
        var to=1;
        api.getcode(to,email,function(data){
            console.log(data)
            localStorage.setItem("loginName1",email);
            console.log(localStorage.getItem('loginName1'))

            if(data.status==true){
                layer.msg(data.msg)
                // window.location.reload();
            }
            else {
                layer.msg(data.msg)
                console.log(1)
                // window.location.reload
            }
        })
    })
    $('.main .layui-form-item input[name="loginName"]').val(localStorage.getItem('loginName1'));
    form.on('submit(nextStep)',function(data){
        var to=1;
        var captcha=data.field.captcha;
        api.nextStep(to,captcha,function(data){
            console.log(data)
            if(data.status==true){
                layer.msg(data.msg)
                setTimeout(function(){
                    window.location.href='/page/yonghuzhuce2.html'
                },2000)
                
            }
            else {
                if(data.data==null){
                    layer.msg(data.msg)
                    // window.location.reload()
                }
                else{
                    layer.msg(data.data[0].msg)
                    // window.location.reload()
                }
            }
        })
    })
    form.on('submit(registerAccount)',function(data){
        var userName=data.field.userName;
        var loginName=data.field.loginName;
        var password=data.field.password;
        var confirmPassword=data.field.confirmPassword;
        var phoneNumber=data.field.phoneNumber;
        var userProperty=data.field.userProperty;
        var companyName=data.field.companyName;
        if(userProperty=='单位用户'){
            userProperty=1;
        }
        else if(userProperty=='个人用户'){
            userProperty=0;
        }
        console.log("userName:"+userName,"loginName:"+loginName,"password:"+password,"confirmPassword:"+confirmPassword,"phoneNumber:"+phoneNumber,"userProperty:"+userProperty,"companyName:"+companyName)
        api.registerAccount(userName,loginName,password,confirmPassword,phoneNumber,userProperty,companyName,function(data){
            console.log(data)
            if(data.status==true){
                layer.msg(data.msg)

                console.log(loginName1);
                setTimeout(function(){
                    window.location.href='../page/yonghudenglu.html'
                },2000)
            }
            else {
                if(data.data==null){
                    layer.msg(data.msg)
                    setTimeout(function(){
                        window.location.reload()
                    },2000)

                }
                else{
                    layer.msg(data.data[0].msg)
                    setTimeout(function(){
                        window.location.reload()
                    },2000)
                }
                
                
            }
        })
    })
    $(document).on('click','.main h3 a',function(){
        localStorage.removeItem('loginName1')
        console.log(localStorage.getItem('loginName1'))
    })
    $(document).on('click','.login_1',function(){
        // console.log(1)
        api.loginout(function(data){
            // console.log(data);
            if(data.status==true){
                $('.top').load('../page/top.html')
                window.localStorage['users']='';
                layer.msg(data.msg)
                window.location.href="/page/index.html"
            }
            else {
            	if(data.data==null){
            		layer.msg(data.msg)
            		window.location.reload
            	}
                else{
                	layer.msg(data.data[0].msg)
                	window.location.reload
                }
                
                
            }
        })
    })

    form.on('submit(contactus)',function(data){
        var name=data.field.name;
        var email=data.field.email;
        var content=data.field.content;
        // console.log(0)
        api.contactUs(name,email,content,function(data){
            // console.log(data)
            if(data.status==true){
                layer.msg(data.msg)
                setTimeout(function(){
                    $('#us input').val('')
                    $('#us textarea').val('')
                },3000)
                
            }
            else {
                if(data.data==null){
                layer.msg(data.msg)
                }
                else{
                layer.msg(data.data[0].msg)
                }
                
            }
        })
    })
    $('.logo').on('click',function(){
        window.location.href='../page/index.html'
    })
});