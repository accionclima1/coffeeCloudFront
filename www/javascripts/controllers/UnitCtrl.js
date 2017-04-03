//Units Controller
app.controller('UnitCtrl', [
'$scope',
'$state',
'unit',
'auth',
'PouchDB','onlineStatus','user','$rootScope',
function ($scope, $state, unit, auth, PouchDB, onlineStatus, user, $rootScope) {
	$scope.user_Ided = auth.userId();
  $scope.newUnit = {
      PouchDBId: '',
      EntityType: 'Unit',
      LastUpdatedDateTime: '',
		isSync:false,
		isDeleted:false,
	  sombra: true,
	  muestreo: false,
		muestreoMes:[],
	  fertilizaSuelo: false,
		fertilizaSueloMes:[],
	  fertilizaFollaje: false,
		fertilizaFollajeMes:[],
	  enmiendasSuelo: false,
		enmiendasSueloMes:[],
	  manejoTejido: false,
		manejoTejidoMes:[],
	  fungicidasRoya: true,
	  verificaAgua: false,
	  nitrogeno: false,
	  nitrorealiza: [],
	  sacos: '',
	  realizapoda: true,
	  realizamonth: '',
	  quetipo: '',
	  enfermedades: false,
	  cyprosol: true,
	  cyprosoldate: '',
	  atemi: true,
	  atemidate: '',
	  esfera: true,
	  esferadate: '',
	  opera: true,
	  operadate: '',
	  opus: true,
	  opusdate: '',
	  soprano: true,
	  sopranodate: '',
	  hexalon: true,
	  hexalondate: '',
	  propicon: true,
	  propicondate: '',	 
	  hexil: true,
	  hexildate: '',	 
	  otros: true,
	  otrosdate: '',
	  fungicidasmonth: '',
	  produccionhectarea: '',
	  variedad: {
	  	Catimor5175:false,
			Sarchimor:false,
			Anacafe14:false,
			Anacafe90:false,
			CostaRica95:false,
			Lempira:false,
			Obata:false,
			Catucai:false,
			HibridoH1:false,
			Marsellesa:false,
			Tupi:false,
			Parainema:false,
			CatuaiAmarillo:false,
			CatuaiRojo:false,
			Caturra:false,
			Pacamara:false,
			Pachecolis:false,
			Geisha:false,
			Bourbon:false,
			Pachecomun:false,
			Pacas:false,
			Robusta:false,
			MundoNovo:false,
			VillaSarchi:false,
			Maragogype:false,
			Typica:false,
			Maracaturra:false,
			Otra:false,
			Cual: '',
	  },
		typeOfCoffeProducessOptionSelected:[],
	  fungicidas: {
		 contacto: false,
	   bourbon: false,
	   catuai: false,
		 biologico : false,
		 sistemico : false,
		 contactoOptionsMonths:{
        caldovicosa : '',
        caldobordeles:'',
        otrocual:'',
      },
		 contactoOptions:{
			 	caldovicosa:false,
		 		caldobordeles:false,
		 		otrocual:false,
		 },
		 
		 	biologicalOptionsMonths:{
			 	verticiliumlecanii:'',
		 		bacilussutillis:'',
		 		otrocual:'',
		 },
		 biologicalOptions:{
			 	verticiliumlecanii:false,
		 		bacilussutillis:false,
		 		otrocual:false,
		 },
		 sistemicoOptionsMonths:{
        opus:'',
        opera:'',
        esferamax:'',
        amistarxtra:'',
        alto10:'',
        silvacur:'',
        verdadero:'',
        otrocual:'',
        mancuerna:'',
        caporal:'',
        halt:'',
        astrostarxtra:'',
        tutela:'',
        halconextra:'',
        beken:'',
        estrobirulina:'',
        otro:'',
		 },
		 sistemicoOptions:{
			 opus:false,
			 opera:false,
			 esferamax:false,
			 amistarxtra:false,
			 alto10:false,
			 silvacur:false,
			 verdadero:false,
			 otrocual:false,
			 mancuerna:false,
			 caporal:false,
			 halt:false,
			 astrostarxtra:false,
			 tutela:false,
			 halconextra:false,
			 beken:false,
			 estrobirulina:false,
			 otro:false
		 }


	  },
	  verificaAguaTipo: {
		  ph: false,
		  dureza: false
	  },
	  rendimiento : '',
	  tipoCafe: {
		  estrictamenteDuro: true,
		  duro: false,
		  semiduro: false,
		  prime: false,
		  extraprime: false
		  },
	};
  
  $scope.MonthDropDownOptions=[
	  {name: 'Enero',displayValue: 'Enero'},
    {name: 'Febrero',displayValue: 'Febrero'},
    {name: 'Marzo',displayValue: 'Marzo'},
    {name: 'Abril',displayValue: 'Abril'},
    {name: 'Mayo',displayValue: 'Mayo'},
		{name: 'Junio',displayValue: 'Junio'},
		{name: 'Julio',displayValue: 'Julio'},
		{name: 'Agosto',displayValue: 'Agosto'},
		{name: 'Septiembre',displayValue: 'Septiembre'},
		{name: 'Octubre',displayValue: 'Octubre'},
		{name: 'Noviembre',displayValue: 'Noviembre'},
		{name: 'Diciembre',displayValue: 'Diciembre'}
		];
		
$scope.typesOfCoffeSelectionOptions=[
	  {name: 'EstrictamenteDuro',displayValue: 'Estrictamente Duro'},
    {name: 'Duro',displayValue: 'Duro'},
    {name: 'Semiduro',displayValue: 'Semiduro'},
    {name: 'Prime',displayValue: 'Prime'},
    {name: 'ExtraPrime',displayValue: 'ExtraPrime'},
    {name: 'Nose',displayValue: 'No sé'}];

$scope.yesNoSelectionChange=function(type)
{
	(type=="newUnit")?$scope.newUnit.fungicidas.contacto=false:$scope.editUnit.fungicidas.contacto=false;
	(type=="newUnit")?$scope.newUnit.fungicidas.bourbon=false:$scope.editUnit.fungicidas.bourbon=false;
	(type=="newUnit")?$scope.newUnit.fungicidas.catuai=false:$scope.editUnit.fungicidas.catuai=false;
	(type=="newUnit")?$scope.newUnit.fungicidas.sistemico=false:$scope.editUnit.fungicidas.sistemico=false;
	(type=="newUnit")?$scope.newUnit.fungicidas.biologico=false:$scope.editUnit.fungicidas.biologico=false;
	$scope.resetFungicidasSelection(type,true,true,true);
}
$scope.FungicidOptionsChange=function(type,optionType)
{
    switch (optionType) {
			case "contacto":
						  if($scope.newUnit.fungicidas.contacto==false){
								$scope.resetFungicidasSelection(type,true,false,false);
							}
				break;
			case "sistemico":
							if($scope.newUnit.fungicidas.sistemico==false){
								$scope.resetFungicidasSelection(type,false,false,true);
							}
				break;
			case "biologico":
							if($scope.newUnit.fungicidas.biologico==false){
								$scope.resetFungicidasSelection(type,false,true,false);
							}
				break;
			default:
				break;
		}
}
$scope.yesNoNitrogenoChange=function(type)
{
	(type=="newUnit")?$scope.newUnit.quetipo='' : $scope.editUnit.quetipo= '';
	(type=="newUnit")?$scope.newUnit.nitrorealiza=[]:$scope.editUnit.nitrorealiza=[]
}
$scope.yesNoVerificiaAcquaChange=function(type)
{
	(type=="newUnit")?$scope.newUnit.verificaAguaTipo.ph=false : $scope.editUnit.verificaAguaTipo.ph=false;
	(type=="newUnit")?$scope.newUnit.verificaAguaTipo.dureza=false:$scope.editUnit.verificaAguaTipo.dureza=false;
}
$scope.yesNomanejoTejidoChange=function(type)
{
	(type=="newUnit")?$scope.newUnit.manejoTejidoMes=[] : $scope.editUnit.manejoTejidoMes=[]
}
$scope.yesNoenmiendasSueloChange=function(type)
{
	(type=="newUnit")?$scope.newUnit.enmiendasSueloMes=[] : $scope.editUnit.enmiendasSueloMes=[]
}
$scope.yesNofertilizaFollajeChange=function(type)
{
	(type=="newUnit")?$scope.newUnit.fertilizaFollajeMes=[] : $scope.editUnit.fertilizaFollajeMes=[]
}
$scope.yesNofertilizaSueloChange=function(type)
{
	(type=="newUnit")?$scope.newUnit.fertilizaSueloMes=[] : $scope.editUnit.fertilizaSueloMes=[]
}
$scope.yesNomuestreoChange=function(type)
{
	(type=="newUnit")?$scope.newUnit.muestreoMes=[] : $scope.editUnit.muestreoMes=[]
}

$scope.CheckboxBasedMonthChange=function(type,optionName)
{
	switch (optionName) {
		case 'contactoOptions.caldovicosa':
						(type=="newUnit")?$scope.newUnit.fungicidas.contactoOptionsMonths.caldovicosa='' : $scope.editUnit.fungicidas.contactoOptionsMonths.caldovicosa='';
			break;
		case 'contactoOptions.caldobordeles':
						(type=="newUnit")?$scope.newUnit.fungicidas.contactoOptionsMonths.caldobordeles='' : $scope.editUnit.fungicidas.contactoOptionsMonths.caldobordeles='';
			break;
		case 'contactoOptions.otrocual':
						(type=="newUnit")?$scope.newUnit.fungicidas.contactoOptionsMonths.otrocual='' : $scope.editUnit.fungicidas.contactoOptionsMonths.otrocual='';
			break;
		case 'sistemicoOptions.opus':
						(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptionsMonths.opus='' : $scope.editUnit.fungicidas.sistemicoOptionsMonths.opus='';
			break;
			case 'sistemicoOptions.opera':
						(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptionsMonths.opera='' : $scope.editUnit.fungicidas.sistemicoOptionsMonths.opera='';
			break;
			case 'sistemicoOptions.esferamax':
						(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptionsMonths.esferamax='' : $scope.editUnit.fungicidas.sistemicoOptionsMonths.esferamax='';
			break;			
			case 'sistemicoOptions.amistarxtra':
						(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptionsMonths.amistarxtra='' : $scope.editUnit.fungicidas.sistemicoOptionsMonths.amistarxtra='';
		  break;
			case 'sistemicoOptions.alto10':
						(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptionsMonths.alto10='' : $scope.editUnit.fungicidas.sistemicoOptionsMonths.alto10='';
			break;
	    case 'sistemicoOptions.silvacur':
						(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptionsMonths.silvacur='' : $scope.editUnit.fungicidas.sistemicoOptionsMonths.silvacur='';
			break;
			case 'sistemicoOptions.verdadero':
						(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptionsMonths.verdadero='' : $scope.editUnit.fungicidas.sistemicoOptionsMonths.verdadero='';												
			break;
			case 'sistemicoOptions.otrocual':
						(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptionsMonths.otrocual='' : $scope.editUnit.fungicidas.sistemicoOptionsMonths.otrocual='';
			break;
			case 'sistemicoOptions.mancuerna':
						(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptionsMonths.mancuerna='' : $scope.editUnit.fungicidas.sistemicoOptionsMonths.mancuerna='';
			break;			
			case 'sistemicoOptions.caporal':
						(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptionsMonths.caporal='' : $scope.editUnit.fungicidas.sistemicoOptionsMonths.caporal='';
		  break;
			case 'sistemicoOptions.halt':
						(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptionsMonths.halt='' : $scope.editUnit.fungicidas.sistemicoOptionsMonths.halt='';
			break;
	    case 'sistemicoOptions.astrostarxtra':
						(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptionsMonths.astrostarxtra='' : $scope.editUnit.fungicidas.sistemicoOptionsMonths.astrostarxtra='';
			break;
			case 'sistemicoOptions.tutela':
						(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptionsMonths.tutela='' : $scope.editUnit.fungicidas.sistemicoOptionsMonths.tutela='';												
			break;
			case 'sistemicoOptions.halconextra':
						(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptionsMonths.halconextra='' : $scope.editUnit.fungicidas.sistemicoOptionsMonths.halconextra='';
		  break;
			case 'sistemicoOptions.beken':
						(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptionsMonths.beken='' : $scope.editUnit.fungicidas.sistemicoOptionsMonths.beken='';
			break;
	    case 'sistemicoOptions.estrobirulina':
						(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptionsMonths.estrobirulina='' : $scope.editUnit.fungicidas.sistemicoOptionsMonths.estrobirulina='';
			break;
			case 'sistemicoOptions.otro':
						(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptionsMonths.otro='' : $scope.editUnit.fungicidas.sistemicoOptionsMonths.otro='';												
			break;
			case 'biologicalOptions.verticiliumlecanii':
						(type=="newUnit")?$scope.newUnit.fungicidas.biologicalOptionsMonths.verticiliumlecanii='' : $scope.editUnit.fungicidas.biologicalOptionsMonths.verticiliumlecanii='';
			break;
	    case 'biologicalOptions.bacilussutillis':
						(type=="newUnit")?$scope.newUnit.fungicidas.biologicalOptionsMonths.bacilussutillis='' : $scope.editUnit.fungicidas.biologicalOptionsMonths.bacilussutillis='';
			break;
			case 'biologicalOptions.otrocual':
						(type=="newUnit")?$scope.newUnit.fungicidas.biologicalOptionsMonths.otrocual='' : $scope.editUnit.fungicidas.biologicalOptionsMonths.otrocual='';												
			break;
	
		default:
			break;
	}
	
}

$scope.resetFungicidasSelection=function(type,isResetfungicidasContactoOptions,isResetfungicidasBiologicalOptions,isResetSistemicOptions){
	if(isResetfungicidasContactoOptions)
	{
			(type=="newUnit")?$scope.newUnit.fungicidas.contactoOptions.caldovicosa=false:$scope.editUnit.fungicidas.contactoOptions.caldovicosa=false;
			(type=="newUnit")?$scope.newUnit.fungicidas.contactoOptions.caldobordeles=false:$scope.editUnit.fungicidas.contactoOptions.caldobordeles=false;	
			(type=="newUnit")?$scope.newUnit.fungicidas.contactoOptions.otrocual=false:$scope.editUnit.fungicidas.contactoOptions.otrocual=false;

			(type=="newUnit")?$scope.newUnit.fungicidas.contactoOptionsMonths.caldovicosa='' :$scope.editUnit.fungicidas.contactoOptionsMonths.caldovicosa='';
			(type=="newUnit")?$scope.newUnit.fungicidas.contactoOptionsMonths.caldobordeles='' : $scope.editUnit.fungicidas.contactoOptionsMonths.caldobordeles='';
			(type=="newUnit")?$scope.newUnit.fungicidas.contactoOptionsMonths.otrocual='' : $scope.editUnit.fungicidas.contactoOptionsMonths.otrocual='';

  }
	if(isResetfungicidasBiologicalOptions)
	{
		(type=="newUnit")?$scope.newUnit.fungicidas.biologicalOptions.verticiliumlecanii=false:$scope.editUnit.fungicidas.biologicalOptions.verticiliumlecanii=false;	
		(type=="newUnit")?$scope.newUnit.fungicidas.biologicalOptions.bacilussutillis=false:$scope.editUnit.fungicidas.biologicalOptions.bacilussutillis=false;
		(type=="newUnit")?$scope.newUnit.fungicidas.biologicalOptions.otrocual=false:$scope.editUnit.fungicidas.biologicalOptions.otrocual=false;
			
		(type=="newUnit")?$scope.newUnit.fungicidas.biologicalOptionsMonths.verticiliumlecanii='' : $scope.editUnit.fungicidas.biologicalOptionsMonths.verticiliumlecanii='';
		(type=="newUnit")?$scope.newUnit.fungicidas.biologicalOptionsMonths.bacilussutillis='' : $scope.editUnit.fungicidas.biologicalOptionsMonths.bacilussutillis='';
		(type=="newUnit")?$scope.newUnit.fungicidas.biologicalOptionsMonths.otrocual='' : $scope.editUnit.fungicidas.biologicalOptionsMonths.otrocual='';

	}
	if(isResetSistemicOptions)
	{
			(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptions.opus=false:$scope.editUnit.fungicidas.sistemicoOptions.opus=false;
			(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptions.opera=false:$scope.editUnit.fungicidas.sistemicoOptions.opera=false;
			(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptions.esferamax=false:$scope.editUnit.fungicidas.sistemicoOptions.esferamax=false;
			(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptions.amistarxtra=false:$scope.editUnit.fungicidas.sistemicoOptions.amistarxtra=false;
			(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptions.alto10=false:$scope.editUnit.fungicidas.sistemicoOptions.alto10=false;
			(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptions.silvacur=false:$scope.editUnit.fungicidas.sistemicoOptions.silvacur=false;	
			(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptions.verdadero=false:$scope.editUnit.fungicidas.sistemicoOptions.verdadero=false;	
			(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptions.otrocual=false:$scope.editUnit.fungicidas.sistemicoOptions.otrocual=false;
			(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptions.mancuerna=false:$scope.editUnit.fungicidas.sistemicoOptions.mancuerna=false;
			(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptions.caporal=false:$scope.editUnit.fungicidas.sistemicoOptions.caporal=false;
			(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptions.halt=false:$scope.editUnit.fungicidas.sistemicoOptions.halt=false;
			(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptions.astrostarxtra=false:$scope.editUnit.fungicidas.sistemicoOptions.astrostarxtra=false;
			(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptions.tutela=false:$scope.editUnit.fungicidas.sistemicoOptions.tutela=false;
			(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptions.halconextra=false:$scope.editUnit.fungicidas.sistemicoOptions.halconextra=false;	
			(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptions.beken=false:$scope.editUnit.fungicidas.sistemicoOptions.beken=false;	
			(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptions.estrobirulina=false:$scope.editUnit.fungicidas.sistemicoOptions.estrobirulina=false;
			(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptions.otro=false:$scope.editUnit.fungicidas.sistemicoOptions.otro=false;

			(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptionsMonths.opus='' : $scope.editUnit.fungicidas.sistemicoOptionsMonths.opus='';
			(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptionsMonths.opera='' : $scope.editUnit.fungicidas.sistemicoOptionsMonths.opera='';
			(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptionsMonths.esferamax='' : $scope.editUnit.fungicidas.sistemicoOptionsMonths.esferamax='';
			(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptionsMonths.amistarxtra='' : $scope.editUnit.fungicidas.sistemicoOptionsMonths.amistarxtra='';
			(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptionsMonths.alto10='' : $scope.editUnit.fungicidas.sistemicoOptionsMonths.alto10='';
		  (type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptionsMonths.silvacur='' : $scope.editUnit.fungicidas.sistemicoOptionsMonths.silvacur='';
			(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptionsMonths.verdadero='' : $scope.editUnit.fungicidas.sistemicoOptionsMonths.verdadero='';												
			(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptionsMonths.otrocual='' : $scope.editUnit.fungicidas.sistemicoOptionsMonths.otrocual='';
			(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptionsMonths.mancuerna='' : $scope.editUnit.fungicidas.sistemicoOptionsMonths.mancuerna='';
			(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptionsMonths.caporal='' : $scope.editUnit.fungicidas.sistemicoOptionsMonths.caporal='';
			(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptionsMonths.halt='' : $scope.editUnit.fungicidas.sistemicoOptionsMonths.halt='';
			(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptionsMonths.astrostarxtra='' : $scope.editUnit.fungicidas.sistemicoOptionsMonths.astrostarxtra='';
			(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptionsMonths.tutela='' : $scope.editUnit.fungicidas.sistemicoOptionsMonths.tutela='';												
			(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptionsMonths.halconextra='' : $scope.editUnit.fungicidas.sistemicoOptionsMonths.halconextra='';
			(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptionsMonths.beken='' : $scope.editUnit.fungicidas.sistemicoOptionsMonths.beken='';
			(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptionsMonths.estrobirulina='' : $scope.editUnit.fungicidas.sistemicoOptionsMonths.estrobirulina='';
			(type=="newUnit")?$scope.newUnit.fungicidas.sistemicoOptionsMonths.otro='' : $scope.editUnit.fungicidas.sistemicoOptionsMonths.otro='';	

	}
}
  
  $( ".date-field" ).datepicker();
  $scope.onlineStatus = onlineStatus;
    
    $scope.$watch('onlineStatus.isOnline()', function(online) {
        $scope.online_status_string = online ? 'online' : 'offline';
        onlineStatus = $scope.online_status_string
        
    });
    
   if (onlineStatus) {
	    	
	    	user.get($scope.user_Ided).then(function(user){
				$scope.userO7 = user;
				
				
				
					//region to  get user unit from local PouchDB instead of server
			PouchDB.GetAllUserUnit(auth.userId()).then(function(result){
							if(result.status=='fail')
							{
									$scope.error = result.message;
							}
							else if(result.status=='success')
							{
								
								console.log($scope.userO7.units.length, result.data.length)
								if($scope.userO7.units.length === result.data.length){
									
									$scope.units = result.data;
									console.log('local mode:',result.data);
									
								} else {
									console.log('server mode:', $scope.userO7.units);
									$scope.units = $scope.userO7.units;
									$scope.remoteMode = true;
								}
								
								
							}
					});
			//endregion
				
			}); 
    	} else {
	    	
					//region to  get user unit from local PouchDB instead of server
			PouchDB.GetAllUserUnit(auth.userId()).then(function(result){
							if(result.status=='fail')
							{
									$scope.error = result.message;
							}
							else if(result.status=='success')
							{
								
								
									$scope.units = result.data;
									console.log('local mode:',result.data);
																
								
							}
					});
			//endregion
    	}
  
  $scope.saveUnit = function(){

		if ($scope.newunitForm.$valid) {
		/*For sync fied ,as new record will always have sync property false until it is' sync by local db' */
		
		/*Sync */

		$scope.newUnit.departamento = $("#departamentos option:selected").text();
		$scope.newUnit.municipio = $("#departamentos-munis option:selected").text();
		$scope.newUnit.lat = $('[name="lat"]').val();
		$scope.newUnit.lng = $('[name="lng"]').val();
		
			//Commented out as we need to add unit to pouchDB only,that will be sync to server
	   
    	
		if ($scope.remoteMode) {
	    
		    
		    $scope.newUnit.isSync = true;
		    var dt = new Date();
		    var documentId = dt.getFullYear().toString() + dt.getMonth().toString() + dt.getDate().toString() + dt.getHours().toString() + dt.getMinutes().toString() + dt.getSeconds().toString() + dt.getMilliseconds().toString();
		    $scope.newUnit.PouchDBId = documentId;
		    $scope.newUnit.LastUpdatedDateTime = Number(dt);
		    unit.create($scope.newUnit,auth.userId()).error(function(error){
	       $scope.error = error;
	     }).then(function(data){
			 	console.log("mongoDB written data="+JSON.stringify(data.data));
			 	$scope.userO7.units.push(data.data);
			 	if ($rootScope.IsInternetOnline) {
			 	    PouchDB.SynServerDataAndLocalData().then(function () {
			 	        console.log("sync successfully.");
			 	        $state.go('home');
			 	    }).catch(function (err) {
			 	        console.log("Not able to sync" + error);
			 	        $state.go('home');
			 	    });
			 	}
			 	
		    });
		} else {
			console.log('savelocal');
			$scope.newUnit.isSync=false;
			
			//region to create unit in local PouchDB instead of server
				PouchDB.AddUnit($scope.newUnit,auth.userId()).then(function(result){
						if(result.status=='fail')
						{
								$scope.error = result.message;
						}
						else if(result.status=='success')
						{
									delete result.data["type"];
									$scope.units.push(result.data)
									$state.go('home');
						}
				});
		//endregion
		}
		
		}
		
	  };
  
  muni14.addDepts('departamentos');
  
}]);