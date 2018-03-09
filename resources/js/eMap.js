var myChart = echarts.init(document.getElementById('eMap'));
var myArray = [];//存储 下钻过程的  比如 -1，长江流域CD，湘江流域CD
myArray.push("-1");

var stationCache = {};   //用于存储后台获取的测站数据，可以实现缓存

var myOption = {
    animation: true,
    tooltip: {
        trigger: 'item'
    },
    toolbox: {
        show: true,
        orient: 'vertical',
        x: 'right',
        y: 'top',
        padding: 20,
        itemSize: 20,
        feature: {
            myButton1: {
                show: true,
                title: '返回',
                icon: 'image://../icons/up1.svg',
                onclick: function () {
                	
                   backToLast();
                }
            },
//          myButton3: {
//              show: true,
//              title: '显示测站',
//              icon: 'image://../icons/browse.svg',
//              onclick: function () {
//                  getStations(myArray[myArray.length - 1], "B1", function (stations) {
//                      if (stations == null)
//                          alert("该流域下无该类型测站信息");
//                      else
//                          console.log(stations.length + " : " + JSON.stringify(stations));
//                  });
//              }
//          }
        }
    },
    visualMap: {
        show: false,
        min: 0,
        max: 1000,
        left: 'left',
        top: 'bottom',
        text: ['High', 'Low'],
        seriesIndex: [1],
        inRange: {
            color: ['#e0ffff', '#006edd']
        },
        calculable: true
    },
    geo: {
        map: '-1',
        label: {
            normal: {
                show: true,
                textStyle: {
                    color: 'rgba(0,0,0,0.4)'
                }
            }
        },
        itemStyle: {
            normal: {
                borderColor: 'rgba(0, 0, 0, 0.2)'
            },
            emphasis: {
                areaColor: null,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 20,
                borderWidth: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        },
        layoutCenter: ['50%', '51%'],
        layoutSize: '100%'
    },
    series: [
        {
            name: '测站',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbol: 'pin',
            symbolSize: 12,
            itemStyle: {
                normal: {
                    color: '#F06C00',
                    borderColor: '#F06C00',
                    borderWidth: 1
                },
                emphasis: {
                    color: '#F06C00',
                    borderColor: '#F06C00',
                    borderWidth: 5
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    return "测站<br/>" + params.name + ":" + params.value[0] + "," + params.value[1];
                }
            },
            data: []
        },
        {
            name: '流域',
            type: 'map',
            geoIndex: 0,
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    return "流域<br/>" + params.name;
                }
            },
            data: []
        }
    ]
};

//初始化
$(document).ready(function () {
    myChart.showLoading();
    $.getJSON('../json/-1.json',function (data) {
        echarts.registerMap("-1", data);
        myOption.series[1].data = convertDataColor(data.features);
        myChart.setOption(myOption);
        myChart.hideLoading();
    });	
    
});

myChart.on("click", function (params) {
    if (myArray.length > 3) return;
    //获取当前地图的json数据
    var features = echarts.getMap(myArray[myArray.length - 1]).geoJson.features;
    var info = null;
    //找到点击区域的详细数据
    features.forEach(function (value, index) {
        if (value.properties.name == params.name)
            info = value.properties;
    });
    if (!info) return;

    //重复点击相同区域 防止,比如一个2级流域没有子流域了 这种现象出现
    if (info.BSCD == myArray[myArray.length - 1]) return;

    //先看原来是否已经注册过地图
    var old = echarts.getMap(info.BSCD);
    if (old) {
        myOption.geo.map = info.BSCD;
        myOption.series[0].data = [];
        myOption.series[1].data = convertDataColor(old.geoJson.features);
        myChart.setOption(myOption);
        myArray.push(info.BSCD);
    } else {
        myChart.showLoading();
        $.getJSON('../json/' + info.BSCD + '.json', function (geojson) {
            echarts.registerMap(info.BSCD, geojson);
            myOption.geo.map = info.BSCD;
            myOption.series[0].data = [];
            myOption.series[1].data = convertDataColor(geojson.features);
            myChart.setOption(myOption);
            myChart.hideLoading();
            myArray.push(info.BSCD);
        });
    }
});

//获得当前流域编码
function getBSCD(){
 return myArray[myArray.length - 1];
}

//返回上一层
function backToLast() {
    //判断几级流域tag,1级流域就不让了 上钻了
    if (myArray.length < 2)
        return;
    myArray.pop();
    myOption.geo.map = myArray[myArray.length - 1];
    myOption.series[0].data = [];
    myOption.series[1].data = convertDataColor(echarts.getMap(myArray[myArray.length - 1]).geoJson.features);
    myChart.setOption(myOption);
}

//获得测站信息 会将测站显示到地图上 并将获得的测站信息数组作为参数填入回调函数handleStation中
//填入的数据是 null 或者 测站列表  比如下面
//[{"stnm":"直门达","stcd":"60100700","lgtd":"97.2383300","lttd":"33.0127700"},{"stnm":"测试1","stcd":"60100701","lgtd":"97.2383300","lttd":"33.0127700"}]
function getStations(BSCD, resourceID, handleStations) {
    //先检查 是否已经缓存了
    if (stationCache[BSCD]) {
        if (stationCache[BSCD][resourceID]) {
            showStationPoint(stationCache[BSCD][resourceID]);
            handleStations(stationCache[BSCD][resourceID]);
            return;
        }
    }
    //没有缓存就会从后台添加
    myChart.showLoading();
    $.ajax({
        type: 'get',
        url: "http://www.tomylee.top/stations", //地址
        data: {
            "BSCD": BSCD,
            "resourceID": resourceID
        },
        // async: false,
        success: function (data) {
            myChart.hideLoading();
            //成功返回数据
            if (data.status == true) {
                if (data.data) {
                    if (stationCache[BSCD])
                        stationCache[BSCD][resourceID] = data.data;
                    else {
                        var aaa = {};
                        aaa[resourceID] = data.data;
                        stationCache[BSCD] = aaa;
                    }
                    showStationPoint(stationCache[BSCD][resourceID]);
                    handleStations(stationCache[BSCD][resourceID]);
                } else
                    handleStations(null);
            } else {
                // alert("该流域下无该类型测站信息");
                handleStations(null);
            }
        },
        error: function () {
            myChart.hideLoading();
            alert("发生意外错误");
        }
    });
}


//地图上显示测站的点
function showStationPoint(data) {
    var myStationPointData = new Array();
    $.each(data, function (n, value) {
        myStationPointData.push({
            name: value.stnm,
            value: [value.lgtd, value.lttd]
        });
    });
    myOption.series[0].data = myStationPointData;
    myChart.setOption(myOption);
}

//按照地图区域 修改颜色data
function convertDataColor(features) {
    if (!features)
        return [];
    var temp = new Array();
    //找到点击区域的详细数据
    features.forEach(function (value, index) {
        temp.push({
            name: value.properties.name,
            value: randomValue()
        });
    });
    return temp;
}

//随机数
function randomValue() {
    return Math.round(Math.random() * 1000);
}



