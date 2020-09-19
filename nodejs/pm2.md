### 基本原理
1. 基于 Node Cluster 实现集群，Satan 进程（实例退出、杀死和重启等）和 God Deamon 进程（Master 进程，管理多实例运行，fork 实例等，主要通过 IPC 进行通信)，Satan 通过 RPC 调用 God 进程方法；

2. cluster 和 fork 模式区别：

	- cluster： 多实例多进程，多port，自带负载均衡，实例之间互不影响，无需业务代码改动，但是只支持 node，有 isMaster 和 fork() 等方法；Master 监听端口，worker 不监听端口，而由 Master 分发，注意 iphash 问题
	- fork：单实例多进程，支持其他语言如 python，不支持端口复用，需要自己做应用的端口分配和负载均衡的子进程业务代码；缺点就是单服务器实例容易由于异常会导致服务器实例崩溃，相当于 `require('child_process').spawn('node', ['server.js'])`（具体分析，不足够明确）


### 典型问题

一、 socket.io 在 pm2 cluster 集群模式下链接失败问题

原因：采用 round-robin 或者 hash 方式（非iphash），导致pm2将相同连接打到了不同的worker，链接失败
  
1. 解法1：官方解法 nginx 反向代理 + iphash [点这里](https://socket.io/docs/using-multiple-nodes/)

	比如应用监听 8080 端口，则必须 pm2 分发请求，否则 worker 出现端口重复占用；给 worker 分配不同的端口，并配置 nginx iphash
	
	```json
	upstream io_nodes {
	  ip_hash;
	  server 127.0.0.1:3131;
	  server 127.0.0.1:3132;
	  server 127.0.0.1:3133;
	  server 127.0.0.1:3134;
	}
	server {
	  listen 80; 
	  server_name ws.vd.net;
	  location / {
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "upgrade";
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header Host $host;
		proxy_http_version 1.1;
		proxy_pass http://io_nodes;
	  }
	}
	```
2. 解法2：服务端路由

	服务端做 worker 的负载均衡，将选择的 ip + port 渲染在页面，浏览器 ws 连接该配置，则省去 nginx iphash 这一层，是比较简单朴素的做法
	
3. 解法3：上帝进程路由（待测试）：

	pm2 master 进程实现 iphash，使相同 ip 请求打到相同 worker，简单代码：
	
	```javascript
	var express = require('express'),
    cluster = require('cluster'),
    net = require('net'),
    sio = require('socket.io');

	var port = 3000,
	    num_processes = require('os').cpus().length;
	
	if (cluster.isMaster) {
	    var workers = [];

    var spawn = function(i) {
        workers[i] = cluster.fork();
        workers[i].on('exit', function(code, signal) {
            console.log('respawning worker', i);
            spawn(i);
        });
    };

    for (var i = 0; i < num_processes; i++) {
        spawn(i);
    }

    // ip hash
    var worker_index = function(ip, len) {
        var s = '';
        for (var i = 0, _len = ip.length; i < _len; i++) {
            if (!isNaN(ip[i])) {
                s += ip[i];
            }
        }

        return Number(s) % len;
    };

    var server = net.createServer({ pauseOnConnect: true }, function(connection) {
        var worker = workers[worker_index(connection.remoteAddress, num_processes)];
        worker.send('sticky-session:connection', connection);
    }).listen(port);
	} else {
	    // worker
	    var app = new express();
	
	    // handshake server.
	    var server = app.listen(0, 'localhost'),
	        io = sio(server);
	
	    process.on('message', function(message, connection) {
	        if (message !== 'sticky-session:connection') {
	            return;
	        }
	
	        server.emit('connection', connection);
	
	        connection.resume();
	    });
	}
	```
	
4. 共享 session，或者借助 socket.io-redis 模块（没太明白）

#### 参考链接：

1. [pm2源码解读](https://www.jianshu.com/p/ac843b516fda)


