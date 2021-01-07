// This code is raw, unrefactored.

// This JS Calculator (Forked from original, 1st code. 2nd calculator code): 
// does not use eval(), 
// does not use a math library,
// it's logic is changeable,
// allows you to choose either Immediate Execution Logic or Formula Expression Logic
// allows the current math operator/symbol to be replaced with the operator of the operator button except for these cases x-, *-, /-, +- in which case, you can just use backspace to delete the last operator
// if you press backspace with an equal sign present, it will delete everything from the equal sign forward.
// does more.

// This calculator is performing how I want it to. As far as I've manually tested it, it performs Immediate Execution Logic and Formula/Expression Logic fine, but I'm human and I could have missed something. Here's the codpen link for it: https://codepen.io/nwbnwb/pen/JjXdzXB  
//This is the codepen I forked from the above codepen.
// I had to fork the codepen referred to above and modify it even though it's performing well because it doesn't pass the 13th test ("13. If 2 or more operators are entered consecutively, the operation performed should be the last operator entered (excluding the negative (-) sign.") which is probably due to my regular expression intentionally not allowing more than one operand/math-symbol from being inputed directly after each other except for " *-, x-, /-, +- ". 
const {useState, useEffect} = React;

const buttonData = [
  {id: "equals", text: "="},
  {id: "zero", text: "0"},
  {id: "one", text: "1"},
  {id: "two", text: "2"},
  {id: "three", text: "3"},
  {id: "four", text: "4"},
  {id: "five", text: "5"},
  {id: "six", text: "6"},
  {id: "seven", text: "7"},
  {id: "eight", text: "8"},
  {id: "nine", text: "9"},
  {id: "add", text: "+"},
  {id: "subtract", text: "-"},
  {id: "multiply", text: "x"},
  {id: "divide", text: "/"},
  {id: "decimal", text: "."},
  {id: "clear", text: "Clear All"},
  {id: "backspace", text: "Backspace"}
];

