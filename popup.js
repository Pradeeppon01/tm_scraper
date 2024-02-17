const sarangi_button=document.getElementsByClassName("sarangi-button")[0]
const cultfit_button=document.getElementsByClassName("cultfit-button")[0]
const screenshot_button=document.getElementsByClassName('take-screenshot')[0]
const screenshot_container=document.getElementsByClassName('screenshot_container')[0]
screenshot_button.style.margin="30px"
screenshot_button.style.overflow="auto"

//sarangi_button.addEventListener('click',()=>{
//	chrome.runtime.sendMessage({
//		action:"sarangi_scrap",
//	})
//})
//
//cultfit_button.addEventListener('click',()=>{
//	chrome.runtime.sendMessage({
//		action:"cultfit_scrap",
//	})
//})
//



sarangi_button.addEventListener('click',()=>{
	chrome.runtime.sendMessage({
		action:"sarangi_scrap",
	})
})

screenshot_button.addEventListener('click',()=>{
  chrome.tabs.captureVisibleTab(function(screenshotDataUrl) {
        const screenshotImage = new Image();
        screenshotImage.src = screenshotDataUrl;
        screenshot_container.appendChild(screenshotImage);
      });
})
