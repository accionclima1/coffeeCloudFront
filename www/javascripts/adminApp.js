var app = angular.module('coffeeScriptAdmin', ['btford.socket-io','ui.router','luegg.directives','ui.tinymce']);

// Main controller 
app.controller('MainCtrl',['$scope', 'auth',
function($scope, auth){
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.currentUser = auth.currentUser;
	$scope.logOut = auth.logOut;
	
	if ($scope.isLoggedIn()) {
		$('body').removeClass('loggedOff');
		$('body').addClass('loggedIn');
	} else {
		$('body').removeClass('loggedin');
		$('body').addClass('loggedOff');
	}
}]);

// Authorize controller
app.controller('AuthCtrl', [
'$scope',
'$state',
'auth',
function($scope, $state, auth){
  $scope.user = {};

  $scope.register = function(){
    auth.register($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('register-profile');
    });
  };

  $scope.registerProfile = function(){
      $state.go('location');
  };

  $scope.logIn = function(){
    auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };
}]);

app.factory('posts', ['$http', 'auth', function($http, auth){
	  var o = {
	  		posts : []
	  };
	  o.getAll = function() {
	    return $http.get('/posts').success(function(data){
	      angular.copy(data, o.posts);
	    });
	  };
	  o.create = function(post) {
		  return $http.post('/posts', post, {
    headers: {Authorization: 'Bearer '+auth.getToken()}
  }).success(function(data){
		    o.posts.push(data);
		  });
		};
		o.upvote = function(post) {
		  return $http.put('/posts/' + post._id + '/upvote', null, {
    headers: {Authorization: 'Bearer '+auth.getToken()}
  })
		    .success(function(data){
		      post.upvotes += 1;
		    });
		};
		o.get = function(id) {
		  return $http.get('/posts/' + id).then(function(res){
		    return res.data;
		  });
		};
		o.addComment = function(id, comment) {
		  return $http.post('/posts/' + id + '/comments', comment, {
		    headers: {Authorization: 'Bearer '+auth.getToken()}
		  });
		};
		o.upvoteComment = function(post, comment) {
		  return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote', null, {
    headers: {Authorization: 'Bearer '+auth.getToken()}
  })
		    .success(function(data){
		      comment.upvotes += 1;
		    });
		};
  return o;
}]);

// Socket Factory service
app.factory('socket', ['socketFactory',
    function(socketFactory) {
        return socketFactory({
            prefix: '',
            ioSocket: io.connect('http://localhost:3000')
        });
    }
]);

//authorize service
app.factory('auth', ['$http', '$window', function($http, $window){
   var auth = {};

   auth.saveToken = function (token){
	  $window.localStorage['flapper-news-token'] = token;
	};

	auth.getToken = function (){
	  return $window.localStorage['flapper-news-token'];
	}

	auth.isLoggedIn = function(){
	  var token = auth.getToken();

	  if(token){
	    var payload = JSON.parse($window.atob(token.split('.')[1]));

	    return payload.exp > Date.now() / 1000;
	  } else {
	    return false;
	  }
	};

	auth.currentUser = function(){
	  if(auth.isLoggedIn()){
	    var token = auth.getToken();
	    var payload = JSON.parse($window.atob(token.split('.')[1]));

	    return payload.username;
	  }
	};

	auth.register = function(user){
	  return $http.post('/register', user).success(function(data){
	    auth.saveToken(data.token);
	  });
	};

	auth.logIn = function(user){
	  return $http.post('/login', user).success(function(data){
	    auth.saveToken(data.token);
	  });
	};
	auth.logOut = function(){
	  $window.localStorage.removeItem('flapper-news-token');
	  $state.go('home');
	};

  return auth;
}]);

//nav bar controller
app.controller('NavCtrl', [
'$scope',
'auth',
'$location',
function($scope, auth, $location){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
  $scope.isActive = function (viewLocation) {
     var active = (viewLocation === $location.path());
     return active;
	};
}]);

