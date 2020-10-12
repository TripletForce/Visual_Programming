nodes.push({
  title: "Hold",
  color: "yellow",
  inputs: [
    {
      name: "Activation",
      type: "bool"
    },
    {
      name: "Variable",
      type: "other"
    }
  ],
  outputs: [
    {
      name: "Variable",
      type: "other"
    }
  ],
  function: (value, origion)=>{
    //Set the "Activation" input registered state false
    //Prevents "Variable" from triggering again
    origion.inputs[0].registered=false;
    //Mirror Back: When Input and Output the same
    return(value);
  }
});
