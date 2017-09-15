//make client side connection
var socket = "";
var usrName = "";
var booool=0;
var startStream = 0;
$("document").ready(function(){
    socket = io.connect({
        'reconnection': true,
        'reconnectionDelay': 500,
        'reconnectionAttempts': 10
      });
    socket.on('connect', function(){
        console.log('connected');
        if(!localStorage['usrName']){
            $("#nameModal").modal({
                backdrop: 'static',
                keyboard: false
            });
        }else{
            usrName = localStorage['usrName']
            nameEmitter();
        }
    });                                 
    socket.on('disconnect', function (){console.log('disconnected',socket.connected)});
    



    $("#nameForm").submit(function (e) {
        e.preventDefault();
        usrName = $("#usr").val();
        localStorage['usrName'] = usrName;
        $("#nameModal").modal("hide");

        // $("#msg").focus();
        nameEmitter();
       

       
    });
    

    function nameEmitter() {
        socket.emit("name",{
            name: usrName
        })
        $("#name").text(usrName);
    }


    socket.on("onlineUsers", function(data){
        // $(".onlineUsers").show();
        $(".onlineUserslist").empty();
        for (var i = 0; i < data.length; i++) {
            if(data[i].socket_id == socket.id){
                data.splice(i,1)
                console.log(data)
            }
            
        }

        for(var i = 0; i<data.length; i++){

            $(".onlineUserslist").append("<li onclick=\"onetoOneChat('"+data[i].socket_id+"','"+data[i].name+"','"+socket.id+"')\">"+data[i].name+"</li>");
        }
        
    });

    

    socket.on("incommingStream", function(data){
        if (!startStream) {
            $(".onlineUsers").hide();
            $(".chatDiv").show();
            $(".chat").hide();
            $(".name").text(data.data.sender_name)
            console.log(data);

            var obj = {
                receiver: data.data.sender,
                receiver_name: data.data.sender_name,
                sender: data.data.receiver,
                sender_name: data.data.receiver_name,
            }
            $("#msgForm").append("<input type='hidden' name='data' class='readyToMsg' value='"+JSON.stringify(obj)+"'>");
            // startVideoCall();
            startStream = 1;
        }
        

        // console.log(data);

        
        
        $(".videoStream").show();
        var img = document.getElementById("play");
        img.src = data.stream;


    });
    
    socket.on("message",function(data){
        $(".onlineUsers").hide(300);
        $(".chatDiv").show(300);
        $(".chat").append("<li>"+data.msg+"</li>");
        console.log(data);
        $(".readyToMsg").attr("disabled", false);        
        $(".readyToMsg")[0].focus();  
        if(!booool){
            $(".chatDiv").prepend("<strong>Chat with "+data.sender_name+"</strong>"); 
            booool=1;
        }
        
        var obj = {
            receiver: data.sender,
            receiver_name: data.sender_name,
            sender: data.receiver,
            sender_name: data.receiver_name,
        }

        $("#msgForm").append("<input type='hidden' name='data' class='readyToMsg' value='"+JSON.stringify(obj)+"'>");

        var wtf    = $('.chat');
        var height = wtf[0].scrollHeight;
        wtf.scrollTop(height);
    })

    

    
});
function onetoOneChat(chatwith, name, own, msg) {
    $(".onlineUsers").hide(300);
    $(".chatDiv").show(300);
    var obj = {
        receiver: chatwith,
        receiver_name: name,
        sender: own,
        sender_name: usrName,
        msg:msg
    }
    if (!msg) {
        $(".readyToMsg").attr("disabled", false);        
        $(".readyToMsg")[0].focus();  
        $(".chatDiv").prepend("<strong>Chat with "+name+"</strong>"); 
        $("#msgForm").append("<input type='hidden' name='data' class='readyToMsg' value='"+JSON.stringify(obj)+"'>");
    }
    
    console.log(obj);

    socket.emit("onetoonechat", obj, function (done) {
        console.log(done);
    });
}

function msgFormSubmit(e) {
    booool=1;
    e.preventDefault();
    var dataa= $("#msgForm").serializeArray();
    var data = {};
    $(dataa).each(function(index, obj){
        data[obj.name] = obj.value;
    });
    console.log(data);
    var msg = data.msg;
    dataa = JSON.parse(data.data);
    console.log(dataa);
    onetoOneChat(dataa.receiver,dataa.receiver_name,dataa.sender,msg);
    $(".chat").append("<li style='text-align:right;margin-right:15px;'>"+msg+"</li>");
    $($(".readyToMsg")[0]).val("");
    var wtf    = $('.chat');
    var height = wtf[0].scrollHeight;
    wtf.scrollTop(height);
}
function startVideoCall() {
    var data = JSON.parse($("input[name=data]").val());
    $(".chat").hide();
    $(".videoStream").show();
    $(".name").text(data.receiver_name);

    var video = document.getElementById("video");

    var canvas = document.getElementById("preview");
    var context = canvas.getContext("2d");

    
    canvas.width=canvas.parentElement.clientWidth;
    canvas.height = 250;
    console.log(video.height);

    context.width = canvas.width;
    context.height = canvas.height;

    

    navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msgGetUserMedia);

    if(navigator.getUserMedia){
        navigator.getUserMedia({video:true}, loadCam, loadFail);
    }

    function loadCam(stream) {
        video.src = window.URL.createObjectURL(stream);
        setInterval(function(){
            viewVideo(video, context);
        },100);
       
        
        console.log("Cam load success");
    }
    function loadFail() {
        console.log("load Fail");
    }
    function viewVideo(video, context) {
        context.drawImage(video, 0,0, context.width, context.height);
        socket.emit("stream", {
            stream: canvas.toDataURL('image/webp'),
            data: data
        });
    }
   

}






