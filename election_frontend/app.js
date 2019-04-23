let voteIsAllowed = "hidden";
window.onload = async () => {
    await window.ethereum.enable();

    contract.on("Vote", await onVoteCallback);
    contract.on("NewCandidate", onNewCandidateCallback);
    getCandidates();
	candidateList();
    // getElectionName();
    // getCandidates();
    // contract.on("Vote", onVoteCallback);
    // contract.on("NewCandidate", onNewCandidateCallback);
    // candidateList();
    // contract.on("NewCandidate", (candidateName, event) => {

    //     console.log(candidateName);
    //     console.log(event);
    // });
}
async function addNewCandidate(name) {
    try {
        await contract.addCandidate(name);
    }
    catch (error) {
        console.log(error.message);
        console.log(error.reason);
    }
}

async function authorizeVoter(address) {
    await contract.authorize(address);
}
async function getElectionName() {
    let name = await contract.name();
    $('#name').html(name.toString());
    //
    let owner = await contract.owner();
    let currentAccount = await provider.getSigner().getAddress();

    //header messages
    $('#header').empty();
    if (currentAccount == owner) {
        $('#header').append('<h4>You are the Owner of this Election</h4>');
        //
        showTab("addCandidate", true);
        showTab("voters", false);
        showTab("candidates", false);
    }
    else {
        hideTab("addCandidate");
        hideTab("voters");
        showTab("candidates", true);
    }
    let voter = await contract.voters(currentAccount);
    if (voter.authorized) {
        $('#header').append('<h4>You are authorized to vote</h4>');
        if (voter.voted) {
            let votedCandidate = await contract.candidates(voter.vote);
            $('#header').append('<h4>You already voted to '
                + await votedCandidate.name + '</h4>');
            voteIsAllowed = "hidden";
        }
        else {
            $('#header').append('<h4>You don\'t vote yet</h4>');
            voteIsAllowed = "visible";
        }

    }
    else {
        $('#header').append('<h4>You aren\'t authorized to vote</h4>');
        voteIsAllowed = "hidden";

    }
}

async function getCandidates() {
    $('#candidates').empty();
    let numCandidate = await contract.getNumCandidate();
    for (var i = 0; i < numCandidate; i++) {
        let candidate = await contract.candidates(i);
        await addCandidateToUI(candidate, i);
        console.log(i);
    }
}


async function addCandidateToUI(candidate, id) {
    let vote = candidate.voteCount;
    let total = await contract.totalVotes();
    let percentage = (vote * 100 / total).toFixed(2);
    percentage = isNaN(percentage) ? 0 : percentage;

    $('#candidates').append(getCandidateHtml(candidate.name, id, percentage));
}


function getCandidateHtml(name, id, vote) {
    var html = `<br>
                <div id="${name}" class="container candidate">
                    <div class="form-group col-md-12" style="padding:0px;margin-bottom:5px;">
                        <div class="form-group col-md-6" style="margin:0px;">
                            <span class="lead" style="margin:0px;padding:0px;">${name}</span>
                            <button type="button" class="btn btn-primary voteBtn" 
                                style="margin:0px;float:right;visibility:`+ voteIsAllowed + `" 
                                data-index="${id}">Vote</button>
                        </div>
                    </div>
                    <br>
                    <div  class="form-group col-md-6" style="margin:0px;">
                        <div class="progress"><div class="progress-bar bg-info" role="progressbar" style="width: ${vote + "%"}" aria-valuenow="${vote}" aria-valuemin="0" aria-valuemax="100">${vote + "%"}</div></div>
                    </div>
                </div>
            `;
    return html;
}



$(document).on('click', '.voteBtn', function (e) {
    e.preventDefault(e);
    var candidateID = $(this).attr("data-index");
    contract.vote(candidateID).then(tx => console.log(tx));
})


async function onVoteCallback() {
    // alert('onVoteCallback');
    await getCandidates();
}



function onNewCandidateCallback(name) {
    $('#candidateList').append(
        '<a class="list-group-item">' + name
        + '<span class="badge">0</span></a>'
    );
    console.log(name);
}


async function candidateList() {
    let numCandidate = await contract.getNumCandidate();
    $('#candidateList').empty();
    for (let i = 0; i < numCandidate; i++) {
        let candidate = await contract.candidates(i);
        $('#candidateList').append(
            '<a class="list-group-item">' + candidate.name
            + '<span class="badge">' + candidate.voteCount + '</span></a>'
        );
    }
}


function showTab(tab, active) {
    $("#" + tab + "Li").show();
    if (active) {
        $("#" + tab + "Li").addClass("active");
        $("#" + tab).addClass("in active");
    }
    else {
        $("#" + tab + "Li").removeClass("active");
        $("#" + tab).removeClass("in active");
    }
}

function hideTab(tab) {
    $("#" + tab + "Li").hide();
    $("#" + tab + "Li").removeClass("active");
    $("#" + tab).removeClass("in active");
}