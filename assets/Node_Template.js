/*
Contains the HTML of a node.

The getNodeTemplate(id) returns the HTML of the template with the correct id associated with the id.

Append the HTML to container div.
*/

var nodeOutput= "<li><text id='NIDText'></text><span class='dot' id='NIDDot'></span></li>";
var nodeInput = "<li><span class='dot' id='NIDDot'></span><text id='NIDText'></text></li>";

var nodeTemplate = `

    <div class="node" id="NID">
      <div class="nodeHeader" id="NIDHeader">
        <text id="NIDTitle">Title</text>
        <button class="nodeHeaderButton" id="NIDHeaderButton">
          <text class="nodeHeaderButtonText">-</text>
        </button>
      </div>
      <div class="nodeContent" id="NIDContent">
        <div class="nodeContentGeneral" id="NIDContentGeneral">Content</div>
        <div class="nodeContentRight">
          <ul class="nodeContentParent" id="NIDContentRight"></ul>
        </div>
        <div class="nodeContentLeft">
          <ul class="nodeContentParent" id="NIDContentLeft"></ul>
        </div>
        <div id="NIDContentSpace">
        </div>
      </div>
    </div>

`

/* Node ID == NID

///Elements in Template with ID:
node
nodeHeader
nodeTitle
nodeHeaderButton
nodeHeaderButtonText
nodeContent
nodeContentGeneral
UL - nodeContentLeft
UL - nodeContentRight
nodeContentSpace

///Elements in Node*Input/Output* with ID:
nodeText
nodeDot 
*/

///NOTE: Do not reuse id///

function getNodeTemplate(id){
  return(nodeTemplate.replace(/NID/g, id));
}

function getNodeInput(id){
  return(nodeInput.replace(/NID/g, id))
}

function getNodeOutput(id){
  return(nodeOutput.replace(/NID/g, id))
}
