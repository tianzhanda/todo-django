//从浏览器localStorage中读取数据
function loadData(){    
    var data = localStorage.getItem("todoList");  //得到存储的数据
    var emptydic = {};
    if(data==null){                               //如果没有数据，返回空字典                 
        return emptydic;
    }else {
        return JSON.parse(data);                  //否则返回JSON格式数据
    }
}

//保存数据
function saveData(data){
    localStorage.clear();
    localStorage.setItem("todoList", data);
    console.log("sava",JSON.parse(localStorage.getItem("todoList")));
}

//展示数据
//数据结构 todoList:{"datetime": [{"li":inputContent,"status":true/false}]
function display(){
    var data=loadData();
    var context = document.getElementById("totleList");                       //得到html历史记录表的Id
    var context1 = "<tr><th>日期</th><th>事项</th><th>是否完成</th></tr>";     //拼接历史记录表头
    datetimes=Object.keys(data);                                              //从字典中获取所有key值（所有datetime）
    var first=true;                                                           //标记是否为当天的第一行，用于合并单元格
    for(var i=0;i<datetimes.length;i++){                                      //取出每一天的事件列表
        for(var j=0;j<data[datetimes[i]].length;j++){                         
            if(first){                                                        //如果是当天的第一行，则日期列与后面合并；如果该事件状态的true,则在是否完成列显示是，否则显示否
                if(data[datetimes[i]][j]['status']){
                    status_str='是';
                    context1+= "<tr><td class='daterow' rowspan="+data[datetimes[i]].length+">"+datetimes[i]+"</td><td class='done'>"+data[datetimes[i]][j]['li']+"</td><td class='done isdonerow'>"+status_str+"</td></tr>";
                }else{
                    status_str='否';
                    context1+= "<tr><td class='daterow'rowspan="+data[datetimes[i]].length+">"+datetimes[i]+"</td><td>"+data[datetimes[i]][j]['li']+"</td><td class='isdonerow'>"+status_str+"</td></tr>";
                }
            }
            else{                                                             //如果不是当天的第一行，则日期列不显示；如果该事件状态的true,则在是否完成列显示是，否则显示否
                if(data[datetimes[i]][j]['status']){                      
                    status_str='是';
                    context1+= "<tr><td class='done'>"+data[datetimes[i]][j]['li']+"</td><td class='done isdonerow'>"+status_str+"</td></tr>";
                }else{
                    status_str='否';
                    context1+= "<tr><td>"+data[datetimes[i]][j]['li']+"</td><td class='isdonerow'>"+status_str+"</td></tr>";
                }      
            }
            first=false;
        }
        first=true;
    }
    context.innerHTML=context1;  //写入html
}

//下载到本地
function downLoad() {
    var data=loadData();
    var filename=dateFmt(0) +"-todoList.json";
    if (!data) {
        alert('data is null');
        return;
    }
    if (typeof data === 'object') {
        data = JSON.stringify(data, undefined, 4)
    }
    var blob = new Blob([data], { type: 'text/json' });
    var e = document.createEvent('MouseEvents');
    var a = document.createElement('a');
    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
}

//上传到浏览器
//点击导入,使files触发点击事件,然后完成读取文件的操作
$("#fileImport").click(function () {
    $("#files").click();
    })
function fileImport() {
    var selectedFile = document.getElementById('files').files[0];
    if(window.FileReader && selectedFile!=undefined)
    {
        var reader = new FileReader();//这是核心,读取操作就是由它完成.
       // let selectedFile1 = window.btoa(selectedFile);
        reader.readAsText(selectedFile);//读取文件的内容,也可以读取文件的URL
        reader.onload = function () {
        //当读取完成后回调这个函数,然后此时文件的内容存储到了result中,直接操作即可
        saveData(this.result);
        display();
        } 
    }
}

//打开浏览器时加载
window.onload = function(){
    display();
}

//定义时间格式
function dateFmt(addCount){ 
    var dd = new Date(); 
    dd.setDate(dd.getDate()+addCount);       //获取AddDayCount天后的日期 
    var y = dd.getFullYear(); 
    var m = dd.getMonth()+1;                 //获取当前月份的日期 
    var d = dd.getDate();                      //刷新列表
    return  y+"-"+m+"-"+d;                   //拼接日期变量，作为key值                       
}