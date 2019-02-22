document.addEventListener("DOMContentLoaded", function(event) { 
  // Uses the built in fetch to read the textfile
  fetch("medlemsgrad.txt")
    .then(handleErrors)
    .then(response =>
          response.text()
          .then(text =>
                document.getElementById("Noen").innerHTML = hvem(text))
         )
    .catch(error => console.log(error));
});

function handleErrors(response) {
    if (!response.ok) {
        //If medlemsgrad.text not found set hvem to Noen
      document.getElementById("Noen").innerHTML = "Noen";
      throw "medelmsgrad.txt is missing!";
    }
    return response;
}



function hvem(text) {
    let lines = text.split(/\r\n|\n/);
    let members = getMembers(lines);
    let accumulativeMembers = getAccumulutiveMembers(members);
    return getHvem(accumulativeMembers);
}


function getMembers(lines) {
    let members = [];
    // Iterates over each line in the document
    lines.forEach(function(line) {
        let data = line.split(',');
        let membershipDegree = parseFloat(data[1]);
        // This is to avoid the headers (navn, medlemsgrad),
        // if membershipdegree is not a number skip
        if (!isNaN(membershipDegree)) {
            let name = data[0].trim();
            members.push([name, membershipDegree]);
        }
    });
    return members;
}

function getAccumulutiveMembers(members) {

    // The next function normalizes the membershipDegree to 1 and order the
    // members accumulatively. Example: Let
    //
    // [noen: 4, a: 1, b, 1]
    //
    // then the accumululative list looks like
    //
    // [noen: 4/6, a: 4/6 + 1/6, b: 4/6 + 1/6 + 1/6]
    //
    // [noen: 4/6, a: 5/6, b: 1]
    //
    // As it is sorted in ascending order
    let totalMembershipDegree = 0;
    members.forEach(function(member) {
        totalMembershipDegree += member[1]
    });

    let accumulative = 0;
    let accumulativeMemberlist = [];
    members.forEach(function(member) {
        name = member[0];
        membershipDegree = member[1];
        activity = parseFloat(membershipDegree) / totalMembershipDegree;
        accumulative += activity;
        accumulativeMemberlist.push([name, accumulative]);
    });

    // Sorts the accumulative list in ascending order (low to high)
    accumulativeMemberlist.sort(function(a, b) {
        return a[1] > b[1] ? 1 : a[1] < b[1] ? -1 : 0
    });

    accumulativeMemberlist[accumulativeMemberlist.length - 1][1] = 1;

    return accumulativeMemberlist;
}

function getHvem(accumulativeMembers) {
    // Sets hvem as the default name. Tries 100 times to randomly pick someone
    // from the accumulatively membership list (including noen)
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
    console.log(accumulativeMembers);
    let randInt = Math.random();
    for (const member of accumulativeMembers) {
        var name = member[0];
        let number = member[1];

        if (randInt <= number) {
            return name;
        }
    };
    return name;
}

// }