const Calculator = () => {
  const [input, setInput] = useState("I await your input.");
  // const [output, setOutput] = useState("0");
  const [limitReached, setLimitReached] = useState(false);
  // const [Logic, setLogic] = useState({immediateExecutionLogic});
  const [calculatorLogic, setCalculatorLogic] = useState({method: immediateExecutionLogic});
    
  const logicDisplay = document.querySelector("#logic-display");
  const backspaceButton = document.querySelector("#backspace");
  
  const handleLogic = logicType => {
    logicType === "Immediate Execution Logic" ? setCalculatorLogic({method: immediateExecutionLogic}) : setCalculatorLogic({method: formulaExpressionLogic}); 
    // backspaceButton.click(); // This removes the equal sign everything after it. But if the "Change Calculator Logic" button is clicked again, it will remove another character which I don't want it to do. So I'm replacing it with this: 
    if (/=/.test(input)) setInput(input.replace(/=(\S*)/, ""));
    }
  
  const handleInput = e => {
  const id = e.target.id;
    // The code just below, is my back up code if for some reason the lookbehind assertion ( (?<=\.\d+)\.$ ) of my regex stops working ( which is possible because it seems to be working in here but it doesn't work in https://regex101.com/ testing area which I've been using to help me figure out the regular expression of this React App.   
    // if (id !== "equals" && id !== "clear" && id !== "backspace") {
    // if((input + e.target.innerText).match(/\.\d+\.$/)) { 
    //   setInput(
    //     input.slice(0, input.length))
    // } 
    // else {
    //   setInput(
    //     (input + e.target.innerText)
    //     .replace(
    //       /^I await your input./, // place the rest of the regex code here when I finish it
    //       ""));
    // }
    
    // Digit Limit Reached Code: 
    //  if (
    //  I put the code in the curly brackets in the if statement under this one to see if it would work.
    //    id !== "divide" && 
    //    id !== "multiply" && 
    //    id !== "subtract" && 
    //    id !== "add" && 
    //    id !== "clear" && 
    //    id !== "backspace" && 
    //    id !== "equals" &&
    //    input.match(/(?:\d+)?\.?(\d+)?$/g)[0].split("").length === 22
    //  ) { 
    //    // previous code that was tested in the conditional but that didn't work like I wanted it to. 
    //    // && /\d{22}$|(?:\d{21}\.)$|(?:\d\.\d{20})$/.test(input) // this one almost worked
    //    // && /\d{22}|\d\.\d{20}/.test(input) 
    //    // && /\S{22}/.test(input)
    //           // if (/\S{22}/.test(input)) {
    //      setLimitReached('22 digit maximum input reached.');
    //      setTimeout(() => setLimitReached(false), 1500);
    //      return;
    //   // }    
    // }
    
    
    if (id !== "clear" && id !== "backspace" && id !== "equals") {
      if (/=/.test(input) && (id === "multiply" || id === "divide" || id === "add" || id === "subtract")) setInput(input.slice(input.indexOf("=") + 1) + e.target.innerText);
      else if (/=/.test(input) && (id === "zero" || id === "one" || id === "two" || id === "three" || id === "four" || id === "five" || id === "six" || id === "seven" || id === "eight" || id === "nine")) setInput(e.target.innerText);
      else if (/^\d+\.\-$/.test(input)) setInput(input.slice(0, input.length -2) + e.target.innerText); // removes the .- if at the beginning and end of the string and replaces it with the inner text of available buttons // If there are any issues, it may be because of this.
      // else if (/^\d+\.\-$/.test(input)) setInput(input.replace(/\-/, e.target.innerText));

      // else if (input.match(/\d|\./)[0].length === 22) setInput(input.match(/\d|\./)[0].join(", "));
      
      else if ( // Digit Limit Reached Code 
        input.match(/(?:\d+)?\.?(\d+)?$/g)[0].split("").length === 22
        && id !== "divide" && id !== "multiply" && id !== "subtract" && id !== "add"
      ) {
        setLimitReached('22 digit maximum reached.');
        setTimeout(() => setLimitReached(false), 1500);
        return;
      }
     
      
      else {
        setInput (
          (input + e.target.innerText).replace(
          // this seems to be working to prevent a decimal after a decimal and numbers:
          // /^I await your input.|^0+(?=0|0.|[1-9])|(?<=\.\d+)\.$|^(x|\/|\*|\-|\+|\.)|(?<=(?:x|\/|\*|\-|\+|\.))(x|\/|\*|\-|\+|\.)|(?<=I await your input.(x|\/|\*|\-|\+|\.))(?:x|\/|\*|\-|\+|\.)/, ""
          // I wrote this (?<=(x|\/|\*|\-|\+))0(?=\d+), which may be classified as a lookaround ??, to find zero if it is after any math symbol (except decimal) and before 1 or more digits. It seems to be working in this code line:
          // /^I await your input.(?=\d)|^(I await your input.(?:x|\/|\*|\-|\+|\.))|^0+(?=0|0.|[1-9])|(?<=\.\d+)\.$|^(x|\/|\*|\-|\+|\.)|(?<=(?:x|\/|\*|\-|\+|\.))(x|\/|\*|\-|\+|\.)|(?<=(x|\/|\*|\-|\+))0(?=\d+)/, ""
          // the above working code slightly modified(This works well, it doesn't allow to math symbols in a row and it maintains the last math symbol input but doesn't allow you to change the last math symbol by pressing another math symbol  :) (NOEL, DON'T MODIFY THIS LINE OF CODE JUST BELOW:) 
          // /^I await your input\.(?=\d)|^(I await your input\.(?:x|\/|\*|\-|\+|\.))|^0+(?=0|0.|[1-9])|(?<=\.\d+)\.$|^(?:x|\/|\*|\-|\+|\.)|(?<=(?:x|\/|\*|\-|\+|\.))(?:x|\/|\*|\-|\+|\.)|(?<=(?:x|\/|\*|\-|\+))0(?=\d+)/, ""
          // I didn't account for the negative sign, so I had to rewrite the regex:
          // /^I await your input\.(?=\d|\-)|^(I await your input\.(?:x|\/|\*|\+|\.))|^0+(?=0|0.|[1-9])|(?<=\.\d+)\.$|^(?:x|\/|\*|\+|\.)|(?<=(?:x|\/|\*|\-|\+))0(?=\d+)|(?:x|\*)(?=x|\*|\/|\+)|(?:\/)(?=\/|x|\*|\+)|(?<=\-)(x|\*|\/|\-|\+|\.)/,""
          // https://regex101.com/r/NP7dtv/17/ (the link to the regex just above)
          // I stopped working on the code above when I realized I could just slightly modify the code that I told myself not to modify instead of rewriting a large part of it. I realized that if I remove or add \- in certain places and add a lookahead for \-(?=\-)
          // THIS CODE IS WORKING, it prevents another math operator from being inputted after another math operator exept for x-, *-, /-, +- .
          // /^I await your input\.(?=\d|\-)|^(I await your input\.(?:x|\/|\*|\+|\.))|^0+(?=0|0.|[1-9])|(?<=\.\d+)\.$|^(?:x|\/|\*|\+|\.)|(?<=(?:x|\/|\*|\-|\+|\.))(?:x|\/|\*|\+|\.)|(?<=(?:x|\/|\*|\-|\+))0(?=\d+)|\-(?=-)|(?<=\.)\-$/, ""
            // The original regex that is working well is just above. (Code before modification for 13th test.)
            // Modification for 13th test: 
            // THIS CODE IS WORKING, but it replaces the current math operator with the math operator of the operator button that was just clicked. 
            // This accounts for *-, /-, x-, --, +-
            /^I await your input\.(?=\d|\-)|^(I await your input\.(?:x|\/|\*|\+|\.))|(?<=^\-)(?:x|\*|\/|\-|\+|\.)|(?<=x|\*|\/|\-|\+|\.)\.|(?<=^\-?\d+)(?:x|\*|\/|\-|\+|\.)(?=x|\*|\/|\+|\.)|(?<=\d+\.\d+)\.|\.(?=x|\*|\/|\-|\+|\.)|(?<=\d+\.\d+)(?:x|\*|\/|\-|\+)(?=x|\*|\/|\+)|^0+(?=0|0.|[1-9])|(?<=(?:x|\/|\*|\-|\+))0(?=\d+)|(?<=(?:x|\*|\/|\-|\+)\d+)(?:x|\*|\/|\-|\+)(?=x|\*|\/|\+|\.)|(?<=(?:x\-)|(?:\*\-)|(?:\/\-)|(?:\-\-)|(?:\+\-))(x|\*|\/|\-|\+)/, ""
            // While working, the code below, does not account for *-, /-, x-, --, +-
            // /^I await your input\.(?=\d|\-)|^(I await your input\.(?:x|\/|\*|\+|\.))|(?<=^\-)(?:x|\*|\/|\-|\+|\.)|(?<=x|\*|\/|\-|\+|\.)\.|(?<=^\-?\d+)(?:x|\*|\/|\-|\+|\.)(?=x|\*|\/|\-|\+|\.)|(?<=\d+\.\d+)\.|\.(?=x|\*|\/|\-|\+|\.)|(?<=\d+\.\d+)(?:x|\*|\/|\-|\+)(?=x|\*|\/|\-|\+)|^0+(?=0|0.|[1-9])|(?<=(?:x|\/|\*|\-|\+))0(?=\d+)|(?<=(?:x|\*|\/|\-|\+)\d+)(?:x|\*|\/|\-|\+)(?=x|\*|\/|\-|\+|\.)/, ""
            // last one I was working on, when ready, start over from the beginning for: https://regex101.com/r/t5KCFG/14/
            // the last thing is to keep \.\- from being possibe
          // I'm probably going to work on finishing the calculator before resuming this experiment: I'm going to try to make it where the last math symbol can be changed when another math symbol is pressed (It's the second to last alternative:) 
          // /^I await your input\.(?=\d)|^(I await your input\.(?:x|\/|\*|\-|\+|\.))|^0+(?=0|0.|[1-9])|(?<=\.\d+)\.$|^(?:x|\/|\*|\-|\+|\.)|(?<=(?:x|\/|\*|\-|\+|\.))(?:x|\/|\*|\-|\+|\.)|(?<=(?:x|\/|\*|\-|\+))0(?=\d+)/, "" 
        )
        // input.replace(
        //   // /^I await your input.|^(0+|\/|x|\-|\+|\.)/, ""
        //   // /^I await your input.|[^(^(0\.)|^([1-9]+\.))]/, ""
        //   // /^I await your input.|[^[1-9]]/, ""
        //   // /^I await your input.|^[(0\.\d+)]/, ""
        //   // /^I await your input.|(?<=(\.\d+|\.\.*))\.|(?<=(x|\.|\/|\+|\-))(x|\.|\/|\+|\-)|^(x|\.|\/|\+|\-)|^0(?<=\d+)/, ""
        //   // /^I await your input.|[^0{1}?\.1-9+-\/x\*]|^(0+(?=0\.))|0+(?=[1-9])|^(x|\+|\-|\/|\*|\.)|(?<=(\.[\d+]|\.[\.*]))\.|(?<=(x|\.|\/|\+|\-|\*))(x|\.|\/|\+|\-|\*)|^(x|\.|\/|\+|\-|\*)|^(0+(?=[0-9])0)|(?<=[(x|\.|\/|\+|\-|\*)][\d*].[\d+])\./, ""
        //  /^I await your input.|[^0{1}?\.1-9+-\/x\*]+|^(0+(?=0\.))/, "" 
        // ) + e.target.innerText
        );
      } // end of inner else statement
      
    };

    if (id === "clear") {
      setInput("");
    }
    if (id === "backspace") {
      // setInput(input.replace(/[^I await your input.]|\./, ""));
      // the above line of code works, but it will delete the period of the end of the sentence too. So I wrote this:  
      if (input === "I await your input.") return;
      else if (/=/.test(input)) setInput(input.replace(/=(\S*)/, ""));
      else setInput(input.replace(/\S$/, ""));
    }
    
    if (id === "equals") {
      
      if (input === "I await your input.") return;
            
      if (/=/.test(input)) return;
      
      if (/^\-$/.test(input)) return;
            
      if (/^\-?(?:\d+|\d+\.\d+)$/.test(input)) return;
      
      if (/(?:x|\*|\/|\-|\+|\.)\-$/.test(input)) {
          // setInput(input.slice(0, input.length - 2) + "=" + immediateExecutionLogic(input));
        setInput(input.slice(0, input.length -2));
        return;
      }
      
      if (/(?:x|\*|\/|\-|\+|\.)$/.test(input)) {
        // setInput("Oh Yeah!");
        // setInput(input.slice(0, input.length - 1) + "=" + immediateExecutionLogic(input));
        setInput(input.slice(0, input.length - 1));
        return;
       // 1. Resume here when ready: I think I'm going to add the Immediate Execution and Formula/Expression Logic functions somewhere... where, I'll figure it out.
       // setInput(input + "=")
       // 2. Resume when ready: working on including and calculating x-, *-, /- on line 7 of https://jsfiddle.net/vx91gacf/29/
       // I already added \-? to parts of the regex for match on line 8, nex thing to do is to get the replace function to calculate it.
      }
      // setInput(input + "=" + immediateExecutionLogic(input));
      // setInput(input + "=" + formulaExpressionLogic(input));
      // logicDisplay.innerText === "Immediate Execution Logic" ? setInput(input + "=" + immediateExecutionLogic(input)) : setInput(input + "=" + formulaExpressionLogic(input));
      // setInput(input + "=" + Logic.immediateExecutionLogic(input));
      setInput(input + "=" + calculatorLogic.method(input));
    }
    // handleOutput(id);
    
} // handleInput close
  
  if(input === "") {setInput("I await your input.")}

  const handleOutput = (input) => {
    // Now I'm working on this. resume here when ready
    const display = document.getElementById("display");
    if (input === "I await your input.") return "0";
    else if (/=$/.test(input)) return "";
    else if (/(?:x|\/|\*|\-|\+)$/.test(input)) return input[input.length - 1];
    // else return input;
    else return /(?:\-?\d+|\-?\d+\.|\-?\d+\.\d+)$/.exec(input); // added \-? to allow for the output display to show a negative in front of the three different number patterns.
  }
  
  // if(input !== "I await your input.") {setOutput(input);}
  
  return (
    // <div id="calculator-container">
    <>
      <ChangeCalculatorLogic 
        handleLogic={handleLogic}/>
      <Display 
        input={input}
        // output={output} 
        // output={input}
        limitReached={limitReached}
        output={handleOutput(input)}
        
        />
      
      <ButtonInputs handleInput={handleInput}/>
      {/*<ClearAll /><ClearInput />*/}
    </>
    // </div>
  );
}
  
