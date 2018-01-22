
function fbClicked(){
    // $.ajax({
    //     url: "http://localhost:5000/signin",
    //     method:'get',
    //     crossDomain: true,
    //     xhrFields: { withCredentials: true },
    //     success:function(res){
    //         console.log(res);
    //     }
    // });
    document.location.href = "/fb_page";
};

function igClicked(){
    document.location.href = "https://api.instagram.com/oauth/authorize/?client_id=bc73f0fe68e7459fb64e268d4174181f&redirect_uri=http://localhost:5000/ig_page&response_type=token";
};