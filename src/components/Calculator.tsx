import { useState } from "react";
import { Button } from "./ui/button";

type OperationType = "+" | "-" | "*" | "/" | null;

export const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<OperationType>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);

  const handleNumber = (num: string) => {
    if (shouldResetDisplay) {
      setDisplay(num);
      setShouldResetDisplay(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (shouldResetDisplay) {
      setDisplay("0.");
      setShouldResetDisplay(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const handleOperation = (op: OperationType) => {
    if (previousValue !== null && operation !== null && !shouldResetDisplay) {
      calculate();
    }
    setPreviousValue(display);
    setOperation(op);
    setShouldResetDisplay(true);
  };

  const calculate = () => {
    if (previousValue === null || operation === null) return;

    const prev = parseFloat(previousValue);
    const current = parseFloat(display);
    let result = 0;

    switch (operation) {
      case "+":
        result = prev + current;
        break;
      case "-":
        result = prev - current;
        break;
      case "*":
        result = prev * current;
        break;
      case "/":
        result = prev / current;
        break;
    }

    setDisplay(String(result));
    setPreviousValue(null);
    setOperation(null);
    setShouldResetDisplay(true);
  };

  const handleClear = () => {
    setDisplay("0");
  };

  const handleAllClear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setShouldResetDisplay(false);
  };

  const handlePercentage = () => {
    setDisplay(String(parseFloat(display) / 100));
  };

  const handleToggleSign = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const buttonClass = "h-16 text-xl font-semibold rounded-2xl transition-all duration-200 active:scale-95";
  const numberButtonClass = `${buttonClass} bg-calculator-button-bg hover:bg-calculator-button-hover text-foreground`;
  const operatorButtonClass = `${buttonClass} bg-calculator-operator-bg hover:bg-calculator-operator-hover text-primary-foreground`;
  const equalsButtonClass = `${buttonClass} bg-calculator-equals-bg hover:bg-calculator-equals-hover text-accent-foreground`;
  const functionButtonClass = `${buttonClass} bg-muted hover:bg-muted/80 text-muted-foreground`;

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-calculator-body rounded-3xl shadow-2xl">
      <div className="bg-calculator-display-bg rounded-2xl p-6 mb-6 min-h-[100px] flex items-end justify-end">
        <div className="text-calculator-display-text text-5xl font-light overflow-hidden text-ellipsis">
          {display}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <Button onClick={handleAllClear} className={functionButtonClass}>
          AC
        </Button>
        <Button onClick={handleToggleSign} className={functionButtonClass}>
          +/-
        </Button>
        <Button onClick={handlePercentage} className={functionButtonClass}>
          %
        </Button>
        <Button onClick={() => handleOperation("/")} className={operatorButtonClass}>
          ÷
        </Button>

        <Button onClick={() => handleNumber("7")} className={numberButtonClass}>
          7
        </Button>
        <Button onClick={() => handleNumber("8")} className={numberButtonClass}>
          8
        </Button>
        <Button onClick={() => handleNumber("9")} className={numberButtonClass}>
          9
        </Button>
        <Button onClick={() => handleOperation("*")} className={operatorButtonClass}>
          ×
        </Button>

        <Button onClick={() => handleNumber("4")} className={numberButtonClass}>
          4
        </Button>
        <Button onClick={() => handleNumber("5")} className={numberButtonClass}>
          5
        </Button>
        <Button onClick={() => handleNumber("6")} className={numberButtonClass}>
          6
        </Button>
        <Button onClick={() => handleOperation("-")} className={operatorButtonClass}>
          -
        </Button>

        <Button onClick={() => handleNumber("1")} className={numberButtonClass}>
          1
        </Button>
        <Button onClick={() => handleNumber("2")} className={numberButtonClass}>
          2
        </Button>
        <Button onClick={() => handleNumber("3")} className={numberButtonClass}>
          3
        </Button>
        <Button onClick={() => handleOperation("+")} className={operatorButtonClass}>
          +
        </Button>

        <Button onClick={() => handleNumber("0")} className={`${numberButtonClass} col-span-2`}>
          0
        </Button>
        <Button onClick={handleDecimal} className={numberButtonClass}>
          .
        </Button>
        <Button onClick={calculate} className={equalsButtonClass}>
          =
        </Button>
      </div>
    </div>
  );
};
