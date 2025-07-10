const display = document.querySelector(".display");
let currentInput = "";
let previousInput = "";
let operation = null;
const buttons = document.querySelector(".buttons");

const executeOperation = (a, b, op) => {
   switch (op) {
      case "/":
        return a/b;
      case "*":
       return a*b;    
      case "-":
        return a-b;
      case "+":
        return a+b;
 
              }
            
    }
    
    const handleEvent = (event) => {
      const value = event.target.getAttribute("data-value")
      let numInput = parseFloat(currentInput)
      
      switch (value) {
        case "AC":
              currentInput =""
              previousInput =""
              operation =null
          break;
          
         case "=/-":
                currentInput = (-1 * numInput ).toString();
                break;
                
        case "%":
                currentInput = (numInput / 100).toString();
          break;
          
        case "/":
        case "*":
        case "-":
        case "+":
            if (currentInput !== "") {
              operation = value;
              previousInput = currentInput;
              currentInput = "";
            }
          break;  
         case "=":
          if (previousInput !== "" && currentInput !== ""){
            let numPreviousInput = parseFloat(previousInput);
            currentInput = executeOperation(numPreviousInput, numInput, operation).toString();
            operation = null;
            previousInput = "";
          }
          break;
          default:
            currentInput += value;
           break;
  
      }
      display.textContent = currentInput || "0";
    };
    
    buttons.addEventListener("click", function(event){
      if (event.target.tagName === "BUTTON") {
        handleEvent(event);
      }
    });