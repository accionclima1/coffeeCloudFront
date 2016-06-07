var app = angular.module('coffeeScript', ['btford.socket-io','ui.router','snap','luegg.directives','LocalStorageModule','ngSanitize']);

app.config(['localStorageServiceProvider', function(localStorageServiceProvider){
  localStorageServiceProvider.setPrefix('ls');
}])

// Socket Factory service
app.factory('socket', ['socketFactory',
    function(socketFactory) {
        return socketFactory({
            prefix: '',
            ioSocket: io.connect('http://ec2-54-68-110-187.us-west-2.compute.amazonaws.com:3000')
        });
    }
]);

app.controller('MainCtrl',['$scope','posts', 'auth',
function($scope, posts, auth){
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.currentUser = auth.currentUser;
	$scope.posts = posts.posts;
  	$scope.addPost = function(){
	  	if(!$scope.title || $scope.title === '') { return; }
		posts.create({
		    title: $scope.title,
		    link: $scope.link,
		  });
		$scope.title = '';
		$scope.link = '';
	};
	$scope.incrementUpvotes = function(post) {
	  posts.upvote(post);
	};
	
}]);
app.controller('PostsCtrl', [
'$scope',
'posts',
'post',
'auth',
function($scope, posts, post, auth){
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.post = post;
		$scope.addComment = function(){
			  if($scope.body === '') { return; }
			  posts.addComment(post._id, {
			    body: $scope.body,
			    author: 'user',
			  }).success(function(comment) {
			    $scope.post.comments.push(comment);
			  $scope.body = '';
			});
		};
		$scope.incrementUpvotes = function(comment){
		  posts.upvoteComment(post, comment);
		};

}]);
//Authorize Controller
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

//Units Controller
app.controller('UnitCtrl', [
'$scope',
'$state',
'unit',
'auth',
function($scope, $state, unit, auth){
  $scope.unit = {
	  sombra: true,
	  muestreo: true,
	  fertilizaSuelo: true,
	  fertilizaFollaje: true,
	  enmiendasSuelo: true,
	  manejoTejido: true,
	  fungicidasRoya: true,
	  verificaAgua: true,
	  variedad: {
	  		caturra: false,
			bourbon: false,
			catuai: false,
			maragogype: false		  
	  },
	  fungicidas: {
		  contacto: true,
	  	  bourbon: false,
	  	  catuai: false
		  
	  },
	  verificaAguaTipo: {
		  ph: true,
		  dureza: false
	  },
	  tipoCafe: {
		  estrictamenteDuro: true,
		  duro: false,
		  semiduro: false,
		  prime: false,
		  extraprime: false
	  }
	  		
  };
  $( ".date-field" ).datepicker();
  $scope.saveUnit = function(){
	$scope.unit.departamento = $("#departamentos option:selected").text();
	$scope.unit.municipio = $("#departamentos-munis option:selected").text();
	
    unit.create($scope.unit,auth.userId()).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };
  
  muni14.addDepts('departamentos');
  
}]);

app.controller('NavCtrl', [
'$scope',
'auth',
function($scope, auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
  $scope.isActive = function (viewLocation) {
     var active = (viewLocation === $location.path());
     return active;
	};
}]);

app.controller('NewsCtrl', [
'$scope',
'auth',
'$filter',
'$sce',
'posts',
function($scope, auth, $filter, $sce, posts){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.currentPage = 0;
  $scope.pageSize = 9;
  $scope.data = posts.posts;
  $scope.q = '';
  console.log(posts);
  $scope.getData = function () {
      return $filter('filter')($scope.data, $scope.q)
     
    }
    
    $scope.numberOfPages=function(){
        return Math.ceil($scope.getData().length/$scope.pageSize);                
    }
   
 
}]);

app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

app.controller('LocationCtrl', [
'$scope',
'$state',
'auth',
function($scope, $state, auth){
  $scope.testLocation = function() {
  	$('body').removeClass('modal-open');
  	$('.modal-backdrop').removeClass('modal-backdrop');
  	$state.go('home');
  }
}]);

