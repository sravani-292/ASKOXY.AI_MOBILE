const config=(value,value1)=>{
    var userStage="test"
	var BASE_URL;
 if(userStage=="test1"){
	//Live
  BASE_URL='https://meta.oxyloans.com/api/';
 }else {
	//Test
  BASE_URL='https://meta.oxyglobal.tech/api/';
	// BASE_URL='http://65.0.147.157:8282/api/';

 }
	// console.log(BASE_URL);
	
	return (BASE_URL);
}

export default config();

export const userStage = "test";