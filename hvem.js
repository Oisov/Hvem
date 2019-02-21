$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "medlemsgrad.txt",
        dataType: "text",
        success: function(data) {
            processData(data);
        }
    });
});

function processData(allText) {
    // Splits the file on newline
    let allTextLines = allText.split(/\r\n|\n/);
    let members = [];
    let totalMembershipDegree = 0;

    // Iterates over each line in the document
    allTextLines.forEach(function(line) {
        let data = line.split(',');
        let membershipDegree = parseFloat(data[1]);
        // This is to avoid the headers (navn, medlemsgrad),
        // if membershipdegree is not a number skip
        if (!isNaN(membershipDegree)) {
            let name = data[0].trim();
            totalMembershipDegree += membershipDegree;
            members.push([name, membershipDegree]);
        }
    });

    // Sorts the members according to their membershipdegree
    members.sort(function(a, b) {
        return a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0
    });

    // The next codeblock normalizes the membershipDegree to 1
    let accumulative = 0;
    let accumulativeMemberlist = [];
    members.forEach(function(person) {
        name = person[0];
        membershipDegree = person[1];
        activity = parseFloat(membershipDegree) / totalMembershipDegree;
        accumulative += activity;
        accumulativeMemberlist.push([name, accumulative]);
    });

    // Sorts the accumulative list in ascending order (low to high)
    accumulativeMemberlist.sort(function(a, b) {
        return a[1] > b[1] ? 1 : a[1] < b[1] ? -1 : 0
    });

    // Sets hvem as the default name. Tries 100 times to randomly
    // pick someone from the membership list (including noen)
    // according to their accumulative membership degree
    var hvem = "Noen";
    for (i = 0; i < 100; i++) {
        let randInt = Math.random();
        for (const member of accumulativeMemberlist) {
            let name = member[0];
            let number = member[1];

            if (randInt < number) {
                hvem = name;
                break
            }
        };
    }

    document.getElementById("Noen").innerHTML = hvem;

}
