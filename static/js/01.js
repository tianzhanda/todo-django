//将数据存储在浏览器localStorage  
// 数据格式： todoList:{"datetime": [{"li":inputContent,"status":true/false}]
// 打开浏览器时，从浏览器中读取数据、显示数据
//触发post时：1、从浏览器读取数据，新增数据，将数据写回浏览器  2、在页面上新增一条内容
//修改数据：1、从浏览器读取数据，修改数据，将数据写回浏览器  页面显示
//删除数据:1、从浏览器读取数据，删除数据，将数据写回浏览器  页面显示
//todo>>>>done:读取数据，修改状态为true，写回浏览器，
//done>>>>todo：读取数据，修改状态为true，写回浏览器，  在todo里面增加一条内容

var addCount=0;                        //日期步进全局变量
var datetime=dateFmt(addCount);        //当前日期全局变量，用于显示选定的日期、筛选选定日期的事件列表
var today=dateFmt(addCount);           //今天的日期全局变量
var lastdaytime=dateFmt(addCount-1);   //当前日期前一天全局变量，用于获取该天的待办事件（未完成事件）
console.info(window.datetime);

//定义时间格式
function dateFmt(addCount){ 
    var aa = new Array("日", "一", "二", "三", "四", "五", "六");  
    var dd = new Date(); 
    dd.setDate(dd.getDate()+addCount);       //获取AddDayCount天后的日期 
    var y = dd.getFullYear(); 
    var m = dd.getMonth()+1;                 //获取当前月份的日期 
    var d = dd.getDate(); 
    showList();                              //刷新列表
    return  y+"-"+m+"-"+d+" 星期"+aa[dd.getDay()];                   //拼接日期变量，作为key值                       
}

//根据选择的时间显示列表
function getDateStr(AddDayCount){ 
    window.addCount = window.addCount+AddDayCount;  //设置日期步进
    window.datetime = dateFmt(window.addCount);     //获取设定步进的日期
    window.lastdaytime=dateFmt(window.addCount-1);  //获取设定步进日期的前一天                                                
}

//清除缓存
function clear(){
    var msg = "警告：确定要清除记录吗？清除后将不可恢复！\n\n请确认！";
    if (confirm(msg)==true){
        //localStorage.clear();
        saveData({})
        showList();
    }    
}

//浏览器页面显示列表
function showList(){
    var todoList = document.getElementById("todoList");     //获取待办列表元素ID
    var doneList = document.getElementById("doneList");     //获取已完成列表元素ID
    var todoCount = document.getElementById("todoCount");   //获取待办事件数元素ID
    var doneCount = document.getElementById("doneCount");   //获取完成事件数元素ID
    var todoList1 = "";                                     //定义待办事件列表
    var doneList1 = "";                                     //定义完成事件列表
    var count1 = 0;                                         //定义待办事件数
    var count2 = 0;                                         //定义完成事件数
    var data=loadData();                                    //从浏览器缓存中获取数据
    var data1 ={};
    var data2 ={};
    if(data.hasOwnProperty(window.datetime)){               //判断字典中是否有以当前日期变量为值的键，如果有则拼接事件列表，如果没有则列表赋值为空
        data2=data[window.datetime];                        //取当前日期的事件列表
        for(var i=data2.length-1; i>=0; i--){               //从事件列表中取事件
            if(data2[i].status){                            //判断事件是否完成，如果已完成，则将事件添加到完成事件列表，否则，添加到待办事件列表
                doneList1 += "<li id='li-" + i +"'><input class='checkBox' type='checkbox' style='float:left;' checked='checked' onchange='change(" + i + ",true)'>" + 
                "<input class='content' type='text' style='float:left;' id=" + i + " value='" + data2[i].li + "' onchange='update(" + i + ")'>" +
                    "<span class='listSpan' style='float:right;' onclick=remove(" +i + ")>" + "-</span></li>";
                count2++;
                
            }else{
                todoList1 += "<li id='li-" + i +"'><input class='checkBox' type='checkbox' style='float:left;' onchange='change(" + i + ",false)'>" + 
            "<input class='content' type='text' style='float:left;' id=" + i + " value='" + data2[i].li +"' onchange='update(" + i + ")'>" +
                "<span class='listSpan' style='float:right;' onclick=remove(" +i + ")>" + "-</span></li>";
                count1++;
            }
        }
        todoList.innerHTML = todoList1;                     //填充待办事件列表
        doneList.innerHTML = doneList1;                     //填充完成事件列表
        doneCount.innerText = count2;                       //填充待办事件数
        todoCount.innerText = count1;                       //填充完成事件数
    }else{ 
        if(data.hasOwnProperty(window.lastdaytime)&&(window.today==window.datetime))             //判断字典中是否有昨天日期变量为值的键，将昨天待办事件（未完成事件）加入到今天待办列表
        {
            data1=data[window.lastdaytime];                 //取昨天日期的事件列表
            data2=data[window.datetime];                    //取今天日期的事件列表
            for(var i=0; i<=data1.length-1; i++){           //从事件列表中取事件
                if(!data1[i].status){                       //判断事件是否完成，如果未完成，则将事件添加到今天待办事件列表
                    if(data.hasOwnProperty(window.datetime)){    //如果今天有事件记录，则在列表中增加，否则，增加今天的事件字典
                        data[window.datetime].push(data1[i]);
                    }else{
                        data[window.datetime]=[data1[i]];
                    }
                    todoList1 += "<li id='li-" + i +"'><input class='checkBox' type='checkbox' style='float:left;' onchange='change(" + i + ",false)'>" + 
                    "<input class='content' type='text' style='float:left;' id='" + i + "' value='" + data1[i].li +"' onchange='update(" + i + ")'>" +
                        "<span class='listSpan' style='float:right;' onclick=remove(" +i + ")>" + "-</span></li>";
                    count1++;
                }
            }
            saveData(data);
        }
        todoList.innerHTML = todoList1;                     //填充待办事件列表
        doneList.innerHTML = "";
        todoCount.innerText = count1;                       //填充待办事件数
        doneCount.innerText = 0;                            
    }
    setInterval("document.getElementById('dateTime').innerHTML = window.datetime;"); //更新选择的日期
}

