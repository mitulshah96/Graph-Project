function login(){
    var hashValue = location.hash.replace(/^#/, '');
    API(hashValue);
}

function logout(){
    document.location.href = "/dashboards";
}

function API(hashValue) {
    console.log('Fetching information.... ');

    var q = "users/self/";
    var url = "https://api.instagram.com/v1/"+q+"?"+hashValue

    function reqListener () {
        var response = JSON.parse(this.responseText);
        
        document.getElementById('status').innerHTML = 'Thanks for logging in, ' + response.data.full_name + '!';
        document.getElementById('dp').src = response.data.profile_picture;
        var p = document.createElement('p');
            p.innerHTML = "USERNAME : "+response.data.username;
        var p1 = document.createElement('p');
            p1.innerHTML = "BIO : "+response.data.bio;
        var p2 = document.createElement('p');
            p2.innerHTML = "FOLLOWED BY : "+response.data.counts.followed_by;
        var p3 = document.createElement('p');
            p3.innerHTML = "FOLLOWINGS : "+response.data.counts.follows;
        document.getElementById('ig_profile').appendChild(p);
        document.getElementById('ig_profile').appendChild(p1);
        document.getElementById('ig_profile').appendChild(p2);
        document.getElementById('ig_profile').appendChild(p3);

        API1(hashValue);
    }

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", url);
    oReq.send();
}

function API1(hashValue){
    var q = "users/self/media/recent/";
    var url = "https://api.instagram.com/v1/"+q+"?"+hashValue

    function reqListener () {
        var response = JSON.parse(this.responseText);
        
        draw(response);
    }

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", url);
    oReq.send();
}

function draw (res){
    for(var i=0; i<5; i++){
        if(res.data[i].type == "image"){
            var imgDesc = res.data[i].caption.text;
            var imgSrc = res.data[i].images.standard_resolution.url;
            var imgLikes = res.data[i].likes.count;
    
            var element = document.createElement("div");
            var img = document.createElement('img');
                img.src = imgSrc;
                img.width = 250;
                img.height = 250;
            var p1 = document.createElement('p');
                p1.innerHTML = imgDesc;
            var p2 = document.createElement('p');
                p2.innerHTML = "LIKES : "+imgLikes;
            var button = document.createElement('button');
                button.id = "btn"+i;
                button.innerHTML = "click to view Analytics";
                button.addEventListener ("click", function() {
                    $('#graph').css('display','block');
                    window.scrollTo(0, document.body.scrollHeight);
                    // idd = this.id;
                    // funcc = $('#graph').clone().css('display','block');
                    // $('#'+idd).parent().closest('div').append(funcc);
                });
            var hr = document.createElement('hr');
            element.appendChild(hr);
            element.appendChild(img);
            element.appendChild(p1);
            element.appendChild(p2);
            element.appendChild(button);
            document.getElementById('thumbnail').appendChild(element);
        }
    }
}


window.onload = function(){
    login();
    //Better to construct options first and then pass it as a parameter
    var options = {
        title: {
          text: "Statistics"
        },
        animationEnabled: true,
        exportEnabled: true,
        data: [
        {
          type: "spline", //change it to line, area, column, pie, etc
          dataPoints: [
            { x: 10, y: 10 },
            { x: 20, y: 12 },
            { x: 30, y: 8 },
            { x: 40, y: 14 },
            { x: 50, y: 6 },
            { x: 60, y: 24 },
            { x: 70, y: -4 },
            { x: 80, y: 10 }
          ]
        }
        ]
    };
    $("#chartContainer").CanvasJSChart(options);
}
// $(document).ready(function(){
//     login();
// });