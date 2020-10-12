
function generateNode(params){
  //Create Node with a unique id
  var node = new Method(uniqueId());

  //If the param is a function, call to get an object
  if(typeof(params)=='function'){params=params();}
  
  //Fill in vancancies in params to prevent errors
  params.inputs = params.inputs     || [];
  params.outputs = params.outputs   || [];
  params.content = params.content   || "";
  params.function = params.function || (() => {});
  params.init = params.init         || (() => {})

  //Fill in Node Parameters
  node.style(params);   //Any param not related is ignored.
  node.inputs(params.inputs);
  node.outputs(params.outputs);
  node.function = params.function;

  //Initialization Function
  params.init(node);

  //Return Node Class
  return(node);
}

//Create One of each node
var present=[];
for(var i=0; i<nodes.length; i++){
  present.push(generateNode(nodes[i]));
}

//For the future!! Key Presses
function globalKeyPress(event){
  //get key
  var key = event.which || event.keyCode;    
}
