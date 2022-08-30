# Teros Demos

Test different business domains and game ideas for the strategy game.

## hitRate

A hit rate calculator. It assumes attacker and defender roll a 6-sided die with an adjustment for the attack roll.
It shows the chance the attacker will meet or beat the defender's roll.

It shows the degree of success from the roll:
- Critical Success: The attacker beats the defender by 6 or more. 
- Critical Success: The attacker beats the defender by 5, and rolls a 6. 
- Success: If the attacker beats the defender, it's a Success.
- Failure: If the attacker is less than the defender, it's a Failure.
- Critical Failure: The attacker misses the defender by 6 or more.
- Critical Failure: The attacker misses the defender by 5, and rolls a 1.

An score is shown for how useful the roll is. An AI can use this to determine the most useful strategy.
- Critical Success: 4 points
- Success: 2 points
- Failure: 1 points
- Critical Failure: 0 points

The average score is calculated for every possible roll given attacker adjustment. 
- With a -11 adjustment, the attacker will always critically fail. Even in the best possible case (6 vs 1) the attacker will miss by 6.
- With a +11 adjustment, the attacker will always critically succeed. Even in the worst possible case (1 vs 6) the attacker will beat the defender by 6.
