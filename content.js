console.log("Injected the custom script")
const serverUrl="https://tmassemblyScraper.usln.in"
const machineEditUrls=[]


//const injectScript=(scriptText)=> {
//    console.log("Into the inject script function");
//    const script = document.createElement("script");
//    script.textContent = scriptText;
//    document.head.appendChild(script);
//    script.remove();
//}



function dataURLtoBlob(dataURL) {
  var byteString = atob(dataURL.split(',')[1]);
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: 'image/png' });
}


async function captureImage(){
       console.log("Into the function of capture Image",html2canvas)
       html2canvas(document.querySelector('body'),{
	       onrendered:function (canvas){
		       var img=canvas.toDataURL("image/png")
		       console.log("Img is : ",img)
       try{
       const payload={
	       "url":img
       }
       var blob=dataURLtoBlob(img)
       var formData=new FormData()
       formData.append('screenshot',blob,'screenshot.png')
      fetch(`${serverUrl}/saveUrl`,{
	      method:"POST",
	      body:formData
      }).then(response=>response.json()).then(responseData=>{
	      console.log("Response data from save url is : ",responseData)
	      chrome.runtime.sendMessage({action:"closeTab"})
      }).catch(error=>console.log("Error captured : ",error))
     }catch(error){
	     console.log("Error occured : ",error)
     }
		      }
       })
}


async function scrollPage(){
       console.log("Scrolling Page function")
       try{
	       document.documentElement.scrollTop = document.documentElement.scrollHeight;
	 }catch(error){
		 console.log("Error occured while scrolling : ",error)
	}
	chrome.runtime.sendMessage({action:"scrollOver"})
}


const wait=async(n)=>{
    return new Promise((resolve)=>{
	    setTimeout(resolve,n)
    })
}


async function fetchUrlIds(){
	const tableBody=document.querySelector('tbody')
	console.log("Table body ====== ",tableBody)
	const tableRows=tableBody.querySelectorAll('tr')
	console.log("Table rows ==== ",tableRows)
	for(tableRow of tableRows){
		console.log("TableRow ===== ",tableRow)
		const tableData=tableRow.querySelectorAll('td')
		console.log("TableData ===== ",tableData)
		const optionsElement=tableData[tableData.length-1]
		console.log("Options Element ====== ",optionsElement)
		if(!optionsElement){
			console.log("Options Element has false value so continuing")
			continue
		}
		const aTag=optionsElement.querySelector('a')
		console.log("ATag ===== ",aTag)
                if(aTag){
			var regex = /checkForSpindle\('([^']+)'\)/;
			var link=aTag.getAttribute("onClick")
			const result = regex.exec(JSON.stringify(link));

			if (result) {
			    const argumentValue = result[1];
			    console.log("Argument : ",argumentValue);
			    const urlToOpen=`https://neuustore.com/machine/editMachine?id=${argumentValue}`
                            machineEditUrls.push(urlToOpen)      
			} else {
			    console.log("No match found");
			}

		}
	}
}



async function buttonClick_scrap(){
        const liElement=document.querySelector('li.footable-page-nav[data-page="next"]')
	const linkElements=document.querySelectorAll('li.footable-page.visible')
	console.log("THe link elements is ==== ",linkElements)
	console.log("The length ==== ",linkElements.length)
	const nextButton=liElement.querySelector('a')
	console.log("next button ===== ",nextButton)
	for(i=0;i<linkElements.length;i++){
	   fetchUrlIds()
	   console.log("Into while")
           await wait(2000)
	   nextButton.click()
	}
	console.log("Machine Edit urls are ======= ",machineEditUrls)
	chrome.runtime.sendMessage({action:"scrapTable",data:machineEditUrls})
}




window.scrollPage=scrollPage
window.buttonClick_scrap=buttonClick_scrap
window.captureImage=captureImage


chrome.runtime.onMessage.addListener((message,sender,senderResponse)=>{
     if(message.action==="scrapData"){
	     buttonClick_scrap()
     }else if(message.action==="scrapTable"){
	     //scrollPage()
	     captureImage()
     }else if(message.action==="captureImage"){
             captureImage()
     }
})
