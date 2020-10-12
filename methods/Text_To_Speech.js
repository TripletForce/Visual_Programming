function say(m) {
  var msg = new SpeechSynthesisUtterance();
  var voices = window.speechSynthesis.getVoices();
  msg.voice = voices[10];
  msg.voiceURI = "native";
  msg.volume = 1;
  msg.rate = 1;
  msg.pitch = 0.8;
  msg.text = m;
  msg.lang = 'en-US';
  speechSynthesis.speak(msg);
}

nodes.push({
  title: "Text to Speech",
  color: "red",
  inputs: [
    {
      name: "String",
      type: "string"
    }
  ],
  function: (params)=>{
    say(params.String);
  }
})
