
(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

window.fbAsyncInit = function() {
    FB.init({
        appId      : '194753134425794', // App ID
        channelURL : '', // Channel File, not required so leave empty
        status     : true, // check login status
        cookie     : true, // enable cookies to allow the server to access the session
        oauth      : true, // enable OAuth 2.0
        xfbml      : false, // parse XFBML
        version    : 'v2.11' // latest version 
    });
    FB.AppEvents.logPageView();
    login();
};

function login(){
    FB.getLoginStatus(function(r){
        console.log(r);
        if(r.status === 'connected'){
            API(r.authResponse);
        }else{
            FB.login(function(response) {
                console.log(response);
                if(response.authResponse) {
                    API(response.authResponse);
                } else {
                // user is not logged in
                document.location.href = "/dashboards";                
                }
            },{ scope: 'email,user_photos,user_friends,user_likes,user_relationships,user_location',
                return_scopes: true 
                }
            );
        }
    });
}

function logout(){
    FB.logout(function(resp) { console.log("logout"); console.log(resp); document.location.href = "/dashboards";});
}

function API(authResponse) {
    console.log('Fetching information.... ');

    var accessToken = authResponse.accessToken;
    var f = 'id,name,picture.height(720).width(720),albums.limit(100){name, photos.limit(100){name, picture,likes.limit(10000), tags.limit(100)}}';
    var url = "https://graph.facebook.com/me?access_token="+accessToken+"&fields="+f

    function reqListener () {
        var response = JSON.parse(this.responseText);
        console.log(response);
        document.getElementById('status').innerHTML = 'Thanks for logging in, ' + response.name + '!';
        document.getElementById('dp').src = response.picture.data.url;
        draw(response);
    }

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", url);
    oReq.send();
}

function draw (res){
    for(var i=0; i<res.albums.data.length; i++){
        if(res.albums.data[i].name == "Profile Pictures"){
            for(var j=0; j<4; j++){
                var imgDesc = res.albums.data[i].photos.data[j].name;
                var imgSrc = res.albums.data[i].photos.data[j].picture;
                var imgLikesArr = res.albums.data[i].photos.data[j].likes.data;

                var element = document.createElement("div");
                var img = document.createElement('img');
                    img.src = imgSrc;
                var p1 = document.createElement('p');
                    p1.innerHTML = imgDesc;
                var button = document.createElement('button');
                    button.id = "btn"+j;
                    button.innerHTML = "click to view Analytics";
                    button.addEventListener ("click", function() {
                        $('#graph').css('display','block');
                    });
                var hr = document.createElement('hr');
                element.appendChild(hr);
                element.appendChild(img);
                element.appendChild(p1);
                element.appendChild(button);
                document.getElementById('thumbnail').appendChild(element);
            }
        }
    }
}

window.onload = function () {
    
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