//adaptation controller
app.controller('AdaptacionCtrl', [
'$scope',
'auth',
'$location',
'methods',
function($scope, auth, $location, methods){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
  $scope.isActive = function (viewLocation) {
     var active = (viewLocation === $location.path());
     return active;
	};
  var tableObject = {};
  	
  	methods.get().then(function(methods){ 
	  	//console.log(methods.data[0]);
	  	tableObject = methods.data[0];
	  	$scope.table = tableObject;
  	})
  
	
	
	$scope.saveTable = function() {
			methods.update($scope.table);
			
	};
	
}]);

//USers editor controller
app.controller('UsersCtrl', [
'$scope',
'auth',
'$location',
'user',
function($scope, auth, $location, user){
  muni14.addDepts('departamentos');
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
  $scope.isActive = function (viewLocation) {
     var active = (viewLocation === $location.path());
     return active;
	};
	user.getAll().then(function(users) {
		$scope.userList = users;
	});
  $scope.newUser = {};
  
  $scope.createUser = function() {
	  $scope.newUser.departamento = $("#departamentos option:selected").text();
	  $scope.newUser.municipio = $("#departamentos-munis option:selected").text();
	  
	  console.log($scope.newUser);  
  }
  
  $scope.removeUser = function(id,index) {
		
		user.delete(id).then(function(user){
				$scope.userList.splice(index, 1);
			});		
	}
  
   
}]);

//NewsCtrl editor controller
app.controller('NewsCtrl', [
'$scope',
'auth',
'$location',
'user',
'posts',
function($scope, auth, $location, user, posts){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.tinymceOptions = {
    plugins: 'link image code',
    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code | image'
  };
  $scope.newPost = {
	  title: "",
	  content: ""
  };
  $scope.posts = posts.posts;
  console.log(posts.posts);
  $scope.publish = function() {
	  posts.create($scope.newPost)
	  $scope.newPost = {
		  title: "",
		  content: ""
	  };
  }
   
}]);

// Support Chat Controller 
app.controller('MessengerCtrl',['$scope','chats','auth', 'socket',
function($scope, chats, auth, socket){
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.currentUser = auth.currentUser;
	$scope.chats = chats.chats;
	var f = $('.type-sink');
	var currentInput = $('.type-sink input[name=toId]');
	var currentchat = currentInput.val();
	$scope.currentChat = currentchat;
	
	$scope.sendMessage = function() {
        var msg = f.find('[name=chatMsg]').val();
        var from_id = f.find('[name=fromId]').val();
        var to_id = f.find('[name=toId]').val();
		var data_server={
            message:msg,
            to_user:to_id,
            from_id:from_id
        };
        //console.log(data_server);
        socket.emit('get msg',data_server);
         $('.type-sink .form-control').val("");
	};
	$scope.loadChat = function($event,sender) {
		//$('.chat-item').removeClass('active');
		//var target = $event.currentTarget;
		//$(target).addClass('active');
		$scope.currentChat = sender;
		currentInput.val(sender);
		var data_server = {
		    from_id : sender
	    }
	    //console.log(data_server);
	    socket.emit('load msg',data_server);
	}
	socket.on('set msg',function(data){
        data=JSON.parse(data);
        var usera = data.to_user;
        var userb = data.from_id;
        currentchat = currentInput.val();
        if (usera == currentchat || userb == currentchat) {
	        $scope.chatLog = data.chat.messages;
	        $scope.$apply();
	    }
    });
    socket.on('set msg only',function(data){
        data=JSON.parse(data);
        $scope.chatLog = data.messages;
        $scope.$apply();
    });
    $scope.deleteChat = function(chatid) {
	    var data_server = {
		    chatid : chatid
	    }
	    //console.log(data_server);
	    socket.emit('dlt chat',data_server);
    }
    socket.on('push chats',function(data){
        data=JSON.parse(data);
        //console.log(data);
        $scope.chats = data;
        $scope.$apply();
    });
}]);

