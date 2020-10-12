///TYPES\\\
//Parrel arr of types and colors for variables
var varTypes = ["bool", "number", "string", "array", "image", "vector", "object", "function",  "other"   ];
var varColors= ["red",  "orange", "yellow", "green", "blue",  "purple", "white" , "lightgrey", "darkgrey"];

function getTypeColor(type){
  var varIndex = varTypes.indexOf(type.toLowerCase())
  if(varIndex == -1){return('black');}
  return(varColors[varIndex])
}

//Canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');


///POSITIONS\\\
function getPos(elementID){
  var element = document.getElementById(elementID);
  var rect = element.getBoundingClientRect();
  var pos={};
  pos.center = [(rect.right+rect.left)/2, (rect.top+rect.bottom)/2];
  pos.sides =  [rect.right, rect.left];
  pos.rect = rect;
  return(pos);
}

function getVisiblePos(elementPack){
  //elementIdPack --> dotID and origionID
  if(elementPack.origion.hidden){
    //Get the pos of the header
    var pos = getPos(elementPack.origion.id + "Header");
    var connection = pos.center;
    //Change the connection coords to the side the line is connected to
    if(elementPack.isInput){
      connection[0] = pos.sides[1]; //Left
    }
    else{
      connection[0] = pos.sides[0]; //Right
    }
    //Return the connection coordinate
    return(connection);
  }
  else{
    var pos = getPos(elementPack.dotID);
    return(pos.center);
  }
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return [
    evt.clientX - rect.left,
    evt.clientY - rect.top
  ];
}


///CONNECTIONS\\\
  //Whenever push/splice from arr, make sure to connect/deconnect
var lines = [];  
  //Whenever user is forming line, this turns into a isInput bool
var origionalDot;


///SOCKETS\\\
  ///register functions are stored in output
function connect(){
  ///sets pushed output line outRegister to the inputs registerValue
  line = lines[lines.length-1];
  var output = (line[0].isInput ? line[1] : line[0]);
  var input  = (line[0].isInput ? line[0] : line[1]);
  output.outRegister(input.dotID ,input.registerValue);
}

function deconnect(line){
  //unconnects line
  var output = (line[0].isInput ? line[1] : line[0]);
  var input  = (line[0].isInput ? line[0] : line[1]);
  output.outRegisterNull(input.dotID);
}


///LINE RENDERING\\\
function drawLines(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  lines.forEach(function(line){
    ctx.beginPath();
    var a = getVisiblePos(line[0]);
    var b;
    if(Array.isArray(line[1])){b=line[1];}
    else{b = getVisiblePos(line[1]);}
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.stroke();
  });
}


///MOVING OF ELEMENTS\\\
//From W3Schools w/ modificaction
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "Header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "Header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

    ///ADDED MODIFICATION\\\
    drawLines()
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


///NODE\\\
class Method {
  constructor(id){
    //Add Template to the Container
    var parent = document.getElementById("container");
    var child = document.createElement("div")
    child.innerHTML = getNodeTemplate(id);
    parent.appendChild(child);

    //Expand and Retract Function
    var expandBtn = document.getElementById(id+"HeaderButton");
    var contentDiv = document.getElementById(id+"Content");
    this.hidden = false;
    var self = this;
    expandBtn.onclick = function(){
      if(contentDiv.style.display == 'none'){
        contentDiv.style.display = 'block';
        expandBtn.innerHTML = "-"
        self.hidden = false;
        drawLines();
      }
      else{
        contentDiv.style.display = 'none';
        expandBtn.innerHTML = "+"
        self.hidden = true;
        drawLines();
      }
    }

    //Make the node draggagle
    dragElement(document.getElementById(id));

    //Attach Values to the Object
    this.id=id;

    //output Functions
    this.outputFunctions = [];
  }

  //Changes Apperance
  style(params){
    //Set the style of the node
    document.getElementById(this.id+"Title").innerHTML = params.title;
    document.getElementById(this.id+"ContentGeneral").innerHTML = params.content;
    document.getElementById(this.id+"Header").style.backgroundColor = params.color;
  }

  //Changes Spacing for Nodes
  updateSize(){
    var max = this.inputNum;
    if(this.outputNum>this.inputNum || max==undefined){max = this.outputNum}
    document.getElementById(this.id+"ContentSpace").innerHTML = "<br>".repeat(max+1);
  }

  //Changes Input Nodes
  inputs(variables){
    //Save Inputs
    this.inputs = variables;
    this.inputNum = variables.length;
    var self = this;
    //Add inputs to node
    variables.forEach(function(item, index){
      //Create Input
      var li = document.createElement("li");
      var liID = self.id+'Input'+index
      li.innerHTML = getNodeInput(liID);
      document.getElementById(self.id+"ContentLeft").appendChild(li)
      //Style Input
      document.getElementById(liID + "Text").innerHTML = "   " + item.name;
      document.getElementById(liID + "Dot").style.backgroundColor = getTypeColor(item.type);

      //Dot mouse connection
      Method.activateDot(liID, true, index, self);
    });
    //Rescale size
    this.updateSize();
  }