app.controller('RoyaCtrl', [
'$scope',
'$state',
'auth',
'localStorageService',
'socket',
'unit',
'user',
'methods',
'roya',
function($scope, $state, auth, localStorageService, socket, unit, user, methods, roya){
  $scope.currentUser = auth.currentUser;
  var currentId = auth.currentUser();
  var testInStore = localStorageService.get('localTest');
  var plantEditor = function(plant) {
	  $scope.plantname = plant;
	  $scope.leafList = $scope.test.plantas[plant - 1];
	  //console.log($scope.leafList);
	  $('.plant-editor').addClass('active');
  };
  $scope.affect = 1;
  user.get(auth.userId()).then(function(user){
		 $scope.units = user.units;
    });
    
     $scope.test = testInStore || {
	  	advMode : false,
	  	bandolas : false,
	  	resolved: false,
	  	user : currentId,
	  	plantas: [],
	  	unidad: {},
	  	incidencia: 0,
	  	avgplnt : "",
		avgplntDmgPct : 0,
		incidencia : 0
	  };
	methods.get().then(function(methods){
		 var meth = methods.data[0];
		 var date = new Date();
		 var currentMonth = date.getMonth();
		if(currentMonth < 6 ){
		   var methodsAvail = {};
		   methodsAvail.grade1 = meth.caseInidence10.abrilJunio;
		   methodsAvail.grade2 = meth.caseInidence1120.abrilJunio;
		   methodsAvail.grade3 = meth.caseInidence2150.abrilJunio;
		   methodsAvail.grade4 = meth.caseInidence50.abrilJunio;
		   $scope.methodsMonth = methodsAvail;
		   
		} else if(currentMonth > 5 && currentMonth < 9) {
		   var methodsAvail = {};
		   methodsAvail.grade1 = meth.caseInidence10.julioSetiembre;
		   methodsAvail.grade2 = meth.caseInidence1120.julioSetiembre;
		   methodsAvail.grade3 = meth.caseInidence2150.julioSetiembre;
		   methodsAvail.grade4 = meth.caseInidence50.julioSetiembre;
		   $scope.methodsMonth = methodsAvail;
		} else if(currentMonth > 8) {
		   var methodsAvail = {};
		   methodsAvail.grade1 = meth.caseInidence10.octubreDiciembre;
		   methodsAvail.grade2 = meth.caseInidence1120.octubreDiciembre;
		   methodsAvail.grade3 = meth.caseInidence2150.octubreDiciembre;
		   methodsAvail.grade4 = meth.caseInidence50.octubreDiciembre;
		   $scope.methodsMonth = methodsAvail;
		}
    });

  
   $scope.$watch('test', function () {
      localStorageService.set('localTest', $scope.test);
    }, true);
 
  
  if(testInStore && Object.keys(testInStore.unidad).length > 1) {
	  $('.roya-wrap').addClass('initiated');
  }
  
  if(testInStore && testInStore.resolved) {
	  $('.test').hide();
	  $('.results').show();
  }
	
  $scope.startTest = function(selectedUnit) {
	  $scope.test.unidad = selectedUnit;
	  $('.roya-wrap').addClass('initiated');
   }
   $scope.bandolas = function() {
	   if($scope.test.bandolas) {
		  $scope.test.bandolas = false;
	  } else {
		  $scope.test.bandolas = true;
	  }
	}
	$scope.addPlant = function() {
		$scope.test.plantas.push([]);
		var plantName = $scope.test.plantas.length;
		plantEditor(plantName);
	};
	
	$scope.editPlant = function($index) {
		plantEditor($index + 1);
		$scope.leafList = $scope.test.plantas[$index];
	}
	
	$scope.initLeaf = function() {
		$('.severity-list').addClass('active');
	}
	
	$scope.closePlant = function() {
		$('.plant-editor').removeClass('active');
	}
	
	$scope.addLeaf = function(severity) {
		var amount = $('[name=amount]').val();
		var plantIndex = $scope.plantname - 1;
		$scope.test.plantas[plantIndex].push([amount,severity]);
		$scope.leafList = $scope.test.plantas[plantIndex];
		$('[name=amount]').val(1);
		$scope.affect = 1;
		$('.severity-list').removeClass('active');
	};

    $scope.removePlant = function (index) {
      $scope.test.plantas.splice(index, 1);
    };
    
    $scope.removeLeaf = function (index) {
	  var plantIndex = $scope.plantname - 1;
      $scope.test.plantas[plantIndex].splice(index, 1);
    };  
    
    $scope.calculateTest = function() {
	    
	    if ($scope.test.advMode) {
		    $scope.totalPlants = $scope.test.plantas.length;
			var totalPlantitas = $scope.totalPlants;	
			var totalLeaf = 0;
			var totalIncidencePlant = [];
			var totalDamagePlant = [];
			var avgInc = 0;
			var avgPct = 0;
			
			for(var i = 0, len = $scope.totalPlants; i < len; i++) {
				var affected = 0;
				var avgDmg = 0;
				var Dmg = [];
				$.each($scope.test.plantas[i], function( index, value ) {
					  totalLeaf += parseInt(value[0]);
					  	if (value[1] !='0%') {
						   affected += parseInt(value[0]);
						   Dmg.push(parseInt(value[1]));
					  	} 
				});	
				totalIncidencePlant.push(affected);
				$.each(Dmg, function( index, value ) {
					  
					  avgDmg += parseInt(Dmg[index]);
				});
				var curAvgDmg = avgDmg / Dmg.length;
				totalDamagePlant.push(curAvgDmg);
				
			}
			var incidenceLength = totalIncidencePlant.length;
			for(var i = 0; i < incidenceLength; i++) {
			    avgInc += totalIncidencePlant[i];
			}
			var avg = avgInc / incidenceLength;
			var damageLength = totalDamagePlant.length;
			for(var i = 0; i < damageLength; i++) {
			    avgPct += totalDamagePlant[i];
			}
			var avgDmgPct = avgPct / damageLength;
			$scope.avgIncidence = (avgInc/totalLeaf)*100;
			$scope.test.avgplnt = avg;
			$scope.test.avgplntDmgPct = avgDmgPct;
			$scope.test.resolved = true;
			$scope.test.incidencia = $scope.avgIncidence;
			$('.test').hide();
			$('.results').show();
	    } else {
		   
		  
		   var plants = $scope.test.plantas,
		   	   totalPlants = plants.length,
		   	   affectedLeaf = [];
		   	   affectedTotal = 0;
		   	   allLeaf = [];
		   	   totalLeaf = 0;
		   	    $scope.totalPlantis = plants.length;
		   
		   	   $.each($scope.test.plantas, function( index, value ) {	
			   		var count = value[0][1].split(":"),
			   			affectedCnt = parseInt(count[1]);
			   			affectedLeaf.push(affectedCnt);
				});
				
				$.each($scope.test.plantas, function( index, value ) {	
			   		var totalCnt = parseInt(value[0][0]);
			   			allLeaf.push(totalCnt);
				});
				
			   for(var i = 0; i < affectedLeaf.length; i++) {
				    affectedTotal += affectedLeaf[i];
				}
				
				for(var i = 0; i < allLeaf.length; i++) {
					
				    totalLeaf += parseInt(allLeaf[i]);
				}
				
			   var avgAffected = affectedTotal / affectedLeaf.length,
			       avgLeaf = totalLeaf / totalPlants,
			       percent = (avgAffected/avgLeaf)*100;
			       
			   $scope.test.incidencia = percent;
			   $scope.test.resolved = true;
			   $('.test').hide();
			   $('.results').show();
			  
		   
	    }
		
		
    };
    
    $scope.getHelp = function(plants,incidence,damage,currentUser) { 
	    var msg = 'Calculo De Roya: Plantas ' + plants + ', Incidencia ' + incidence + ', Severidad ' + damage ;
	  	 var data_server={
            message:msg,
            to_user:'admin',
            from_id:currentUser
        };
        socket.emit('get msg',data_server);
        
        roya.create(testInStore).success(function(){
	        localStorageService.remove('localTest');
        });
        
    };
    
}]);

