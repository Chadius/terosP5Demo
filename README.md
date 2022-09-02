# Teros Demos

Test different business domains and game ideas for the strategy game.

## hitRate

A hit rate calculator. It assumes attacker and defender roll a 6-sided die with an adjustment for the attack roll.
It shows the chance the attacker will meet or beat the defender's roll.

## How to use the page
Use the -1 and +1 buttons to adjust the attack bonus.

On the bottom of the page you can download the hit rates in a Tab Separated spreadsheet.

### Degrees of Success
There are 4 degrees of success: Critical Success, Success, Failure, Critical Failure.

Two ways to get a Critical Success:
- The attacker beats the defender by 6 or more.
- The attacker rolls a 6, and beats the defender by 5 or more.

- Two ways to get a Critical Failure:
- The attacker misses the defender by 6 or more.
- The attacker rolls a 1, and misses the defender by 5 or more.

If it is not a Critical effect, then the attack was a Success or Failure if it beat or missed the defender roll.

### Scoring Heuristic
An score is shown for how useful the roll is. An AI can use this to determine the most useful strategy.
- Critical Success: 4 points
- Success: 2 points
- Failure: 1 points
- Critical Failure: 0 points

With 36 pairs of rolls, scores can range from 0 to 144.

For example, if there is no attack bonus, the score is 58.
- Critical Success: Attacker rolls a 6, Defender rolls a 1. This is worth 4 points total.
- Critical Failure: Attacker rolls a 1, Defender rolls a 6. This is worth 0 points total.
- Success: There are 20 pairs of rolls. Each is worth 2 points, so this is 40 points total.
- Failure: There are 14 pairs of rolls. Each is worth 1 point, so this is 14 points total.

4 + 0 + 40 + 14 = 58 points.

### Observations

To guarantee a Critical Success, the attack bonus must be at least 11.
- If attacker rolls a 1 and defender rolls a 6, after bonuses it is now 12 to 6. The attacker beats by 6 in even the worst possible case.
- 12 and higher attack bonuses do not change this outcome.
- With a 10 attack bonus, 1 vs 6 is adjusted to 11 vs 6. The attacker wins by 5. This is a success.

To guarantee a Critical Failure, the attack bonus must be at most -11.
- If attacker rolls a 6 and defender rolls a 1, after bonuses it is now -5 to 1. The attacker misses by 6 in even the best possible case.
- -12 and lower attack bonuses do not change this outcome.
- With a -10 attack bonus, 6 vs 1 is adjusted to -4 vs 1. The attacker misses by 5. This is a failure.

Critical Success and Critical Failure is possible with the same roll only if the attack bonus is 0.
- A +1 attack bonus means the attacker cannot Critically Fail.
- A -1 attack bonus means the attacker cannot Critically Succeed.
- Even a minor +1 or -1 bonus tips the scales.

A +5 attack bonus means the attacker can Succeed or Critically Succeed, but they cannot fail.
- The attacker could miss the defender with a +4 bonus (1 vs 6), so they could Fail.

A -6 attack bonus means the attacker can Fail or Critically Fail, but they cannot succeed.
- The attacker could tie the defender with a -5 attack bonus (6 vs 1), so they could Succeed.

I'd like to keep bonuses between -4 and +4.
- Symmetry is nice. Because the attacker always wins ties the chances tilt in the attacker's favor.
- +4 attack bonus breakdown: 11 Critical Successes, 24 Successes, 1 Failure, 0 Critical Failures
- -4 attack bonus breakdown: 0 Critical Successes, 3 Successes, 22 Failure, 11 Critical Failures
