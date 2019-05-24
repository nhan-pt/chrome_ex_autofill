function msg(title, message){
  chrome.notifications.create(
    'name-for-notification', {   
      type: 'basic', 
      iconUrl: 'icon48.png', 
      title: title, 
      message: message
    }, 
    function() {}  
  ); 
}

var demoSettings =  {
  "Deep Auto Fill Chrome Demo" : {
    "randomLocale" : "de",
    "fields" : [
      {
        "selector" : "#textbox2",
        "random": "A bunch of random values: {{name.lastName}}, {{name.firstName}} {{name.suffix}}"
      },
      {
        "selector" : "input[name=textbox1]",
        "random": "A bunch of another random values: {{internet.email}}, {{helpers.createCard}} {{address.secondaryAddress}}",
        "static" : "A static value"
      },
      {
        "selector" : "#textbox4",
        "static" : "A static value"
      } 
    ]
  }
}


  //   $( document ).ready(function() {
  //     var reader = new FileReader();
  //     reader.onload = function(){
  //       var wb = XLSX.read("C:/Users/Admin/Documents/Book1.xlsx", {type : 'binary'});
  //       wb.SheetNames.forEach(function(sheetName){
  //         var rowObj =XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);
  //         var jsonObj = JSON.stringify(rowObj);
  //         console.log(jsonObj)
  //       })
  //     }
  //       reader.readAsBinaryString("C:/Users/Admin/Documents/Book1.xlsx");
  //     // console.log(wb);
  // });
    
  


jQuery(function($){
  console.log('here');
  var text = localStorage.settings ? localStorage.settings : JSON.stringify(demoSettings, null, '\t');
  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/javascript");
  editor.getSession().setValue(text);
  editor.commands.addCommand({
      name: 'save_settings',
      bindKey: {win: "Ctrl-S", "mac": "Cmd-S"},
      exec: function(editor) {
        try {
          var data = editor.session.getValue();
          var parsedData = JSON.parse(data); // try it to see if setting are valid
          localStorage.settings = data;

          let saveFile = $("#saveFile")[0].files[0]
          var reader = new FileReader();
          reader.onload = function () {
            localStorage.setItem("file", reader.result);
            chrome.runtime.reload();
          };
          reader.readAsDataURL(saveFile);
          msg("Settings saved successfully", "☑️"); // error in the above string (in this case, yes)!
        } catch(e) {
          msg("⚠️ Error", e); // error in the above string (in this case, yes)!
        }
      }
  })
});

 