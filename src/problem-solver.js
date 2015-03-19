function solveProblem(problem) {
    var factors = [];
    //a and b are just for counting from the number n to 2 to find the prime numbers
    var a = 2;
    for (var n = problem-1; n > a; n--) {
        var b = 2;
        //if the found number is divisible, we skip it
        while(b<n) {
            if (n % b == 0) {
                break;
            }
            else if (b == n - 1){
                if(!isDivisible(problem, n)) {
                	factors.push(n);
                }
            }
            b++;
        }
    }
    return factors;
}

function isDivisible(number, divisor) {
	if(number%divisor) {
		return true;
	} else {
		return false;
	}
}
