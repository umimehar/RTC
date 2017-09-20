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

    navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.mediaDevices.getUserMedia);

    if(navigator.getUserMedia){
        var hdConstraints = {
            video: {
              mandatory: {
                minWidth: 1280,
                minHeight: 720
              }
            },
            audio:true
          };
          var vgaConstraints = {
            video: {
              mandatory: {
                maxWidth: 640,
                maxHeight: 360
              }
            }
          };
        navigator.getUserMedia(hdConstraints, function (stream) {
            video.src = window.URL.createObjectURL(stream);
            // socket.emit("stream", {
            //     stream: canvas.toDataURL('image/webp'),
            //     data: data
            // });

            video.onloadedmetadata = function(e) {
                console.log("Video Loaded");
            };
        }, function (err) {
            console.log("Err: ",err);
            video.src = 'fallbackvideo.webm';
        }); 
    }


   

}