function Display (props) {
  return (
    <div
      id="display-container">
      <p
        id="input">
        {props.input}
      </p>
      <p
        id="display">
        {props.limitReached || props.output}
        
      </p>
    </div>
  );
}
  
function ChangeCalculatorLogic(props) {
  const[calculatorLogic, setCalculatorLogic] = useState("Immediate Execution Logic");

  const changeCalculatorLogic = () => { // I wonder if I should be using useEffect Hook for this?
    // calculatorLogic === "Immediate Execution Logic" ?
    //   setCalculatorLogic("Formula/Expression Logic") : 
    //   setCalculatorLogic("Immediate Execution Logic");
    
    if (calculatorLogic === "Immediate Execution Logic") {
      setCalculatorLogic("Formula/Expression Logic");
      props.handleLogic("Formula/Expression Logic");
    }
    else {
      setCalculatorLogic("Immediate Execution Logic");
      props.handleLogic("Immediate Execution Logic");
    }
   
  }
      
  return (
    <div 
      id="change-calculator-logic">
      <button
        type="button"
        onClick={changeCalculatorLogic}>
        Change Calculator Logic
      </button>
      <p id="logic-display">{calculatorLogic}</p>
      {/*<p>&#128521;</p>*/}
    </div>
  );
}

function ButtonInputs (props) {
    return (
      <div id="button-container">
      {
        buttonData.map(button => {
          return (
            <button
              id={button.id}
              className="button"
              key={button.id}
              onClick={props.handleInput}>
              {button.text}
            </button>
          );
        })
      }
      </div>
    );
}

