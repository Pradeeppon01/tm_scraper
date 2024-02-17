async function openDashboard() {
  console.log("Into the function of open dashboard : ");
  const urlToOpen = `https://neuustore.com/machine/manageMachine`;
  chrome.tabs.create({ url: urlToOpen }, (tab) => {
    console.log("Into the chrome tabs create function");
    chrome.tabs.onUpdated.addListener(
      function listener(tabId, changeInfo, updatedTab) {
        if (tabId === tab.id && changeInfo.status === "complete") {
          console.log("open channel to verify");
          chrome.tabs.sendMessage(tab.id, {
            action: "scrapData",
          });
          chrome.tabs.onUpdated.removeListener(listener);
        }
      },
    );
  });
}


function scrapTable(urls, currentIndex = 0) {
    if (currentIndex < urls.length) {
        const urlToOpen = urls[currentIndex];
        console.log("Into the function of scrapTable");
        chrome.tabs.create({ url: urlToOpen }, (tab) => {
            console.log("Into the chrome tabs create function");
            chrome.tabs.onUpdated.addListener(
                function listener(tabId, changeInfo, updatedTab) {
                    if (tabId === tab.id && changeInfo.status === "complete") {
			 console.log("Before scripting execute scripting")
			    chrome.scripting.executeScript({
				    target: { tabId: tab.id },
				    files: ['html2Canvas.js']
				}, () => {
					chrome.tabs.sendMessage(tab.id, {
					    action: "scrapTable",
					});
				});

                            scrapTable(urls, currentIndex + 1);
                    }
                },
            );
        });
    } else {
        console.log("All tabs processed");
    }
}

//function scrapTable(urls) {
//  for(const urlToOpen of urls){
//  console.log("Into the function of scrapTable");
//  chrome.tabs.create({ url: urlToOpen }, (tab) => {
//    console.log("Into the chrome tabs create function");
//    chrome.tabs.onUpdated.addListener(
//      function listener(tabId, changeInfo, updatedTab) {
//        if (tabId === tab.id && changeInfo.status === "complete") {
//          chrome.tabs.sendMessage(tab.id, {
//            action: "scrapTable",
//          });
//          chrome.tabs.onUpdated.removeListener(listener);
//        }
//      },
//    );
//  });
//}
//}


function captureTab(imageUrl){
	console.log("image url : ",imageUrl)
}

function captureTabError(error){
	console.log("Error fetching image url : ",error)
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received from background.js: ", message);

    if (message.action === "sarangi_scrap") {
        openDashboard();
    } else if (message.action === "captureTab"){
	    console.log("Into the capture tab from addlistneer : ",sender)
	    console.log("Window id : ",sender.tab.windowId)
	     chrome.tabs.get(sender.tab.id, function(tabInfo) {
          const windowWidth = tabInfo.width;
          const windowHeight = tabInfo.height;
          console.log("Window width : ",windowWidth)
          console.log("Window height : ",windowHeight)
		       chrome.tabs.setViewport({ width: windowWidth, height: windowHeight, tabId: sender.tab.id }, function() {
	               chrome.tabs.captureTab(sender.tab.id,function(screenshotDataUrl){
			console.log("Into capture visible tab : ",screenshotDataUrl)
                        chrome.tabs.remove(sender.tab.id, function () {
				console.log("Tab removed")
                            });
		       })
		       })
	     })
    } else if (message.action === "scrapTable") {
        const urls = message.data;
        scrapTable(urls);
    } else if (message.action === "scrollOver"){
        chrome.tabs.sendMessage(sender.tab.id,{
		action:"captureImage"
	})
    } else if (message.action === "closeTab") {
        console.log("Message received for close tab");
//        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//            chrome.tabs.remove(tabs[0].id, function () {
//                // After tab is closed, send the message
//                chrome.runtime.sendMessage({
//                    action: "closeTab",
//                    closeTab: true
//                });
//            });
//        });
	   
                        chrome.tabs.remove(sender.tab.id, function () {
                          console.log("Tab is about to close")    
			});
    }
});