//修改事件列表，修改事件状态
function change(id,val){
    var data = loadData();
    if(val){
        var li = document.getElementById("li-"+id);
        var checkbox = li.children[0];
        checkbox.innerHTML = "<input class='checkBox' type='checkbox' style='float:left;' onchange='change(" + id + ",false)'>";
        var doneCount = new Number(document.getElementById("doneCount").innerText);
        doneCount.innerText = doneCount-1;
        data[window.datetime][id].status = false;
        saveData(data);
        showList();
    }else{
        var li = document.getElementById("li-"+id);
        var checkbox = li.children[0];
        checkbox.innerHTML = "<input class='checkBox' type='checkbox' checked='checked' style='float:left;' onchange='change(" + id + ",true)'>";
        var todoCount = new Number(document.getElementById("todoCount").innerText);
        todoCount.innerText = todoCount-1;
        data[window.datetime][id].status = true;
        saveData(data);
        showList();
    }
}

//编辑事件内容
function update(id){
    var data = loadData();
    var newItem = document.getElementById(new String(id));  //被修改的数据
    if (newItem.value){                                     //如果修改后数据不为空，则保存，否则删除该项
        data[window.datetime][id].li = newItem.value;
        saveData(data);
    }
    else{
        remove(id)
    }    
}

//删除事件
function remove(n){
    var data = loadData();
    data[window.datetime].splice(n,1);
    saveData(data);
    showList();
}

//保存数据
function saveData(data){
    data = JSON.stringify(data);
    localStorage.setItem("todoList", data);
    console.log("sava",JSON.parse(localStorage.getItem("todoList")));
}
//读取数据
function loadData(){    
    var data = localStorage.getItem("todoList");
    var emptydic = {};
    if(data==null){
        return emptydic;
    }else {
        return JSON.parse(data);
    }
}

//提交表单
function postaction(){
    var inputTodo = document.getElementById("inputTodo");
    if(inputTodo.value == "") {
        alert("内容不能为空");
    }else{
        //读取数据
        var data=loadData();
        var todo={"li":inputTodo.value,"status":false};
        //新增
        if(data.hasOwnProperty(window.datetime)){
            data[window.datetime].push(todo);
        }else{
            data[window.datetime]=[todo];
        }
        // 保存
        saveData(data);
        var form=document.getElementById("form");
        form.reset();
        //页面新增数据
        showList();
    }
}

//打开浏览器时加载页面
window.onload = function(){
    showList();
}