//_____________________________________________________________

// Logic Functions, Logic Callback, Closure Functions:

//const immediateExecutionLogic = (stringExpression) => {
  function immediateExecutionLogic(stringExpression) {
    // Link to JSFiddle for this:
    // https://jsfiddle.net/28anr370/
    // Separate Numbers From Operators
    const numbersOperators = stringExpression.match(/\d+(?:\.\d+)?|(x|\*|\/|\-|\+)|\d+(?:\.\d+)?/g);
    let operator = "";
    let value = 0;

    for (let i = 0; i < numbersOperators.length; i++) {

      if (numbersOperators[0] === "-" && i === 1) {
         // if (i === 1) {
          value = -Number.parseFloat(numbersOperators[i]);
          continue; // Ther's no need to run through the rest of the code, so go to the next loop. was -1 * Num....
        // }
    }
    
    if (numbersOperators[0] !== "-" && i === 0) {
    		value = Number.parseFloat(numbersOperators[i]);
        continue;
    }
    
    if (i !== 0 && isNaN(numbersOperators[i])) {operator += numbersOperators[i]; }
      
			if (!isNaN(numbersOperators[i]) && operator !== "") {
        switch(operator) {
        	case "x": 
            value *= Number.parseFloat(numbersOperators[i]); 
            break;

					case "*":	
            value *= Number.parseFloat(numbersOperators[i])
            break;
	        
          case "/": 
            value /= Number.parseFloat(numbersOperators[i])
            break;
          
        	case "-": 
            value -= Number.parseFloat(numbersOperators[i])
            break;
          
        	case "+": 
            value += Number.parseFloat(numbersOperators[i])
            break;
            
					case "x-": 
            value *= -Number.parseFloat(numbersOperators[i]); 
            break;

					case "*-":	
            value *= -Number.parseFloat(numbersOperators[i]);
            break;
	        
          case "/-": 
            value /= -Number.parseFloat(numbersOperators[i]);
            break;
         
         case "--": 
            value += Number.parseFloat(numbersOperators[i]);
            break;
         
        	case "+-": 
            value += -Number.parseFloat(numbersOperators[i]);
            break;
         
        	default: 
        		break;
        }
        operator = "";
        continue;
      }
	} // end of for loop 
  // return stringExpression;
	return value;
}


