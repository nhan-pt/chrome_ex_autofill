var currentSetupKey = null;
var core = { 
  "getOptions": function(){
    var result;
    var file;
    try{
      result = JSON.parse(localStorage.settings);
      file = localStorage.file
    } catch(e){
      result = null;
    }
    return [result, file];
  }
}
function getOptions(){
  console.log('da chay toi day')
}
 

function fill(tab, data) {
  let reset = JSON.parse(localStorage.reset);
  if(reset){
  localStorage.reset = 'false';
}
  chrome.tabs.executeScript(tab, { file: "jquery-3.1.1.min.js" }, function() {
    chrome.tabs.executeScript(tab, { file: "./excel-read.min.js" }, function() {
      chrome.tabs.executeScript(tab, { file: "" }, function() {
        chrome.tabs.executeScript(tab, {code: "var deepAutofillChromeExtensionSettings = " + JSON.stringify(core.getOptions()[0]) + ";var fileFillChromeExtensionSettings = '" + core.getOptions()[1] + "'; var reset = "+reset+""}, function(){
          chrome.tabs.executeScript(tab, { file: "run.js" }, function () {
            chrome.notifications.create(
              'name-for-notification',{   
                type: 'basic', 
                iconUrl: 'monkey48.png', 
                title: "OK", 
                message: "Your HTML form was just filled out by a smart but very wild monkey!" 
              }, 
              function() {}  
            );
          });
        });
      });       
  });
});       
}
function getScheme(info,tab) {
  chrome.tabs.executeScript(null, { file: "jquery-3.1.1.min.js" }, function() {
    chrome.tabs.executeScript(null, { file: "./excel-read.min.js" }, function() {
      chrome.tabs.executeScript(null, { file: "" }, function() {
        chrome.tabs.executeScript(null, {code: "var deepAutofillChromeExtensionSettings = " + JSON.stringify(tab.url) + ";var fileFillChromeExtensionSettings = " + core.getOptions()[1].toString() + ";"}, function(){
          chrome.tabs.executeScript(null, { file: "scheme.js" }, function () {
            
            var optionsUrl = chrome.extension.getURL('options.html');
            chrome.tabs.create({ 'url': optionsUrl });
            chrome.notifications.create(
              'name-for-notification',{   
                type: 'basic', 
                iconUrl: 'monkey48.png', 
                title: "Selectors copied", 
                message: "Simply paste the new configuration to a prefered position in you settings." 
              }, 
              function() {}  
            );
          });
        });
      });
    });         
  });       
}
   
 
  var settings = (localStorage.settings ? JSON.parse(localStorage.settings) : {});
  var mainContextMenuItem = chrome.contextMenus.create({
    title: "Auto Fill"
  });
  if (localStorage.settings !== undefined){
	  for(var key in settings){
	    if (settings.hasOwnProperty(key)){
	      var menuSetup = settings[key];
	      chrome.contextMenus.create({
	        title: key, 
	        contexts:["page"], 
	        onclick: function(info, tab){
	          currentSetupKey = key;
	          fill(tab.id, info)
	        },
	        parentId: mainContextMenuItem
	      });
	    }
	  }
	  for(var key in settings){
	    if (settings.hasOwnProperty(key)){
	      var menuSetup = settings[key];
	    }
	  }
  }

  chrome.contextMenus.create({
    title: "Reset",
    contexts:["page"], 
    onclick: function(info, tab){      
      localStorage.reset = 'true';
      currentSetupKey = null;
      fill(tab.id)
    } 
  });
   
  chrome.contextMenus.create({
    title: "Cancel",
    contexts:["page"], 
    onclick: function(info, tab){      
      localStorage.settings = JSON.stringify({isAutoFill:false})
    } 
  }); 
   
  chrome.contextMenus.create({
    title: "Options",
    contexts:["page"], 
    onclick: function(info, tab){
      var optionsUrl = chrome.extension.getURL('options.html');
      chrome.tabs.create({ 'url': optionsUrl });
    } 
  }); 

  chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){

    if (tab.url.indexOf("http://localhost:8080") > -1){
         fill(tabId)
       }
    if (tab.url.indexOf("https://evtp.viettelpost.vn") > -1){
      fill(tabId)
    }
  });