app.controller('WeatherCtrl', [
'$scope',
'$state',
'auth',
function($scope, $state, auth){
  $scope.currentUser = auth.currentUser;
}]);

// Support Chat Controller 
app.controller('SupportCtrl',['$scope','auth', 'socket',
function($scope, auth, socket){
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.currentUser = auth.currentUser;
	$scope.loggedUser = auth.currentUser();
	$scope.sendMessage = function() {
		var f = $('.type-sink');
        var msg = f.find('[name=chatMsg]').val();
        var from_id = f.find('[name=fromId]').val();
		var data_server={
            message:msg,
            to_user:'admin',
            from_id:from_id
        };
        socket.emit('get msg',data_server);
        $('.type-sink .form-control').val("");
	};
	socket.on('set msg only',function(data){
        data=JSON.parse(data);
        var user = data.sender;
        if (user == $scope.loggedUser) {
	        $scope.chatLog = data.messages;
	        $scope.$apply();
	    }
    });
	socket.on('set msg',function(data){
        data=JSON.parse(data);
        var usera = data.to_user;
        var userb = data.from_id;
        if (usera == $scope.loggedUser || userb == $scope.loggedUser) {
	        $scope.chatLog = data.chat.messages;
			$scope.$apply();
        }
        
    });

	
	//socket.on('greeting', function(greeting) {
	  //  console.log(greeting);
	//});
}]);