//chats service
app.factory('chats', ['$http', 'auth', function($http, auth){
	  var o = {
	  		chats : []
	  };
	  o.getAll = function() {
	    return $http.get('/admin/chats').success(function(data){
	      angular.copy(data, o.chats);
	    });
	  };
		
  return o;
}]);
// User profile service
app.factory('user', ['$http', 'auth', function($http, auth){
	  var o = {
	  };
	  /*o.create = function(post) {
		  return $http.post('/posts', post, {
    headers: {Authorization: 'Bearer '+auth.getToken()}
  }).success(function(data){
		    o.posts.push(data);
		  });
		};*/
		o.getAll = function() {
		  return $http.get('/users', {
    headers: {Authorization: 'Bearer '+auth.getToken()}
  }).then(function(res){
		    return res.data;
		  });
		};
		o.get = function(id) {
		  return $http.get('/users/' + id).then(function(res){
		    return res.data;
		  });
		};
		
		o.update = function(user){
			  return $http.put('/users/' + user._id, user, {
		    headers: {Authorization: 'Bearer '+auth.getToken()}
		  }).success(function(data){
			    return data
			  });
			};
		o.delete = function(user){
			  return $http.delete('/users/' + user, {
		    headers: {Authorization: 'Bearer '+auth.getToken()}
		  }).success(function(data){
			    return data
			  });
			};
	
		
  return o;
}]);

app.factory('methods', ['$http', 'auth', function($http, auth){
	  var o = {
	  		chats : []
	  };
	  o.get = function() {
	    return $http.get('/admin/methods/').success(function(data){
	      return data;
	    });
	  };
	  o.create = function(method) {
		  return $http.post('/admin/methods', method, {
    headers: {Authorization: 'Bearer '+auth.getToken()}
  }).success(function(data){
		    return data;
		  });
		};
		o.update = function(method) {
		  return $http.put('/admin/methods', method, {
    headers: {Authorization: 'Bearer '+auth.getToken()}
  }).success(function(data){
		    return data;
		  });
		};
		
  return o;
}]);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
      onEnter: ['$state', 'auth', function($state, auth){
	     var curUser = auth.currentUser();
	    if(!auth.isLoggedIn()){
	      $state.go('login');
	    } else if(curUser != 'admin' && curUser != 'administrador') {
		   window.location.href = '/'; 
	    }
	  }]
    })
    .state('login', {
	  url: '/login',
	  templateUrl: '/login.html',
	  controller: 'AuthCtrl',
	  onEnter: ['$state', 'auth', function($state, auth){
	    if(auth.isLoggedIn()){
	      $state.go('home');
	    }
	  }]
	})
	.state('register', {
	  url: '/register',
	  templateUrl: '/register.html',
	  controller: 'AuthCtrl',
	  onEnter: ['$state', 'auth', function($state, auth){
	    if(auth.isLoggedIn()){
	      $state.go('home');
	    }
	  }]
	})
	.state('messenger', {
	  url: '/messenger',
	  templateUrl: '/messenger.html',
	  controller: 'MessengerCtrl',
	  onEnter: ['$state', 'auth', function($state, auth){
	    if(!auth.isLoggedIn()){
	      $state.go('login');
	    }
	  }],
	  resolve: {
	    chatPromise: ['chats', function(chats){
	      return chats.getAll();
	    }]
  	   }
	})
	.state('adaptacion', {
	  url: '/adaptacion',
	  templateUrl: '/adaptacion.html',
	  controller: 'AdaptacionCtrl',
	  onEnter: ['$state', 'auth', function($state, auth){
	    if(!auth.isLoggedIn()){
	      $state.go('login');
	    }
	  }]
	})
	.state('users', {
	  url: '/users',
	  templateUrl: '/users.html',
	  controller: 'UsersCtrl',
	  onEnter: ['$state', 'auth', function($state, auth){
	    if(!auth.isLoggedIn()){
	      $state.go('login');
	    }
	  }]
	})
	.state('noticias', {
	  url: '/noticias',
	  templateUrl: '/noticias.html',
	  controller: 'NewsCtrl',
	  onEnter: ['$state', 'auth', function($state, auth){
	    if(!auth.isLoggedIn()){
	      $state.go('login');
	    }
	  }],
	  resolve: {
	    postPromise: ['posts', function(posts){
	      return posts.getAll();
	    }]
  	   }
	});

  $urlRouterProvider.otherwise('home');
}]);