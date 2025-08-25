angular.module('calculatorApp', [])
.controller('CalculatorController', function($scope) {
    $scope.currentOperand = '';
    $scope.previousOperand = '';
    $scope.operation = undefined;
    $scope.shouldResetScreen = false;
    $scope.scientificMode = false;
    $scope.angleMode = 'DEG';
    $scope.waitingForSecondOperand = false;

    // Toggle between standard and scientific modes
    $scope.toggleMode = function() {
        $scope.scientificMode = !$scope.scientificMode;
    };

    // Set angle mode (DEG or RAD)
    $scope.setAngleMode = function(mode) {
        $scope.angleMode = mode;
    };

    // Convert angle to radians if needed
    $scope.toRadians = function(angle) {
        if ($scope.angleMode === 'DEG') {
            return angle * Math.PI / 180;
        }
        return angle;
    };

    // Convert radians to degrees if needed
    $scope.toDegrees = function(radians) {
        if ($scope.angleMode === 'DEG') {
            return radians * 180 / Math.PI;
        }
        return radians;
    };

    // Scientific functions
    $scope.scientificFunction = function(func) {
        if ($scope.currentOperand === '') return;
        
        const num = parseFloat($scope.currentOperand);
        let result;

        switch (func) {
            case 'sin':
                result = Math.sin($scope.toRadians(num));
                break;
            case 'cos':
                result = Math.cos($scope.toRadians(num));
                break;
            case 'tan':
                result = Math.tan($scope.toRadians(num));
                break;
            case 'asin':
                result = $scope.toDegrees(Math.asin(num));
                break;
            case 'acos':
                result = $scope.toDegrees(Math.acos(num));
                break;
            case 'atan':
                result = $scope.toDegrees(Math.atan(num));
                break;
            case 'log':
                result = Math.log10(num);
                break;
            case 'ln':
                result = Math.log(num);
                break;
            case 'sqrt':
                result = Math.sqrt(num);
                break;
            case 'pow':
                $scope.waitingForSecondOperand = true;
                $scope.previousOperand = num;
                $scope.operation = '^';
                $scope.currentOperand = '';
                return;
            case 'factorial':
                result = $scope.factorial(num);
                break;
            case 'exp':
                result = Math.exp(num);
                break;
            case 'abs':
                result = Math.abs(num);
                break;
            case 'pi':
                $scope.currentOperand = Math.PI.toString();
                return;
            case 'e':
                $scope.currentOperand = Math.E.toString();
                return;
            default:
                return;
        }

        $scope.currentOperand = result.toString();
        $scope.shouldResetScreen = true;
    };

    // Calculate factorial
    $scope.factorial = function(n) {
        if (n < 0 || n !== Math.floor(n)) {
            alert('Factorial is only defined for non-negative integers!');
            return NaN;
        }
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    };

    // Append number to current operand
    $scope.appendNumber = function(number) {
        if (number === '.' && $scope.currentOperand.includes('.')) return;
        if ($scope.shouldResetScreen) {
            $scope.currentOperand = '';
            $scope.shouldResetScreen = false;
        }
        $scope.currentOperand = $scope.currentOperand.toString() + number.toString();
    };

    // Choose operation
    $scope.chooseOperation = function(operation) {
        if ($scope.currentOperand === '') return;
        if ($scope.previousOperand !== '') {
            $scope.compute();
        }
        $scope.operation = operation;
        $scope.previousOperand = $scope.currentOperand;
        $scope.currentOperand = '';
        $scope.waitingForSecondOperand = false;
    };

    // Compute the result
    $scope.compute = function() {
        let computation;
        const prev = parseFloat($scope.previousOperand);
        const current = parseFloat($scope.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;

        switch ($scope.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert('Cannot divide by zero!');
                    return;
                }
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            case '^':
                computation = Math.pow(prev, current);
                break;
            default:
                return;
        }

        $scope.currentOperand = computation.toString();
        $scope.operation = undefined;
        $scope.previousOperand = '';
        $scope.shouldResetScreen = true;
        $scope.waitingForSecondOperand = false;
    };

    // Clear all
    $scope.clear = function() {
        $scope.currentOperand = '';
        $scope.previousOperand = '';
        $scope.operation = undefined;
        $scope.shouldResetScreen = false;
        $scope.waitingForSecondOperand = false;
    };

    // Delete last digit
    $scope.delete = function() {
        $scope.currentOperand = $scope.currentOperand.toString().slice(0, -1);
    };

    // Append decimal point
    $scope.appendDecimal = function() {
        if ($scope.shouldResetScreen) {
            $scope.currentOperand = '0';
            $scope.shouldResetScreen = false;
        }
        if ($scope.currentOperand.includes('.')) return;
        $scope.currentOperand = $scope.currentOperand.toString() + '.';
    };

    // Format display number
    $scope.getDisplayNumber = function(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    };

    // Handle keyboard input
    angular.element(document).on('keydown', function(event) {
        const key = event.key;
        
        if (key >= '0' && key <= '9') {
            $scope.$apply(function() {
                $scope.appendNumber(key);
            });
        } else if (key === '.') {
            $scope.$apply(function() {
                $scope.appendDecimal();
            });
        } else if (key === '+' || key === '-') {
            $scope.$apply(function() {
                $scope.chooseOperation(key);
            });
        } else if (key === '*') {
            $scope.$apply(function() {
                $scope.chooseOperation('×');
            });
        } else if (key === '/') {
            event.preventDefault();
            $scope.$apply(function() {
                $scope.chooseOperation('÷');
            });
        } else if (key === 'Enter' || key === '=') {
            $scope.$apply(function() {
                $scope.compute();
            });
        } else if (key === 'Escape') {
            $scope.$apply(function() {
                $scope.clear();
            });
        } else if (key === 'Backspace') {
            $scope.$apply(function() {
                $scope.delete();
            });
        }
    });
}); 