app.controller('ProfileCtrl',['$http','$scope', 'auth', 'unit', 'user',
function($http, $scope, auth, unit, user){
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.currentUser = auth.currentUser;
	$scope.userId = auth.userId;
	$scope.user_Ided = auth.userId();
	var userO = {};
	$scope.newUnit = {
	  sombra: true,
	  muestreo: true,
	  fertilizaSuelo: true,
	  fertilizaFollaje: true,
	  enmiendasSuelo: true,
	  manejoTejido: true,
	  fungicidasRoya: true,
	  verificaAgua: true,
	  variedad: {
	  		caturra: false,
			bourbon: false,
			catuai: false,
			maragogype: false		  
	  },
	  fungicidas: {
		  contacto: true,
	  	  bourbon: false,
	  	  catuai: false
		  
	  },
	  verificaAguaTipo: {
		  ph: true,
		  dureza: false
	  },
	  tipoCafe: {
		  estrictamenteDuro: true,
		  duro: false,
		  semiduro: false,
		  prime: false,
		  extraprime: false
		  }
	};
	$scope.editUnit = {};
	user.get($scope.user_Ided).then(function(user){
		 $scope.userO = user;
		 $scope.units = $scope.userO.units;
    });
    $( ".date-field" ).datepicker();
     $scope.update = function(){
    user.update($scope.userO).error(function(error){
	      $scope.error = error;
	    }).then(function(data){
	      $scope.message = data.data.message;
	    });
	  };
	$scope.deleteUnit = function(e,id,index) {
		
		unit.deleteUnit(id, auth.userId()).then(function(user){
				$scope.userO.units.splice(index, 1);
				$scope.userO.units
			});		
	}
	
	$scope.updateUnit = function(e,id) {
		
		$scope.sucMsg = null;
		unit.get(auth.userId(),id).then(function(unitD){
			$scope.editUnit = unitD;
			$scope.updateUnitForm = function(){
				if ($scope.updateunitForm.$valid) {
					unit.update(id, auth.userId(), $scope.editUnit).then(function(unitN){
						user.get($scope.user_Ided).then(function(user){
							 $scope.userO = user;
							 $scope.units = $scope.userO.units;
					    });
						$scope.editUnit = unitN.data;
						$scope.sucMsg = '¡Unidad Actualizada exitosamente!';
					});
				}
			}
		});
	}
	
	$scope.saveUnit = function(){
		if ($scope.newunitForm.$valid) {
			
		$scope.newUnit.departamento = $("#departamentos option:selected").text();
		$scope.newUnit.municipio = $("#departamentos-munis option:selected").text();
		
	    unit.create($scope.newUnit,auth.userId()).error(function(error){
	      $scope.error = error;
	    }).then(function(data){
				$scope.userO.units.push(data.data);
				$('#myModal2').modal('hide');
				$scope.newUnit = {
				  sombra: true,
				  muestreo: true,
				  fertilizaSuelo: true,
				  fertilizaFollaje: true,
				  enmiendasSuelo: true,
				  manejoTejido: true,
				  fungicidasRoya: true,
				  verificaAgua: true,
				  variedad: {
				  		caturra: false,
						bourbon: false,
						catuai: false,
						maragogype: false		  
				  },
				  fungicidas: {
					  contacto: true,
				  	  bourbon: false,
				  	  catuai: false
					  
				  },
				  verificaAguaTipo: {
					  ph: true,
					  dureza: false
				  },
				  tipoCafe: {
					  estrictamenteDuro: true,
					  duro: false,
					  semiduro: false,
					  prime: false,
					  extraprime: false
					  }
				}
		    });
			
		}
		
	  };
  
     muni14.addDepts('departamentos');
}]);

