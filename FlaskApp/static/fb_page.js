
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
    }

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", url);
    oReq.send();
}

// window.onload = function () {
//     login();
// }
$(document).ready(function(){
    //login();
    setTimeout(function(){
        $("#hit").click();
    },1000);
});
