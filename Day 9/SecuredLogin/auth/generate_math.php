<?php
session_start();

// Generate math question with expanded operations
$min = 1;
$max = 12;
$operators = ['+', '-', '×', '÷', '%', '^', '√'];
$operator = $operators[array_rand($operators)];

if ($operator === '+') {
    $a = rand($min, $max);
    $b = rand($min, $max);
    $answer = $a + $b;
    $question = "$a + $b = ?";
} elseif ($operator === '-') {
    $a = rand($min, $max);
    $b = rand($min, $max);
    // Ensure non-negative result
    if ($a < $b) {
        [$a, $b] = [$b, $a];
    }
    $answer = $a - $b;
    $question = "$a - $b = ?";
} elseif ($operator === '×') {
    $a = rand(1, 10); // Smaller numbers for multiplication
    $b = rand(1, 10);
    $answer = $a * $b;
    $question = "$a × $b = ?";
} elseif ($operator === '÷') {
    // Division (ensure whole number)
    $b = rand(1, 10);
    $answer = rand(1, 10);
    $a = $b * $answer;
    $question = "$a ÷ $b = ?";
} elseif ($operator === '%') {
    // Modulo operation
    $a = rand(10, 50);
    $b = rand(2, 10);
    $answer = $a % $b;
    $question = "$a % $b = ?";
} elseif ($operator === '^') {
    // Power operation (smaller numbers)
    $a = rand(2, 5);
    $b = rand(2, 3);
    $answer = pow($a, $b);
    $question = "$a^$b = ?";
} else { // Square root
    $a = rand(1, 10);
    $perfect_square = $a * $a;
    $answer = $a;
    $question = "√$perfect_square = ?";
}

$_SESSION['math_captcha_answer'] = $answer;

// Return JSON response
header('Content-Type: application/json');
echo json_encode([
    'question' => $question,
    'answer' => $answer
]);