app.factory('posts', ['$http', 'auth', function($http, auth){
	  var o = {
	  		posts : []
	  };
	  o.getAll = function() {
	    return $http.get('http://ec2-54-68-110-187.us-west-2.compute.amazonaws.com:3000/posts').success(function(data){
	      angular.copy(data, o.posts);
	    });
	  };
	  o.create = function(post) {
		  return $http.post('http://ec2-54-68-110-187.us-west-2.compute.amazonaws.com:3000/posts', post, {
    headers: {Authorization: 'Bearer '+auth.getToken()}
  }).success(function(data){
		    o.posts.push(data);
		  });
		};
		o.upvote = function(post) {
		  return $http.put('http://ec2-54-68-110-187.us-west-2.compute.amazonaws.com:3000/posts/' + post._id + '/upvote', null, {
    headers: {Authorization: 'Bearer '+auth.getToken()}
  })
		    .success(function(data){
		      post.upvotes += 1;
		    });
		};
		o.get = function(id) {
		  return $http.get('http://ec2-54-68-110-187.us-west-2.compute.amazonaws.com:3000/posts/' + id).then(function(res){
		    return res.data;
		  });
		};
		o.addComment = function(id, comment) {
		  return $http.post('http://ec2-54-68-110-187.us-west-2.compute.amazonaws.com:3000/posts/' + id + '/comments', comment, {
		    headers: {Authorization: 'Bearer '+auth.getToken()}
		  });
		};
		o.upvoteComment = function(post, comment) {
		  return $http.put('http://ec2-54-68-110-187.us-west-2.compute.amazonaws.com:3000/posts/' + post._id + '/comments/'+ comment._id + '/upvote', null, {
    headers: {Authorization: 'Bearer '+auth.getToken()}
  })
		    .success(function(data){
		      comment.upvotes += 1;
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
		  return $http.get('http://ec2-54-68-110-187.us-west-2.compute.amazonaws.com:3000/users', {
    headers: {Authorization: 'Bearer '+auth.getToken()}
  }).then(function(res){
		    return res.data;
		  });
		};
		o.get = function(id) {
		  return $http.get('http://ec2-54-68-110-187.us-west-2.compute.amazonaws.com:3000/users/' + id).then(function(res){
		    return res.data;
		  });
		};
		
		o.update = function(user){
	  return $http.put('http://ec2-54-68-110-187.us-west-2.compute.amazonaws.com:3000/users/' + user._id, user, {
    headers: {Authorization: 'Bearer '+auth.getToken()}
  }).success(function(data){
	    return data
	  });
	};
		
  return o;
}]);
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
	
	auth.userId = function(){
	  if(auth.isLoggedIn()){
	    var token = auth.getToken();
	    var payload = JSON.parse($window.atob(token.split('.')[1]));
		
	    return payload._id;
	  }
	};

	auth.register = function(user){
	  return $http.post('http://ec2-54-68-110-187.us-west-2.compute.amazonaws.com:3000/register', user).success(function(data){
	    auth.saveToken(data.token);
	  });
	};

	auth.logIn = function(user){
	  return $http.post('http://ec2-54-68-110-187.us-west-2.compute.amazonaws.com:3000/login', user).success(function(data){
	    auth.saveToken(data.token);
	  });
	};
	auth.logOut = function(){
	  $window.localStorage.removeItem('flapper-news-token');
	  window.location.href = '/';
	};

  return auth;
}]);
//units service
app.factory('unit', ['$http', 'auth','$window', function($http, auth, $window){
   var o = {};
   o.getAll = function(id) {
	    return $http.get('http://ec2-54-68-110-187.us-west-2.compute.amazonaws.com:3000/users/'+ id +'/units').success(function(data){
	      return data;
	    });
	  };
   o.get = function(userId,id) {
		  return $http.get('http://ec2-54-68-110-187.us-west-2.compute.amazonaws.com:3000/users/'+ userId +'/units/'+ id).then(function(res){
		    return res.data;
		  });
		};
   
	o.create = function(unit, id){
	  return $http.post('http://ec2-54-68-110-187.us-west-2.compute.amazonaws.com:3000/users/'+ id +'/units', unit, {
    headers: {Authorization: 'Bearer '+auth.getToken()}
  }).success(function(data){
		    return data;
		  });
	};
	
	o.update = function(unit, id, unitData){
	  return $http.put('http://ec2-54-68-110-187.us-west-2.compute.amazonaws.com:3000/users/'+ id +'/units/'+ unit, unitData, {
    headers: {Authorization: 'Bearer '+auth.getToken()}
  }).success(function(data){
	    return data
	  });
	};
	
	o.deleteUnit = function(unitId, userId){
	  return $http.delete('http://ec2-54-68-110-187.us-west-2.compute.amazonaws.com:3000/users/'+ userId +'/units/'+ unitId, {
    headers: {Authorization: 'Bearer '+auth.getToken()}
  }).success(function(data){
		    return unitId;
		  });
	};

  return o;
}]);

