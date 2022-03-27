const MeetingPurpose = {
    PDCHAT: "PDChat",
    SPECREVIEW: "SpecReview",
    GROOMING: "Grooming",
    SPRINTPLANNING: "SprintPlanning",
    INTERVIEW: "Interview"
};
Object.freeze(MeetingPurpose);

function getPurpose(purpose){
    if (purpose === "PDChat")
        return MeetingPurpose.PDCHAT;
    if (purpose === "SpecReview")
        return  MeetingPurpose.SPECREVIEW;
    if (purpose === "Grooming")
        return MeetingPurpose.GROOMING;
    if (purpose === "SprintPlanning")
        return MeetingPurpose.SPRINTPLANNING;
    if (purpose === "Interview")
        return MeetingPurpose.INTERVIEW;

}

module.exports = {getPurpose, MeetingPurpose};

