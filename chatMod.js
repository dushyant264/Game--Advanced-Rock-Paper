//set focus on input 1
window.onload=()=>{
    document.getElementById('input1').focus()
}

// log msg

logMessage=(message)=>{
    console.log()
    const chatMessages = document.getElementById('chatMessages')
    const messageElement = document.createElement('div')
    sharedMsg.innerText = message

    // dispatch message
    const messageEvent=new CustomEvent('messageLogged',()=>{
        detail:{message:message}
    })
    document.dispatchEvent(messageEvent)
    messageElement.textContent=message
    messageElement.classList.add('chatMessage')
    chatMessages.insertBefore(messageElement,chatMessages.firstChild)
    setTimeout(()=>{
        messageElement.remove()
    },5000) // remove after 5 sec
}

// handle transport plauer function

handleInputCycle=(event)=>{
    event.preventDefault();
    const input1 = document.getElementById("input1");
    const input2 = document.getElementById("input2");
    
    const input1Value = input1.value.trim();
    const input2Value = input2.value.trim();
    
    if (!input1Value||!input2Value) {
        logMessage("Fill both data.");
        input1.value="";
        input2.value="";
        input1.focus();
    } else {
        const message = input1Value + ", " + input2Value;
        logMessage(message);
        input1.value = "";
        input2.value = "";
        input1.focus();
    }
}

// when input submits
// using submit button

document.getElementById('inputForm').addEventListener('submit',handleInputCycle)
// using enter key in input2
document.getElementById('input2').addEventListener('keypress',(event)=>{
    if(event.key==='Enter'){
        handleInputCycle(event)
    }
})

// shift from input1 to input2 when first filled

document.getElementById('input1').addEventListener('input',()=>{
    if(input1.value.length>=input1.maxLength){
        document.getElementById('input2').focus()
    }
})