window.fbAsyncInit = function() {
  FB.init({
    appId      : '412375039632627',
    cookie     : true,
    xfbml      : true,
    version    : 'v4.0'
  });

  FB.AppEvents.logPageView();
};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "https://connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));


 const fb_login = document.getElementById("fb_login");
 fb_login.addEventListener("click", facebook_login);

 const fb_refresh = document.getElementById("fb_refresh");
 fb_refresh.addEventListener("click", facebook_check_state);

 const fb_logout = document.getElementById("fb_logout");
 fb_logout.addEventListener("click", facebook_logout);

 const insta_login = document.getElementById("insta_login");
 insta_login.addEventListener("click", login_insta);

function facebook_login() {
  FB.login(function(response) {
    console.log(response);
    if (response.status === 'connected') {
      // Logged into your webpage and Facebook.
      const user_id = response.authResponse.userID;
      get_friends(user_id);
    } else {
      // The person is not logged into your webpage or we are unable to tell.
      console.log("not logged in");
    }
  }, {scope: 'user_friends,instagram_basic,pages_show_list,manage_pages,instagram_manage_insights'});
};

function facebook_check_state() {
  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      // Logged into your webpage and Facebook.
      const user_id = response.authResponse.userID;
      get_friends(user_id);
    }
  });
}

function facebook_logout () {
  FB.logout(function(response) {
   // Person is now logged out
   console.log(response);
  });
}

function get_friends(user_id) {
    // Get the friend count. Cannot get friend username unless the friend has authorised also.
    FB.api(
      `/${ user_id }/friends`,
      'GET',
      {},
      function(response) {
          // Insert your code here
          console.log(response.summary.total_count);
          init(response.summary.total_count);
      }
    );
  }


function login_insta () {
  const redirect_uri = "https://www.instagram.com/oauth/authorize/?client_id=8e229cc661c045f7939c2bb3f213bde9&redirect_uri=https://d06fc150.ngrok.io/instagram_auth.html&response_type=code";

  let authWindow = window.open(redirect_uri, 'authWindow');
}

// this is fired from instagram_auth.html
function onInstagramAuth(code)
{
  // Handle however you would like here
  console.log('authenticated ', code);

  // Authenticate Instagram

  // post to https://api.instagram.com/oauth/access_token
  const tokenURL = "https://api.instagram.com/oauth/access_token";
  const redirect_uri = "https://www.instagram.com/oauth/authorize/?client_id=8e229cc661c045f7939c2bb3f213bde9&redirect_uri=https://d06fc150.ngrok.io/instagram_auth.html&response_type=code";

  // curl -F 'client_id=CLIENT_ID' \
  //   -F 'client_secret=CLIENT_SECRET' \
  //   -F 'grant_type=authorization_code' \
  //   -F 'redirect_uri=AUTHORIZATION_REDIRECT_URI' \
  //   -F 'code=CODE' \

  console.log((JSON.stringify({
      client_id: '8e229cc661c045f7939c2bb3f213bde9',
      client_secret: '6a63acdbf7be43b28d3085a0ff2cd974',
      grant_type: 'authorization_code',
      redirect_uri: redirect_uri,
      code: code
  })));

  const formData = `client_id=8e229cc661c045f7939c2bb3f213bde9` +
  `&client_secret=6a63acdbf7be43b28d3085a0ff2cd974` +
  `&grant_type=authorization_code` +
  `&redirect_uri=${redirect_uri}` +
  `&code=${code}`;

  const xhr = new XMLHttpRequest();
  xhr.open("POST", tokenURL, true);
  // because instagrams API requests form data, you must use the following format: application/x-www-form-urlencoded"
  // and the formData must be in the format key=value&key=value

  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded"');
  xhr.send(formData);


  // this is returning a CORS error.
  // Need to use JSONP to get this working.
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE) {
      console.log(xhr.response);
    }
  }
}