  //Changes Output Nodes
  outputs(variables){
    //Save Inputs
    this.outputs = variables;
    this.outputNum = variables.length;
    var self = this;
    //Add inputs to node
    variables.forEach(function(item, index){
      //Create Input
      var li = document.createElement("li");
      var liID = self.id+'Output'+index
      li.innerHTML = getNodeOutput(liID);
      document.getElementById(self.id+"ContentRight").appendChild(li)
      //Style Input
      document.getElementById(liID + "Text").innerHTML = item.name + "   ";
      document.getElementById(liID + "Dot").style.backgroundColor = getTypeColor(item.type);

      //Dot mouse connection
      Method.activateDot(liID, false, index, self);
    });
    //Rescale size
    this.updateSize();
  }

  //Method Calling Function
  /*
  Arguments: An array of functions called when method function returns a value. The array of functions has an object as an argument
  */
  checkActivation(){
    var outputFunctions = this.outputFunctions;

    //Check to see if all inputs are registered
    var inputs = this.inputs;
    for(var i=0; i<inputs.length; i++){
      if(inputs[i].registered === false){
        return(0);  //Cancel Prosses if not registered.
      }
    }

    //Put all defined registers to false to reset
    /*for(var i=0; i<inputs.length; i++){
      if(inputs[i].registered !== undefined){
        this.inputs[i].registered = false;
      }
    }*/

    //Call the method function with the inputs
      ///Assemble the inputs into an object
    var params={};
    for(var i=0; i<inputs.length; i++){
      params[inputs[i].name] = inputs[i].value;
    }

      ///Call the method function
    var results = this.function(params, this);

      ///Register the outputs to the connected Inputs
    outputFunctions.forEach(function(item){
      item.refCall(results[item.refVar]);
    });
  }

  //Controls the connection behavior between dots
  static activateDot(liID, isInput, index, self){

    //Locations in Lines (it is a duplex)
    function registerOutput(dotID, callReference){
      //dotID from input
      var outcallObject = {
        refID: dotID,                         //reference string for removal
        refCall: callReference,               //function to call
        refVar: self.outputs[index].name,     //variable in results to choose
      }
      self.outputFunctions.push(outcallObject);
    }

    function unregisterOutput(dotID){
      for(var i=0; i<self.outputFunctions.length; i++){
        if(self.outputFunctions[i].refID == dotID){
          self.outputFunctions.splice(i, 1);
        }
      }
    }

    //Function to call when inputting a value
    function registerInput(value){
      if(!isInput){return(0);}  //stop prosses if output
      self.inputs[index].value = value;
      self.inputs[index].registered = true;
      //Activate Function and set the output functions to execute.
      self.checkActivation();
    }

    function setRegisterState(state){
      if(!isInput){return(undefined);}
      self.inputs[index].registered = state;
    }

    //Function to end line creation
    function cancelMouse(){
      if(origionalDot == undefined){return(true);}
      canvas.onmousemove = function(){};
      lines.pop();
      drawLines();
      origionalDot = undefined;
    }

    //Returns what is put in lines to represent the connection side.
    function getPack(){
      return({
        dotID: liID+"Dot",                  //Id of dot
        isInput: isInput,                   //Bool of is dot an input

        origion: self,                      //Method class of dot host
        
        registerValue: registerInput,       //Call with value to register
        setRegister: setRegisterState,      //Set register state

        outRegister: registerOutput,        //Socket connect
        outRegisterNull: unregisterOutput,  //Socket deconnect
      });
    }

    //Event Listner for finishing the line
    document.getElementById(liID+"Dot").onmouseover = function(){
      //no dot was selected
      if(origionalDot == undefined){return(true);}
      //dot type end was the same as start
      if(isInput == origionalDot){cancelMouse(); return(true);}

      //dot type end was input: delete any other inputs that are the same
      if(isInput){
        lines = lines.filter(function(line){
          //if none of the lines match...
          if(!(line[0].dotID == liID+"Dot" || line[1].dotID == liID+"Dot")){
            //Include line in lines
            return(line);
          }
          else{
            //deconnect line
            deconnect(line);

            //Set register to default
            line[0].setRegister(undefined);
            line[1].setRegister(undefined);
          }
        });
      }

      //finalize connection
      canvas.onmousemove = function(){}
      origionalDot = undefined;
      var pack = getPack();
      lines[lines.length-1][1]=pack;
      pack.setRegister(false);
      connect();

      //update UI
      drawLines();
    }

    //Event Listner for creating the line
    document.getElementById(liID + "Dot").onmousedown = function(){
      //Log the Start of the Drag
      origionalDot = isInput;
      
      //Allocate a space for the line being drawn
      var pack = getPack();
      lines.push([pack, undefined]);

      //Get everthing connected to Dot
      if(isInput){
        for(var i=0; i<(lines.length-1); i++){
          var item = lines[i];

          //if there is a match in a line (besides the last one):
          var results = [item[0].dotID, item[1].dotID].indexOf(liID+"Dot");

          //If the results are a match
          if(results != -1){
            //deconnect line
            deconnect(item);

            //unregister input
            item[0].setRegister(undefined);
            item[1].setRegister(undefined);

            var opp=1;  //Get opposite of results
            if(results){opp=0;}

            //Set the line start to the  
            lines[lines.length-1][0] = item[opp];

            //Remove the previous line
            lines.splice(i, 1);

            //change origionalDot to the opposite type
            origionalDot = !origionalDot;
          }
        }
      }
        
      //Event Listner for Canvas Drawing the line
      canvas.onmousemove = function(evt){
        lines[lines.length-1][1] = getMousePos(canvas, evt);
        drawLines();
      }

      //Stop Drawing line if mouse is released
      canvas.onmouseup = cancelMouse;
    }
  }
}
