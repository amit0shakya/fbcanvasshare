module.exports=function(data){

    console.log("imagemaker 1")

    const fs = require('fs');
    const uniqueID = getuniqueid();
    var path = './serverdata/'+uniqueID;

    var promiseResolve;
    var promiseRejection;

    var _promise = new Promise(function(resolve,rejection){
        promiseResolve=resolve;
        promiseRejection=rejection ;
    })

    console.log("imagemaker 2")

    //Make Directory
    fs.mkdir(path, { recursive: true }, (err) => {
        if(err){
            console.log(err,"<<<promise Error 1")
            promiseRejection({msg:err});

            console.log("imagemaker 3 makeDIR")
        }
      });


    //Writing poster
    var poster = data.imgdata.split(';base64,').pop();
        writeImg(poster,(path+"/poster.png"));


    //Writing html
    writeHTML(makeHTML(uniqueID),(path+'/index.html'))

    function writeImg(_data,_imgName){

        console.log("imagemaker 4 write Img")

        fs.writeFile(_imgName,_data,{encoding:'base64'},(err)=>{
            if(err){
                promiseRejection({msg:err});           
            }else{
                promiseResolve({msg:'success',id:uniqueID});
            }
        });
    }

    function writeHTML(_data,_fileName){
        console.log("imagemaker 6 writeHTML")
        fs.writeFile(_fileName,_data,(err)=>{
            if(err){
                console.log(err,"<<<Error")        
            }else{
                console.log("HTML write Success")
            }
        });
    }

    function getuniqueid(){
        var Str1=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','1','2','3','4','5','6','7','8','9','0']
        var uniqueID = ''

        for(var i=0;i<15;i++){
            var randNo = Math.round(Math.random()*(Str1.length-1));
            uniqueID +=Str1[randNo];
        }

        var date = new Date();
        var time = "-"+date.getDate()+"-"+date.getMonth()+"-"+date.getFullYear()+"-"+date.getHours()+"-"+date.getSeconds()+"-"+date.getMilliseconds();
            uniqueID+=time;
        
        return uniqueID
    }


    function makeHTML(id){

        var domain = `fbcanvasshare.herokuapp.com`;
        var linkURL = `https://${domain}/project/`;
        var previewURL= `https://${domain}/serverdata/${id}/`;
        var imageURL  = `https://${domain}/serverdata/${id}/poster.png`;
        var encodedURL= `https%3A%2F%2F${domain}%2Fserverdata%2F${id}%2F`;
        var title = `This is so cool`; 
        var desc = `I made it using the great sharing tool, drawn it by hand. Can you do it best.`; 
        
        var html=`  
                    <html>
                    <head>
                    <title>${title}</title>

                    <meta property="fb:app_id"        content="576379196100963" />
                    <meta property="og:site_name"     content="${domain}" />
                    <meta property="og:url"           content="${previewURL}" />
                    <meta property="og:type"          content="website" />
                    <meta property="og:title"         content="${title}" />
                    <meta property="og:description"   content="${desc}" />
                    <meta property="og:image"         content="${imageURL}" />
                    <meta property="og:image:secure_url"content="${imageURL}" />
                    <meta property="og:image:url"     content="${imageURL}" />
                    <meta property="og:image:type"    content="image/png" />
                    <meta property="og:image:width"   content="600" />
                    <meta property="og:image:height"  content="315" />                    
                    <meta name="robots"               content="all" />
                    <meta http-equiv="Cache-control"  content="public" />

                    </head>

                    <style>
                            body { 
                                border:1px solid #000; 
                                box-sizing: border-box; 
                                margin: 10px; 
                                padding: 10px;
                            }
                            wrapper {
                                margin: 0 auto;
                                max-width:1024px;
                            }
                            p { display: block; }
                            img {
                                margin:10px auto; 
                                padding:0px;                                 
                            }
                    </style>

                    <body>
                    
                    <div id="fb-root"></div>
                      
                    <h2>Below Image is Needs to be share on Facebook, via facebook Page Share</h2>
                    <br>
                    <img src="poster.png">
                    <br>
                    <div class="fb-share-button" data-href="${previewURL}" data-layout="button_count" data-size="small" data-mobile-iframe="true">
                    <a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=${encodedURL}&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore">Share</a></div>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <a target="_blank" href="${linkURL}" class="fb-xfbml-parse-ignore">CREATE YOUR OWN</a>
                    </div>

                    <script>
                        window.fbAsyncInit = function() {
                        FB.init({
                            appId      : '576379196100963',
                            cookie     : true,
                            xfbml      : true,
                            version    : 'v3.2'
                        });
            
                        FB.AppEvents.logPageView();   
            
                        FB.getLoginStatus(function(response) {
                            if (response.status === 'connected') {
                                console.log('Logged in.');
                            }
                            else {
                                FB.login();
                            }
                        });
                        };
                    
                        function myFacebookLogin() {
                            FB.login(function(){}, {scope: 'publish_actions'});
                        }

                        (function(d, s, id) {
                            var js, fjs = d.getElementsByTagName(s)[0];
                            if (d.getElementById(id)) return;
                            js = d.createElement(s); js.id = id;
                            js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.2&appId=576379196100963&autoLogAppEvents=1';
                            fjs.parentNode.insertBefore(js, fjs);
                            }(document, 'script', 'facebook-jssdk'));
                      </script>
                  </body>
              
              </html>`

              return html;

    }           

    return _promise
}