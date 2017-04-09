/*使用express设置todo后端
todo 后端程序提供了 4 个 API, 说明如下


1, 获得所有的 todo, 返回的是一个 JSON 格式字符串(数组)

GET
http://localhost:8081/todo/all

ajax(method, url, null, '', function(r){
var todos = JSON.parse(r.response)
console.log(todos)
})

2, 发送 JSON 格式字符串来创建一个 todo
要求设置 Content-Type 为 application/json

POST
{"task": "study"}
http://localhost:8081/todo/add

var url = 'http://localhost:8081/todo/add'
var data = {
'task': 'haha',
}
data = JSON.stringify(data)
ajax('POST', url, data, function(r){
var t = JSON.parse(r.response)
console.log(t)
})


3, 发送 JSON 格式字符串来更新一个 todo
要求设置 Content-Type 为 application/json

POST
{"task": "study"}
http://localhost:8081/todo/update/:id

var todoId = '965'
var url = 'http://localhost:8081/todo/update/:965'
var data = {
'task': 'great',
}
data = JSON.stringify(data)
ajax('POST', url, data, function(r){
var t = JSON.parse(r.response)
console.log(t)
})

//

4, 删除一个 todo
GET
http://localhost:8081/todo/delete/:id
<你的qq号>/delete/<todo_id>

var todoId = '965'
var url = 'http://localhost:8081/todo/delete/:965'
ajax('GET', url, null, '', function(r){
var t = JSON.parse(r.response)
console.log(t)
})


*/

// 引入 express 并且创建一个 express 实例赋值给 app
var express = require('express')
var bodyParse = require('body-parser')

var app = express()

var todoList = [
    {
        id: 1,
        task: "456",
    }
]

// 配置静态文件目录
app.use(express.static('static'))
// 把前端发过来的数据用 json 解析的强制套路
app.use(bodyParse.json())

var sendHtml = function(path, response) {
    var fs = require('fs')
    var options = {
        encoding: 'utf-8'
    }
    fs.readFile(path, options, function(err, data){
        console.log(`读取的html文件 ${path} 内容是`, data)
        response.send(data)
    })
}
// 用 get 定义一个给用户访问的网址
// request 是浏览器发送的请求
// response 是我们要发给浏览器的响应
app.get('/', function(request, response) {
    // var r = `
    // `
    // fs 是 file system 文件系统的缩写
    // fs 是 node 中处理文件和目录的库
    // var fs = require('fs')
    // var options = {
    //     encoding: 'utf-8'
    // }
    // fs.readFile('index.html', options, function(err, data){
    //     console.log('读取的html文件内容是', data)
    //     response.send(data)
    // })
    var path = 'index.html'
    var fs = require('fs')
    var options = {
        encoding: 'utf-8'
    }
    fs.readFile(path, options, function(err, data){
        // console.log(`读取的html文件 ${path} 内容是`, data)
        // response.send 用来发送数据给浏览器
        response.send(data)
    })
})

var todoAdd = function(todo) {
    // 判断 todoList 中是否有数据
    // 如果是第一次插入, id 为 1
    // 否则 id 是最后一个数据的 id + 1
    if(todoList.length === 0) {
        todo.id = 1
    } else {
        todo.id = todoList[todoList.length-1].id + 1
    }
    // 把 todo 添加到 todoList 中
    todoList.push(todo)
    return todo
}

var todoUpdate = function(todo) {
    var id = todo.id
    for(var i = 0; i < todoList.length; i++) {
        // 找到对应 id 的数据
        var t = todoList[i]
        if(t.id == id) {
            // 找到了, 修改它
            t.task = todo.task
            return t
        }
    }
    // 实际上到了这里就表明程序并没有找到对应 id 的数据
    // 理论上应该返回一个错误 让前端知道错了
    // 但是现在我们不管了
    return todo
}

var todoDelete = function (id) {
    // stirng 转 number
    id = Number(id)
    var index = -1
    for(var i = 0; i < todoList.length; i++) {
        // 找到对应 id 的数据
        var t = todoList[i]
        if(t.id == id) {
            // 找到了, 设置 index 并 break
            index = i
            break
        }
    }
    // 如果找到了 index 会大于 -1
    if(index > -1) {
        // splice 删除并返回被我们删除的元素
        var todo = todoList.splice(index, 1)
        // splice 函数返回的是一个数组, 所以我们要用 [0] 取出第一个元素
        return todo[0]
    } else {
        // 没找到这个数据, 我不管了, 返回 null
        return null
    }
}

var sendJSON = function (response, object) {
    var data = JSON.stringify(object)
    response.send(data)
}

// 获取所有 todo 的路由
app.get('/todo/all', function(request, response) {
    // var todos = [
    //     {
    //         id: 1,
    //         task: '吃饭',
    //     }
    // ]
    // console.log(Object.keys(request))
    var r = JSON.stringify(todoList, null, 2)
    response.send(r)
})

// 添加 todo 的路由
app.post('/todo/add', function(request, response) {
    // request.body 是一个对象
    var todo = request.body
    var t = todoAdd(todo)
    sendJSON(response, t)
})

/*
这里的 :id 是一个叫做动态路由的概念
它可以匹配形如以下的 url
 /todo/update/1
 /todo/update/2
 /todo/update/3
*/
app.post('/todo/update/:id', function(request, response) {
    // 动态路由里面的变量通过 request.params.变量名 的方式来获取
    // 这种变量的类型是 string
    var id = request.params.id
    console.log('update', id, typeof id)
    var todo = request.body
    var t = todoUpdate(todo)
    sendJSON(response, t)
})

// 删除 todo 的路由
app.get('/todo/delete/:id', function(request, response) {
    var id = request.params.id
    var t = todoDelete(id)
    sendJSON(response, t)
})

// listen 函数的第一个参数是我们要监听的端口
// 这个端口是要浏览器输入的
// 默认的端口是 80
// 所以如果你监听 80 端口的话，浏览器就不需要输入端口了
// 但是 1024 以下的端口是系统保留端口，需要管理员权限才能使用
var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})
