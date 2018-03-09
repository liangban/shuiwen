layui.use(['laydate','layer','api','form','element'], function(){
    var api = layui.api,
        $=layui.jquery;
    // api.getTree();
    var element = layui.element;
    var form=layui.form;
    var laydate = layui.laydate;
    var layer = layui.layer;
    var num;
    var arr=new Array();
    function  addZero(i) {
        return i>10?i:'0'+i;
    }
    // loading
    $(document).ajaxStart(function(){
        layer.load(2);
    });
    $(document).ajaxSuccess(function(){
        layer.closeAll('loading');
    });

    api.getauthtree(function(data){
        // console.log(data)
        if(data.status == true) {
            var zNodes=data.data;
            var setting = {
                view: {
                    addHoverDom: addHoverDom,
                    removeHoverDom: removeHoverDom,
                    selectedMulti: false
                },
                check: {
                    enable: true
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                edit: {
                    enable: true,
                    showRemoveBtn: true,
                    showRenameBtn: false,
                },
                callback: {
                    onRemove: onRemove,
                    onCheck: zTreeOnCheck,
                    onRename: onRename
                }

            };
            api.getrol(num,function(data){
                // console.log(data)
                if(data.status==true){
                    $.each(data.data,function(i,v){
                    $('.ztree li').eq(i).children(".chk").removeClass("checkbox_false_full").addClass("checkbox_true_full")//找出tID的值，然后找到对应的tree_id,
                    console.log(v.roleID)
                    arr.push(""+v.roleID+"");
                    console.log(arr)
                });
                }
            })
            function onRename(event, treeId, treeNode){
                console.log(event)
                console.log(treeId)
                console.log(treeNode)
            }
            function zTreeOnCheck(event, treeId, treeNode) {
                // x+=treeNode.id+",";
                arr.push(treeNode.id)
                var brr=new Array();
                $.each(arr,function(i,v){
//                            console.log(v)
                    var items=v;
                    if($.inArray(items,brr)==-1) {
                        brr.push(items);
                    }
                })
                console.log(treeNode.id)
                $('.get_user form input').val(brr)
            };
            // $('.groups form input').val(x);

            function onRemove(i,v,data){
                var number=data.id;
                var id=data.tId
                console.log(number)
                $.ajax({
                    url:url+'admin/authority/'+number,
                    dataType:'json',
                     
                    type:'delete',
                    success:function(data){
                        console.log(data)
                        if(data.status==true){
                            $("#" + id).remove();
                            console.log(1)
                            layer.msg(data.msg)
                        }
                        else {
                            if(data.data==null){
                                layer.msg(data.msg)
                            }
                            else{
                                layer.msg(data.data[0].msg)
                            }
                        }
                    }
                })

            }
            $(document).ready(function() {
                $.fn.zTree.init($("#authority"), setting, zNodes);
            });
            var newCount = 1;
            function addHoverDom(treeId, treeNode) {
                var sObj = $("#" + treeNode.tId + "_span");
                // console.log(sObj)
                sObj.parents('li.level0').attr('infoid',treeNode.id);
                if(treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
                var addStr = "<span class='button add' id='addBtn_" + treeNode.tId +
                    "' title='add node' onfocus='this.blur(); infoid='"+treeNode.id+"''></span>";
                sObj.after(addStr);
                var btn = $("#addBtn_" + treeNode.tId);
                if(btn) btn.bind("click", function() {
                    var zTree = $.fn.zTree.getZTreeObj("authority");
                    $('.layer').show();
                    // console.log(treeNode.id)
                    $('.parent_catalog').val(treeNode.id)
                    $.each($('.parent_catalog option'),function(){
                        if($(this).val()==treeNode.id){
                            console.log($(this))
                            $(this).attr('selected','true');
                        }
                    })
                    form.render();
                    return false;
                });


            };
            function removeHoverDom(treeId, treeNode) {
                $("#addBtn_" + treeNode.tId).unbind().remove ();
            };
            var option=''
            $.each(data.data,function(i,v){
                // console.log(v)
                // if(v.pid=='-1'){
                    // console.log($(this))
                    option+='<option value="'+v.id+'">'+v.name+'</option>'
                // }
            })
            $('.authority .layui-input-block .parent_catalog').append(option);
            form.render();
        }
        else{
            if(data.data==null){
                    layer.msg(data.msg)
                }
                else{
                    layer.msg(data.data[0].msg)
                }
        }


    })

    $('.get_user button[type="reset"]').on('click',function(data){
        // $('b.layui-icon').click();

    })
});