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
        this.degreeScoreSum = {};
        this.degreeScoreMultiplier = {};
        this.score = 0;
        this.degreeByAttackDefendRoll = {};
        this.reset();
    }

    reset() {
        this.degreeCount = {
            3 : 0,
            2 : 0,
            1 : 0,
            0: 0,
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

        this.degreeByAttackDefendRoll = {
            1: {
                1: undefined,
                2: undefined,
                3: undefined,
                4: undefined,
                5: undefined,
                6: undefined,
            },
            2: {
                1: undefined,
                2: undefined,
                3: undefined,
                4: undefined,
                5: undefined,
                6: undefined,
            },
            3: {
                1: undefined,
                2: undefined,
                3: undefined,
                4: undefined,
                5: undefined,
                6: undefined,
            },
            4: {
                1: undefined,
                2: undefined,
                3: undefined,
                4: undefined,
                5: undefined,
                6: undefined,
            },
            5: {
                1: undefined,
                2: undefined,
                3: undefined,
                4: undefined,
                5: undefined,
                6: undefined,
            },
            6: {
                1: undefined,
                2: undefined,
                3: undefined,
                4: undefined,
                5: undefined,
                6: undefined,
            },
        };
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

                this.degreeByAttackDefendRoll[attackRoll][defenseRoll] = degreeOfSuccess;
            }
        }

        let sum = 0;
        Object.keys(this.degreeScoreSum).forEach((degreeOfSuccess) => {
            sum += this.degreeScoreSum[degreeOfSuccess];
        });
        this.score = sum;
    }

    getRollsByDegree() {
        const rollsByDegree = {
            0: [],
            1: [],
            2: [],
            3: [],
        };

        for (let attackRoll = 1; attackRoll <= 6; attackRoll++) {
            for (let defenseRoll = 1; defenseRoll <= 6; defenseRoll++) {
                const degreeOfSuccess = this.degreeByAttackDefendRoll[attackRoll][defenseRoll];
                rollsByDegree[degreeOfSuccess].push([attackRoll, defenseRoll]);
            }
        }

        return rollsByDegree;
    }

    printRollsByDegree() {
        const rollsByDegree = this.getRollsByDegree();
        const printoutByDegree = {
            0: undefined,
            1: undefined,
            2: undefined,
            3: undefined,
        };

        Object.keys(rollsByDegree).forEach(degree => {
            const rolls = rollsByDegree[degree];
            if (rolls.length == 0) {
                printoutByDegree[degree] = "None";
                return;
            }
            const printRolls = rolls.map(pair => {
                return pair[0] + "," + pair[1];
            })
            printoutByDegree[degree] = printRolls.join(" ");
        })

        return printoutByDegree;
    }
}

let hitRatesByAttackBonus;
let downloadButton;
let attackBonusUpButton;
let attackBonusDownButton;
let attackBonusToDraw = 0;

function setup() {
    createCanvas(640, 800);

    hitRatesByAttackBonus = {};
    for (let i = hitRateMinBonus; i <= hitRateMaxBonus; i++) {
        hitRatesByAttackBonus[i] = new HitRateCalculator(i);
        hitRatesByAttackBonus[i].calculateHitRate();
    }

    attackBonusToDraw = 0;

    downloadButton = createButton('download TSV');
    downloadButton.position(0, 800);
    downloadButton.mousePressed(downloadCSV);

    attackBonusDownButton = createButton('-1');
    attackBonusDownButton.position(100, 30);
    attackBonusDownButton.mousePressed(decreaseAttackBonus);

    attackBonusUpButton = createButton('+1');
    attackBonusUpButton.position(150, 30);
    attackBonusUpButton.mousePressed(increaseAttackBonus);
}

function drawDetailedHitRate(calc) {
    push();
    fill(32);
    text("Attack Bonus: " + calc.attackBonus, 20, 20);
    text("Score: ", 20, 60);
    text(calc.score, 100, 60);
    text("(max is 144)", 150, 60);

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

    const rollPrintout = calc.printRollsByDegree();
    [
        degreeCriticalSuccess,
        degreeSuccess,
        degreeFailure,
        degreeCriticalFailure
    ].forEach((degree, index) => {
        text(rollPrintout[degree], 220, 80 + (index * 20))
    });
    pop();
}

function drawHitRateTable() {
    push();
    text("less than -11 gives the same score as -11", 40, 210);
    text("more than 11 gives the same score as 11", 40, 230);

    text("Attack bonus | Score ", 20, 250);

    compareStringsAsNumbers = (a, b) => {
        return parseInt(a) - parseInt(b);
    }

    Object.keys(hitRatesByAttackBonus).sort(compareStringsAsNumbers).forEach((attackBonus, index) => {
        const score = hitRatesByAttackBonus[attackBonus].score;
        fill(32);
        text(attackBonus, 20, 250 + 20 * (1 + index));
        text(score, 100, 250 + 20 * (1 + index));
    })
    pop();
}

function draw() {
    background(220);

    drawDetailedHitRate(hitRatesByAttackBonus[attackBonusToDraw]);
    drawHitRateTable();
}

function increaseAttackBonus() {
    attackBonusToDraw += 1;
    if (attackBonusToDraw > hitRateMaxBonus) {
        attackBonusToDraw = hitRateMaxBonus;
    }
}

function decreaseAttackBonus() {
    attackBonusToDraw -= 1;
    if (attackBonusToDraw < hitRateMinBonus) {
        attackBonusToDraw = hitRateMinBonus;
    }
}

function downloadCSV() {
    let rows = [
        [
            "Attack bonus",
            "Score",
            "Critical Successes",
            "Successes",
            "Failures",
            "Critical Failures",
        ]
    ];

    for (let attackRoll = 1; attackRoll <= 6; attackRoll++) {
        for (let defenseRoll = 1; defenseRoll <= 6; defenseRoll++) {
            rows[0].push(attackRoll + "," + defenseRoll);
        }
    }

    for(let i = hitRateMinBonus; i <= hitRateMaxBonus; i++) {
        const hitRate = hitRatesByAttackBonus[i];

        const newRow = [
            i,
            hitRate.score,
            hitRate.degreeCount[degreeCriticalSuccess],
            hitRate.degreeCount[degreeSuccess],
            hitRate.degreeCount[degreeFailure],
            hitRate.degreeCount[degreeCriticalFailure],
        ];

        for (let attackRoll = 1; attackRoll <= 6; attackRoll++) {
            for (let defenseRoll = 1; defenseRoll <= 6; defenseRoll++) {
                // Add the score earned with such a roll
                const degreeOfSuccess = hitRate.degreeByAttackDefendRoll[attackRoll][defenseRoll];
                newRow.push(
                    hitRate.degreeScoreMultiplier[degreeOfSuccess]
                );
            }
        }

        rows.push(newRow);
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