app.factory('methods', ['$http', 'auth', function($http, auth){
	  var o = {
	  		chats : []
	  };
	  o.get = function() {
	    return $http.get('http://ec2-54-68-110-187.us-west-2.compute.amazonaws.com:3000/admin/methods/').success(function(data){
	      return data;
	    });
	  };
	  o.create = function(method) {
		  return $http.post('http://ec2-54-68-110-187.us-west-2.compute.amazonaws.com:3000/admin/methods', method, {
    headers: {Authorization: 'Bearer '+auth.getToken()}
  }).success(function(data){
		    return data;
		  });
		};
		o.update = function(method) {
		  return $http.put('http://ec2-54-68-110-187.us-west-2.compute.amazonaws.com:3000/admin/methods', method, {
    headers: {Authorization: 'Bearer '+auth.getToken()}
  }).success(function(data){
		    return data;
		  });
		};
		
  return o;
}]);

app.factory('roya', ['$http', 'auth', function($http, auth){
	  var o = {
	  		
	  };
	  o.getAll = function() {
	    return $http.get('http://ec2-54-68-110-187.us-west-2.compute.amazonaws.com:3000/roya').success(function(data){
	      return data;
	    });
	  };
	  o.create = function(roya) {
		 return $http.post('http://ec2-54-68-110-187.us-west-2.compute.amazonaws.com:3000/roya', roya, {
    headers: {Authorization: 'Bearer '+auth.getToken()}
  }).success(function(data){
		    return data;	
		  });
		};
		/*o.get = function(id) {
		  return $http.get('/roya/' + id).then(function(res){
		    return res.data;
		  });
		};*/
  return o;
}]);