function formulaExpressionLogic (stringExpression) {
  // Link to JSFiddle for this:
  // https://jsfiddle.net/vx91gacf/37/ 
  const multiplyDivide = stringExpression
  .replace(
    // /(\d+(?:\.\d+)?(?:x|\*|\/)\d+(?:\.\d+)?(?:(?:x|\*|\/)\d+(?:\.\d+)?)*)/g,
    /(\d+(?:\.\d+)?(?:x|\*|\/)\-?\d+(?:\.\d+)?(?:(?:x|\*|\/)\-?\d+(?:\.\d+)?)*)/g, // I had to add \-? to account for x-, *-, /- operator pairs
    (...groups) => {
    // When the g flag is set in the above regex in replace, for each group it is returning an array consisting of five items. E.g., the first group (5x6) array:  ["5x6", "5x6", undefined, 2, "3+5x6-2/4+7.03*7*7/0.0004/1-3.000/4+444x4-2"] what does each value represent???
    let equals = 0;
    let operator = "";
    // Separate Numbers from multiplication and division operators with optional - minus/negative sign:
    let array = groups[0].match(/\d+\.\d+|(x|\*|\/)\-?|\d+/g) // I had to add \-? to account for x-, *-, /-
    
    for (let i = 0; i < array.length; i++) {

    	if (i === 0 /* && array[i] !== "-" */) {
    		equals = Number.parseFloat(array[i]);
        continue;
    	}
      if (isNaN(array[i]) && i !== 0) {operator += array[i]; }
      
			if (!isNaN(array[i]) && operator !== "") {
        switch(operator) {
        	case "x": 
            equals *= Number.parseFloat(array[i]); 
            break;

					case "*":	
            equals *= Number.parseFloat(array[i])
            break;
	        
          case "/": 
            equals /= Number.parseFloat(array[i])
            break;
            
          case "x-": 
            equals *= -Number.parseFloat(array[i]); 
            break;

					case "*-":	
            equals *= -Number.parseFloat(array[i])
            break;
	        
          case "/-": 
            equals /= -Number.parseFloat(array[i])
            break;
      
        	default: 
        		break;
        }
        operator = "";
        continue;
      }
    }
      return equals;
    });	
    
   const addSubtract = multiplyDivide.match(/\d+(?:\.\d+)?|(?:\-|\+)|\d+(?:\.\d+)?/g); // I fixed it, it's working now. 
   
	let addSubtractResult = 0;
  let addOrSubtractOperator = "";

  for (let i = 0; i < addSubtract.length; i++) {
		if (addSubtract[0] === "-") {
    	if (i === 1) {
        addSubtractResult = -1 * Number.parseFloat(addSubtract[i]);
        continue;
      }
    }
    if (i === 0 && addSubtract[0] !== "-") {
    		addSubtractResult = Number.parseFloat(addSubtract[i]);
        continue;
    }
      if (isNaN(addSubtract[i]) && i !== 0) {addOrSubtractOperator += addSubtract[i]; }
      
			if (!isNaN(addSubtract[i]) && addOrSubtractOperator !== "") {
        switch(addOrSubtractOperator) {
        	case "x": 
            addSubtractResult *= Number.parseFloat(addSubtract[i]); 
            break;

					case "*":	
            addSubtractResult *= Number.parseFloat(addSubtract[i])
            break;
	        
          case "/": 
            addSubtractResult /= Number.parseFloat(addSubtract[i])
            break;
          
        	case "-": 
            addSubtractResult -= Number.parseFloat(addSubtract[i])
            break;
          
        	case "+": 
            addSubtractResult += Number.parseFloat(addSubtract[i])
            break;
            
					case "x-": 
            addSubtractResult *= -Number.parseFloat(addSubtract[i]); 
            break;

					case "*-":	
            addSubtractResult *= -Number.parseFloat(addSubtract[i]);
            break;
	        
          case "/-": 
            addSubtractResult /= -Number.parseFloat(addSubtract[i]);
            break;
         
         case "--": 
            addSubtractResult += Number.parseFloat(addSubtract[i]);
            break;
         
        	case "+-": 
            addSubtractResult += -Number.parseFloat(addSubtract[i]);
            break;
         
        	default: 
        		break;
        }
        addOrSubtractOperator = "";
        continue;
      }
	} // end of for loop 

   // return arrayM;
    // return arrayR; // Division And Multiplication Results replaced the appropriate groups
    // return addSubtract.join(", ");
    // addOrSubtractOperator = "It was a blank string."
    // return addOrSubtractOperator + typeof addOrSubtractOperator;
    return addSubtractResult;
}

