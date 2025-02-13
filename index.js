let prompt = document.querySelector("#prompt");
let submitBtn = document.querySelector("#submit");
let chatContainer = document.querySelector(".chat-container");
let imagebtn = document.querySelector("#image");
let image = document.querySelector("#image img");
let imageInput= document.querySelector("#image input");


const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAkcrWQadsI00Yd7pjk18uZQvxkhcpPHYw"

let user={
    message:null,
    file :{
         mime_type: null,
          data: null
    }
}

async function generateResponse(aiChatBox) {

 let text =aiChatBox.querySelector(".ai-chat-area")

    let RequestOption = {
        method:"Post",
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify({
            "contents": [
                {"parts":[{"text": user.message}, (user.file.data?[{"inline_data":user.file}]:[])

                ]
        }]
        })
    }
    try{
        let response = await fetch(Api_Url,RequestOption)
        let data = await response.json() 
       let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim()
       text.innerHTML=apiResponse;
    }
    catch(error){
        console.log(error);
    }
    finally{
        chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"});
        image.src= `img.svg`
        image.classList.remove("choose")
        user.file={}

    }
  
    
}


function createChatBox(html, classes) {
    let div = document.createElement("div");
    div.innerHTML = html;
    div.classList.add(classes);
    return div;
}

function handleChatResponse(userMessage) {
    user.message=userMessage
    let html = `
        <img src="./images/user.png" alt="" id="userImage" width="50">
        <div class="user-chat-area">
        ${user.message}
        ${user.file.data?`<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg"/>` : ""}
        </div>`;
    let userChatBox = createChatBox(html, "user-chat-box");
    chatContainer.appendChild(userChatBox); // Fixed typo here
    prompt.value = ""; // Clear input field after sending

    chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"});

    setTimeout(()=>{
    let html=` <img src="./images/ai.png" alt="" id="aiImage" width="60">
    <div class="ai-chat-area">
      <img src="./images/loading.webp" alt="" class="load" width="8%">
         </div>`
         let aiChatBox = createChatBox(html, "ai-chat-box")
         chatContainer.appendChild(aiChatBox)
         generateResponse(aiChatBox)
    },600)
}

// Event listener for Enter key
prompt.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { // Fixed event property
        e.preventDefault(); // Prevents default behavior
        if (prompt.value.trim() !== "") {
            handleChatResponse(prompt.value); // Fixed function call
        }
    }
});

submitBtn.addEventListener("click", ()=>{
    handleChatResponse(prompt.value);
})


imageInput.addEventListener("change", ()=>{
    const file =imageInput.files[0]
    if(!file) return
    let reader=new FileReader()
    reader.onload=(e)=>{
       let base64string=e.target.result.split(",")[1]
       user.file={
        mime_type:file.type,
        data:base64string
       }
        image.src= `data:${user.file.mime_type};base64,${user.file.data}`
        image.classList.add("choose")
    }
   
    reader.readAsDataURL(file)
})

imagebtn.addEventListener("click",()=>{
    imagebtn.querySelector("input").click()
})
