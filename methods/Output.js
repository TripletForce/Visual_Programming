nodes.push(()=>{
  var id=uniqueId();
  return({
    title: "Constant",
    color: "orange",
    content: "<input type='text' size='12' id='"+id+"' autocomplete='off'></input>",
    outputs: [
      {
        name: "Variable",
        type: "string"
      }
    ],
    function: ()=>{
      return({Variable: document.getElementById(id).value});
    },
    init: function(node) {
      document.getElementById(id).onchange = () => {
        node.checkActivation()
      }
    },    
  })
});
