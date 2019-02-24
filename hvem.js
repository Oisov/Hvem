function updateHvem() {
    // Uses the built in fetch to read the textfile
    fetch("medlemsgrad.txt")
        .then(handleErrors)
        .then(response =>
            response.text()
            .then(text =>
                document.getElementById("Noen").innerHTML = hvem(text))
        )
        .catch(error => console.log(error));
}

document.addEventListener("DOMContentLoaded", function(event) {
    // Waits until the page is loaded then fires the updateHvem script
    updateHvem();
});

document.addEventListener('keyup', function(e) {
    // Reloads name on spacebar
    if (e.keyCode == 32) {
        updateHvem();
        console.clear();
    }
});

function handleErrors(response) {
    //If medlemsgrad.text not found set hvem to "Noen" and throw an error
    if (!response.ok) {
        document.getElementById("Noen").innerHTML = "Noen";
        throw "medelmsgrad.txt is missing!";
    }
    return response;
}

function squareError(members) {
    let squareError = 0;
    for (const [key, value] of Object.entries(members)) {
        squareError = (value[0] - value[1]) ** 2;
    }
    return squareError;
}

function testHvem(members, accumulativeMembers) {
    // This runs Hvem 10^7 times and checks how close the expected number
    // of times your name shows up is to how often your name actually shows up
    let numberOfTests = 10 ** 7;
    let total = getTotalMembership(members);

    let [choosen, name] = [{}, ""];
    members.forEach(member => {
        choosen[member[0]] = [0, numberOfTests * parseFloat(member[1]) / total];
    });

    for (i = 0; i < numberOfTests; i++) {
        name = getHvem(accumulativeMembers);
        choosen[name][0] += 1;
    }

    console.log(choosen);
    console.log(squareError(choosen));
}

function hvem(text) {
    let lines = text.split(/\r\n|\n/);
    let members = getMembers(lines);
    let accumulativeMembers = getAccumulutiveMembers(members);
    // Uncomment the line below to run some tests
    // testHvem(members, accumulativeMembers);
    return getHvem(accumulativeMembers);
}

function getMembers(lines) {
    // members = [[John Doe, 0.13], [Jane Roe, 0,23]]
    let members = [],
        name = "",
        membershipDegree = 0;

    lines.forEach(line => {
        [name, membershipDegree] = line.split(',');
        // This is to avoid the headers (navn, medlemsgrad),
        // if membershipdegree is not a number skip
        if (!isNaN(membershipDegree)) {
            members.push([name.trim(), parseFloat(membershipDegree)]);
        }
    });
    return members;
}

function getTotalMembership(members) {
    let totalMembershipDegree = 0;
    members.forEach(member => {
        totalMembershipDegree += member[1];
    });
    return totalMembershipDegree;
}

function getAccumulutiveMembers(members) {
    // The next function normalizes the membershipDegree to 1 and order the
    // members accumulatively in ascending order. Example: Let
    //
    // [noen: 4, a: 1, b, 1]
    //
    // then the accumululative list looks like
    //
    // [noen: 4/6, a: 4/6 + 1/6, b: 4/6 + 1/6 + 1/6]
    //
    // [noen: 4/6, a: 5/6, b: 1]
    let totalMembershipDegree = getTotalMembership(members),
        accumulative = 0,
        accumulativeMemberlist = [];

    for (const [name, membershipDegree] of members) {
        accumulative += membershipDegree / totalMembershipDegree;
        accumulativeMemberlist.push([name, accumulative]);
    };

    // Sorts the accumulative list in ascending order (low to high)
    accumulativeMemberlist.sort((a, b) => {
        return a[1] > b[1] ? 1 : a[1] < b[1] ? -1 : 0
    });

    // Sets the last member to 1, as the accumulative total should be 1
    // it is not one due to slight round off errors
    accumulativeMemberlist[accumulativeMemberlist.length - 1][1] = 1;

    return accumulativeMemberlist;
}

function getHvem(accumulativeMembers) {
    // Selects who has to perform the next task from the accumulative memberlist
    // Example:
    //
    // [noen: 4/6, a: 5/6, b: 1]
    //
    // We then pick a random integer in the range [0, 1]
    // If this random number is less than or equal to 4/6 then Noen is choosen.
    // If the random number is between 4/6 and 5/6, a is choosen
    // If the random number is between 5/6 and 1, b is choosen.
    // This means that the chance of picking Noen is 4 times as great as b or a
    // which is what we wanted.
    let randInt = Math.random();
    for (const [name, number] of accumulativeMembers) {
        if (randInt < number) {
            return name;
        }
    };
    return "Noen"; //This should never ever activate
}
