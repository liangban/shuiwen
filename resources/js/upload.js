layui.use(['upload','layer','form'], function() {
    var $ = layui.jquery,
        layer=layui.layer
        , upload = layui.upload
        , form = layui.form

    //普通图片上传
    var uploadInst = upload.render({
        elem: '#test1'
        // , url: '/upload/'
        , before: function (obj) {
            //预读本地文件示例，不支持ie8
            
            obj.preview(function (index, file, result) {
                console.log(1);
                $('#demo1').attr('src', result); //图片链接（base64）
            });
        }
        
    });
    var uploadInst1 = upload.render({
    elem: '#test2'
    ,url: 'http://www.tomylee.top/application'
    ,xhrFields:{withCredentials:true}
    ,method:'post'
    ,dataType:"jsonp"
    ,before: function(obj){
      //预读本地文件示例，不支持ie8
      obj.preview(function(index, file, result){
        $('#demo2').attr('src', result); //图片链接（base64）
      });
    }
    ,done: function(res){
      //如果上传失败
      console.log(res)
      if(res.code > 0){
        return layer.msg('上传失败');
      }
      //上传成功
    },
    success: function(res, obj) {
                    console.log(res); //上传成功返回值，必须为json格式
                    console.log(obj); //上传file对象
                }
                ,error: function(a,b,c){
      //演示失败状态，并实现重传
      console.log(a)
      console.log(b)
      console.log(c)
    }
    
  });

    var uploadInst2 = upload.render({
    elem: '#test3'
    ,url: 'http://www.tomylee.top/application'
    ,before: function(obj){
      //预读本地文件示例，不支持ie8
      obj.preview(function(index, file, result){
        $('#demo3').attr('src', result); //图片链接（base64）
      });
    }
    ,done: function(res){
      //如果上传失败
      console.log(res)
      if(res.code > 0){
        return layer.msg('上传失败');
      }
      //上传成功
    }
    ,error: function(){
      //演示失败状态，并实现重传
      var demoText = $('#demoText');
      demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-mini demo-reload">重试</a>');
      demoText.find('.demo-reload').on('click', function(){
        uploadInst.upload();
      });
    }
  });
    
    $("#upload").bind("click",function (e) {
        var form = new FormData(document.getElementById("application"));
        console.log(form)
        $.ajax({
            url:"http://www.tomylee.top/application",
            type:"post",

            data:form,
            processData:false,
            contentType:false,
            success:function(data){
                console.log(data);
                if(data.status==true){
                    layer.msg(data.msg)
                    setTimeout(function(){
                        // $('.layui-layer-ico').click();
                        window.location.reload();
                    },1000)
                }
                else{
                    layer.msg(data.msg)
                }
            },
            error:function(e){
                console.log(e)
                alayer.msg('网络错误！')
            }
        });
        e.preventDefault();
    })
})