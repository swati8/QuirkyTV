(function (APP) {

var Moment=Moment || {};

Moment.getDate=function(){
  if(!APP.AppConstants.IS_TV){
    return '';
  }
   try{
      var date=tizen.time.getCurrentDateTime();
      return APP.Formate.date(date);
   }
   catch(err){
   	console.log(err);
   }
};


Moment.getTime=function(){
  if(!APP.AppConstants.IS_TV){
    return '';
  }
   try{

      var date=tizen.time.getCurrentDateTime();
      return APP.Formate.time(date);
   }
   catch(err){
   	console.log(err);
   }

};

Moment.timechangedCallback=function(){
  //  var date=tizen.time.getCurrentDateTime();
  //  console.log("date=== ",date);
};

Moment.getDateTime=function(scope){
//console.log("inside getDateTime");
  // tizen.time.setDateTimeChangeListener(Moment.timechangedCallback);
//console.log("end getDateTime");
};

APP.Moment=Moment;
})(APP);
