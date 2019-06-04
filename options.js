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

var demoSettings = {
  "randomLocale": "de",
  "countProgessed": 0
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
  
  var text = JSON.stringify(Object.assign(demoSettings), null, '\t');
  
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
          let saveFile = $("#saveFile")[0].files[0]
          let saveData = saveFile ? Object.assign(parsedData, { isAutoFill: true }) : Object.assign(parsedData, { isAutoFill: false })
          localStorage.settings = JSON.stringify(saveData);
          var reader = new FileReader();
          reader.onload = function () {
            localStorage.setItem("file", reader.result);
            chrome.runtime.reload();
          };
          
          if(saveFile){
            return reader.readAsDataURL(saveFile);
          }
          chrome.runtime.reload();
          
          
          
          msg("Settings saved successfully", "☑️"); // error in the above string (in this case, yes)!
        } catch(e) {
          msg("⚠️ Error", e); // error in the above string (in this case, yes)!
        }
      }
  })
});

 