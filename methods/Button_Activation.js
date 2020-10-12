nodes.push((()=>{
  var id=uniqueId();
  return({
    //How the node will look:
    title: 'Button Activation',
    color: 'lightskyblue',
    content: 'Simple Event Listner <button id="'+id+'">Click Me!</button>',
    outputs: [
    {
      name: 'Activation',
      type: 'bool',
    }
    ],
    //When Activated:
    function: (() => {
      return({Activation: true});
    }),
    //When Node is Made:
    init: function(node) {
      document.getElementById(id).onclick = () => {
        node.checkActivation()
      }
    },    
  });
}));
