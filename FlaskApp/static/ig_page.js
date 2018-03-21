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
        console.log(response);
        
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
        console.log(response);
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
            var imgComments = res.data[i].comments.count;
            var imgTags = res.data[i].users_in_photo.length;

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
                button.setAttribute('data-graph',JSON.stringify([
                    {"key" : "comments","value" : imgComments},
                    {"key" : "likes","value" : imgLikes},
                    {"key" : "tags","value" : imgTags},
                    {"key" : "shares","value" : 0}
                ]));
                button.innerHTML = "click to view Analytics";
                button.addEventListener ("click", function() {
                    chart.setData(JSON.parse(this.getAttribute('data-graph')));
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
}
// $(document).ready(function(){
//     login();
// });