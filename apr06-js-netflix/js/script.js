(function(){
    getReq('env.json', setEnv);
}());

function getReq(url, cb){
    var req = new XMLHttpRequest();
    req.open('GET', url);
    req.onload = function(){
        if(req.readyState === 4 && req.status === 200){
            console.log(JSON.parse(req.responseText));
            cb(JSON.parse(req.responseText));
        }else{
            console.log('error', req.statusText);
        }
    }
    req.send(null);
}

var myVars;

function setEnv(envs){
    myVars = envVars();
    myVars.set_root_url(envs.root_url);
    myVars.set_img_url(envs.img_url);
    myVars.set_api_key(envs.api_key);
    myVars.set_access_token(envs.access_token);

    var url = myVars.get_root_url()+'search/movie?api_key='+myVars.get_api_key()+'&language=en-US&page=1&query=Jurassic';

    getReq(url, getMovies);
}

function getMovies(movies){
    var main = document.querySelector('main'),
        section = document.createElement('section'),
        h1 = document.createElement('h1'),
        ul = document.createElement('ul'), li, poster_path, div, title, meta, span, stars, star, starIcon, overview;
    main.innerHTML = '';
    h1.textContent = 'Trending Movies';
    section.append(h1, ul);
    main.appendChild(section);

    movies.results.forEach(function(e){

        li = document.createElement('li');
        div = document.createElement('div');
        poster_path = document.createElement('img');
        span = document.createElement('span');
        title = document.createElement('h2');
        vote_average = document.createElement('div');
        overview = document.createElement('p');

        poster_path.src = myVars.get_img_url()+'w500'+e.poster_path;

        title.textContent = e.title;
        vote_average.id = 'stars';
        vote_average.innerHTML =
        '<i class="fa fa-star" aria-hidden="true"></i>'+
        '<i class="fa fa-star" aria-hidden="true"></i>'+
        '<i class="fa fa-star" aria-hidden="true"></i>'+
        '<i class="fa fa-star" aria-hidden="true"></i>'+
        '<i class="fa fa-star" aria-hidden="true"></i>';
        vote_average.style.width = e.vote_average / 2 * 14.85 + 'px';
        span.textContent = e.release_date.split('-').splice(0, 1);
        overview.textContent = e.overview.split('.').splice(0, 1)+'.';

        div.append(title, vote_average, overview);
        li.append(poster_path, div);
        ul.appendChild(li);
    });

    pageSetup();
}

function envVars(){
    var root_url, img_url, api_key, access_token;
    return {
        set_root_url: function(data){
            root_url = data;
        },
        set_img_url: function(data){
            img_url = data;
        },
        set_api_key: function(data){
            api_key = data;
        },
        set_access_token: function(data){
            access_token = data;
        },
        get_root_url: function(){
            return root_url;
        },
        get_img_url: function(){
            return img_url;
        },
        get_api_key: function(){
            return api_key;
        },
        get_access_token: function(){
            return access_token;
        }
    }
}

function pageSetup(){
    var searchForm = document.querySelector('form'),
        search = document.querySelector('form input[type="search"]'),
        searchSubmit = document.querySelector('form input[type="submit"]'),
        searchBtn = document.querySelector('form button');

    searchForm.addEventListener('submit', function(evt){
        evt.preventDefault();
        var userSearch = search.value;
        search.value = '';
        searchForm.className = '';

        var url = myVars.get_root_url()+'search/movie?api_key='+myVars.get_api_key()+'&language=en-US&page=1&query='+userSearch;
        getReq(url, getMovies);
    });

    // searchBtn.addEventListener('click', function(evt){
    //     evt.preventDefault();
    //     searchForm.className = 'search';
    // });

}
