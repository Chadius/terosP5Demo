const degreeCriticalSuccess = 3
const degreeSuccess = 2
const degreeFailure = 1
const degreeCriticalFailure = 0

const hitRateMinBonus = -11
const hitRateMaxBonus = 11

class HitRateCalculator {
    constructor(attackBonus) {
        this.attackBonus = attackBonus;
        this.degreeCount = {};
        this.degreeRolls = {};
        this.degreeScoreSum = {};
        this.degreeScoreMultiplier = {};
        this.score = 0;
        this.reset();
    }

    reset() {
        this.degreeCount = {
            3 : 0,
            2 : 0,
            1 : 0,
            0: 0,
        };
        this.degreeRolls = {
            3 : {},
            2 : {},
            1 : {},
            0: {},
        };
        this.degreeScoreSum = {
            3 : 0,
            2 : 0,
            1 : 0,
            0: 0,
        };
        this.degreeScoreMultiplier = {
            3: 4,
            2: 2,
            1: 1,
            0: 0,
        };

        this.score = 0;
    }

    calculateHitRate() {
        this.reset();

        for (let attackRoll = 1; attackRoll <= 6; attackRoll++) {
            for (let defenseRoll = 1; defenseRoll <= 6; defenseRoll++) {

                let rollResult = attackRoll + this.attackBonus - defenseRoll;

                const isACriticalFailure = (rollResult <= -6 || (attackRoll === 1 && rollResult <= -5))
                const isACriticalSuccess = (rollResult >= 6 || (attackRoll === 6 && rollResult >= 5))

                const isASuccess = (!isACriticalSuccess && !isACriticalFailure && rollResult >= 0)
                const isAFailure = (!isACriticalSuccess && !isACriticalFailure && rollResult < 0)

                let degreeOfSuccess = degreeCriticalFailure;

                if (isACriticalSuccess) {
                    degreeOfSuccess = degreeCriticalSuccess;
                } else if (isASuccess) {
                    degreeOfSuccess = degreeSuccess;
                } else if (isAFailure) {
                    degreeOfSuccess = degreeFailure;
                } else {
                    degreeOfSuccess = degreeCriticalFailure;
                }

                this.degreeScoreSum[degreeOfSuccess] += this.degreeScoreMultiplier[degreeOfSuccess];
                this.degreeCount[degreeOfSuccess] += 1;

                const roll = attackRoll + defenseRoll;
                if (this.degreeRolls[degreeOfSuccess][roll]) {
                    this.degreeRolls[degreeOfSuccess][roll] += 1;
                } else {
                    this.degreeRolls[degreeOfSuccess][roll] = 1;
                }
            }
        }

        let sum = 0;
        Object.keys(this.degreeScoreSum).forEach((degreeOfSuccess) => {
            sum += this.degreeScoreSum[degreeOfSuccess];
        });
        this.score = sum;
    }

    describeRolls(degree) {
        const countsPerRoll = Object.keys(this.degreeRolls[degree]).map((score) => {
            return score + "(" + this.degreeRolls[degree][score]+ ")";
        })

        return countsPerRoll.join(", ");
    }
}

const tn = 7;
let hitRatesByAttackBonus;
let downloadButton;

function setup() {
    createCanvas(640, 800);

    hitRatesByAttackBonus = {};
    for (let i = hitRateMinBonus; i <= hitRateMaxBonus; i++) {
        hitRatesByAttackBonus[i] = new HitRateCalculator(i);
        hitRatesByAttackBonus[i].calculateHitRate();
    }

    downloadButton = createButton('download TSV');
    downloadButton.position(0, 800);
    downloadButton.mousePressed(downloadCSV);
}

function drawDetailedHitRate(calc) {
    push();
    fill(32);
    text("Attack Bonus: " + calc.attackBonus, 20, 20);
    text("Score: ", 20, 40);
    text(calc.score, 100, 40);
    text("(max is 144)", 150, 40);

    text("Crit Success: ", 20, 80);
    text("Success: ", 20, 100);
    text("Failure: ", 20, 120);
    text("Crit Failure: ", 20, 140);
    text(calc.degreeCount[degreeCriticalSuccess], 100, 80);
    text(calc.degreeCount[degreeSuccess], 100, 100);
    text(calc.degreeCount[degreeFailure], 100, 120);
    text(calc.degreeCount[degreeCriticalFailure], 100, 140);
    text("(" + calc.degreeCount[degreeCriticalSuccess] * 4 + " points)", 150, 80);
    text("(" + calc.degreeCount[degreeSuccess] * 2 + " points)", 150, 100);
    text("(" + calc.degreeCount[degreeFailure] * 1 + " points)", 150, 120);
    text("(" + calc.degreeCount[degreeCriticalFailure] * 0 + " points)", 150, 140);

    text(calc.describeRolls(degreeCriticalSuccess), 220, 80);
    text(calc.describeRolls(degreeSuccess), 220, 100);
    text(calc.describeRolls(degreeFailure), 220, 120);
    text(calc.describeRolls(degreeCriticalFailure), 220, 140);
    pop();
}

function drawHitRateTable() {
    push();
    text("less than -11 gives the same score as -11", 40, 210);
    text("more than 11 gives the same score as 11", 40, 230);

    text("Target Number | Score ", 20, 250);

    compareStringsAsNumbers = (a, b) => {
        return parseInt(a) - parseInt(b);
    }

    Object.keys(hitRatesByAttackBonus).sort(compareStringsAsNumbers).forEach((targetNumber, index) => {
        const score = hitRatesByAttackBonus[targetNumber].score;
        fill(32);
        text(targetNumber, 20, 250 + 20 * (1 + index));
        text(score, 100, 250 + 20 * (1 + index));
    })
    pop();
}

function draw() {
    background(220);

    drawDetailedHitRate(hitRatesByAttackBonus[hitRateMinBonus]);
    drawHitRateTable();
}

function downloadCSV() {
    let rows = [
        [
            "Target Number",
            "Score",
            "Critical Successes",
            "rolls",
            "Successes",
            "rolls",
            "Failures",
            "rolls",
            "Critical Failures",
            "rolls",
        ]
    ];

    for(let i = hitRateMinBonus; i <= hitRateMaxBonus; i++) {
        const hitRate = hitRatesByAttackBonus[i];

        rows.push([
            i,
            hitRate.score,
            hitRate.degreeCount[degreeCriticalSuccess],
            hitRate.describeRolls(degreeCriticalSuccess),
            hitRate.degreeCount[degreeSuccess],
            hitRate.describeRolls(degreeSuccess),
            hitRate.degreeCount[degreeFailure],
            hitRate.describeRolls(degreeFailure),
            hitRate.degreeCount[degreeCriticalFailure],
            hitRate.describeRolls(degreeCriticalFailure),
        ]);
    }

    let tsv = rows.map((column) => {
        return column.join("\t");
    });
    console.log(tsv.join("\n"));

    let tsvFile;
    let downloadLink;

    // CSV file
    tsvFile = new Blob([tsv.join("\n")], {type: "text/tsv"});

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = "hitRates.tsv";

    // Create a link to the file
    downloadLink.href = window.URL.createObjectURL(tsvFile);

    // Hide download link
    downloadLink.style.display = "none";

    // Add the link to DOM
    document.body.appendChild(downloadLink);

    // Click download link
    downloadLink.click();

    console.table(rows);
}