ReactDOM.render(<Calculator />, document.getElementById("reactRoot"));

//   function ClearAll() {
//     return (
//       <button
//         id="clear"
//         type="button">
//         Clear All
//       </button>
//     );
//   }
  
//   function ClearInput() {
//     return (
//       <button 
//         id="clear-input"
//         type="button">
//         Clear Input
//       </button>
//     );
//   }
  


  
// function Calculator() {
//   return <div id="testDiv"></div>;
// }


// !! IMPORTANT README:

// You may add additional external JS and CSS as needed to complete the project, however the current external resource MUST remain in place for the tests to work. BABEL must also be left in place. 

/***********
INSTRUCTIONS:
  - Select the project you would 
    like to complete from the dropdown 
    menu.
  - Click the "RUN TESTS" button to
    run the tests against the blank 
    pen.
  - Click the "TESTS" button to see 
    the individual test cases. 
    (should all be failing at first)
  - Start coding! As you fulfill each
    test case, you will see them go   
    from red to green.
  - As you start to build out your 
    project, when tests are failing, 
    you should get helpful errors 
    along the way!
    ************/

// PLEASE NOTE: Adding global style rules using the * selector, or by adding rules to body {..} or html {..}, or to all elements within body or html, i.e. h1 {..}, has the potential to pollute the test suite's CSS. Try adding: * { color: red }, for a quick example!