//pre loader animation controller
app.run(function($rootScope){
    $rootScope
        .$on('$stateChangeStart', 
            function(event, toState, toParams, fromState, fromParams){ 
                 $('body').removeClass('loaded');
	  			 $('body').addClass('loading');
        });

    $rootScope
        .$on('$stateChangeSuccess',
            function(event, toState, toParams, fromState, fromParams){ 
                setTimeout(function(){ $('body').removeClass('loading'); $('body').addClass('loaded') },400);
	  			
	  			setTimeout(function(){ $('body').removeClass('loaded') },500);

        });

});

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
	    if(!auth.isLoggedIn()){
	      $state.go('login');
	    }
	  }],
	  resolve: {
	    postPromise: ['posts', function(posts){
	      return posts.getAll();
	    }]
  	   }
    })
    .state('posts', {
	  url: '/posts/{id}',
	  templateUrl: '/posts.html',
	  controller: 'PostsCtrl',
	  resolve: {
      post: ['$stateParams', 'posts', function($stateParams, posts) {
      	return posts.get($stateParams.id);
    }]
  }

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
	.state('register-profile', {
	  url: '/register-profile',
	  templateUrl: '/register-profile.html',
	  controller: 'UnitCtrl',
	  onEnter: ['$state', 'auth', function($state, auth){
	    if(auth.isLoggedIn()){
	      //$state.go('home');
	    }
	  }]
	})
	.state('location', {
	  url: '/location',
	  templateUrl: '/location.html',
	  controller: 'LocationCtrl',
	  onEnter: ['$state', 'auth', function($state, auth){
	    if(!auth.isLoggedIn()){
	      $state.go('login');
	    }
	  }]
	})
	.state('roya', {
	  url: '/roya',
	  templateUrl: '/roya.html',
	  controller: 'RoyaCtrl',
	  onEnter: ['$state', 'auth', function($state, auth){
	    if(!auth.isLoggedIn()){
	      $state.go('login');
	    }
	  }]
	})
	.state('weather', {
	  url: '/weather',
	  templateUrl: '/weather.html',
	  controller: 'RoyaCtrl',
	  onEnter: ['$state', 'auth', function($state, auth){
	    if(!auth.isLoggedIn()){
	      $state.go('login');
	    }
	  }]
	})
	.state('support', {
	  url: '/support',
	  templateUrl: '/support.html',
	  controller: 'SupportCtrl',
	  onEnter: ['$state', 'auth', 'socket', function($state, auth, socket){
	    if(!auth.isLoggedIn()){
	      $state.go('login');
	    }
	    var currentUser = auth.currentUser();
	    var data_server = {
		    from_id : currentUser
	    }
	    //console.log(data_server);
	    socket.emit('load msg',data_server);
	  }]
	})
	.state('profile', {
	  url: '/profile',
	  templateUrl: '/profile.html',
	  controller: 'ProfileCtrl',
	  onEnter: ['$state', 'auth', function($state, auth){
	    if(!auth.isLoggedIn()){
	      $state.go('login');
	    }
	    var currentUser = auth.currentUser();
	    
	    
	  }]
	}).state('news', {
	  url: '/news',
	  templateUrl: '/news.html',
	  controller: 'NewsCtrl',
	  onEnter: ['$state', 'auth', function($state, auth){
	    if(!auth.isLoggedIn()){
	      $state.go('login');
	    }
	    var currentUser = auth.currentUser();
	    
	    
	  }],
	  resolve: {
	    postPromise: ['posts', function(posts){
	      return posts.getAll();
	    }]
  	   }
	});

  $urlRouterProvider.otherwise('home');
}]);