// Once you have read the above messages, you can delete all comments. 
// +++++++++++++++++++++++++++++++++++++++++
//   function (props) {
//   return (
//     <button
//       id=""
//       type="button">
//     </button>
//   );
// }

// function (props) {
//   return (
//     <button
//       id=""
//       type="button">
//     </button>
//   );
// }
// function (props) {
//   return (
//     <button
//       id=""
//       type="button">
//     </button>
//   );
// }
// function (props) {
//   return (
//     <button
//       id=""
//       type="button">
//     </button>
//   );
// }
// function (props) {
//   return (
//     <button
//       id=""
//       type="button">
//     </button>
//   );
// }
// function (props) {
//   return (
//     <button
//       id=""
//       type="button">
//     </button>
//   );
// }
// function (props) {
//   return (
//     <button
//       id=""
//       type="button">
//     </button>
//   );
// }
// function (props) {
//   return (
//     <button
//       id=""
//       type="button">
//     </button>
//   );
// }
// function (props) {
//   return (
//     <button
//       id=""
//       type="button">
//     </button>
//   );
// }
// function (props) {
//   return (
//     <button
//       id=""
//       type="button">
//     </button>
//   );
// }
// function (props) {
//   return (
//     <button
//       id=""
//       type="button">
//     </button>
//   );
// }
// function (props) {
//   return (
//     <button
//       id=""
//       type="button">
//     </button>
//   );
// }
// function (props) {
//   return (
//     <button
//       id=""
//       type="button">
//     </button>
//   );
// }
// function (props) {
//   return (
//     <button
//       id=""
//       type="button">
//     </button>
//   );
// }
// function (props) {
//   return (
//     <button
//       id=""
//       type="button">
//     </button>
//   );
// }
// function (props) {
//   return (
//     <button
//       id=""
//       type="button">
//     </button>
//   );
// }
// function (props) {
//   return (
//     <button
//       id=""
//       type="button">
//     </button>
//   );
// }
// function (props) {
//   return (
//     <button
//       id=""
//       type="button">
//     </button>
//   );
// }
