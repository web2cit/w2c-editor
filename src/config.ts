// I think it would make sense to have all of this pulled from the core

const CITOID_FIELDS = [
  "abstractNote",
  "accessDate",
  "applicationNumber",
  "archive",
  "archiveLocation",
  "artworkSize",
  "assignee",
  "attorneyAgentFirst",
  "attorneyAgentLast",
  "authorFirst",
  "authorLast",
  "bookAuthorFirst",
  "bookAuthorLast",
  "callNumber",
  "castMemberFirst",
  "castMemberLast",
  "code",
  "codeNumber",
  "commenterFirst",
  "commenterLast",
  "committee",
  "composerFirst",
  "composerLast",
  "conferenceName",
  "contributorFirst",
  "contributorLast",
  "cosponsorFirst",
  "cosponsorLast",
  "counselFirst",
  "counselLast",
  "country",
  "court",
  "date",
  "DOI",
  "edition",
  "editorFirst",
  "editorLast",
  "extra",
  "filingDate",
  "guestFirst",
  "guestLast",
  "history",
  "interviewerFirst",
  "interviewerLast",
  "isbn",
  "issn",
  "issue",
  "issuingAuthority",
  "itemType",
  "journalAbbreviation",
  "language",
  "legalStatus",
  "legislativeBody",
  "libraryCatalog",
  "medium",
  "meetingName",
  "number",
  "numberOfVolumes",
  "numPages",
  "oclc",
  "pages",
  "place",
  "PMCID",
  "PMID",
  "priorityNumbers",
  "producerFirst",
  "producerLast",
  "programmingLanguage",
  "publicationTitle",
  "publisher",
  "recipientFirst",
  "recipientLast",
  "references",
  "reporter",
  "reviewedAuthorFirst",
  "reviewedAuthorLast",
  "rights",
  "runningTime",
  "scale",
  "scriptwriterFirst",
  "scriptwriterLast",
  "section",
  "series",
  "seriesEditorFirst",
  "seriesEditorLast",
  "seriesNumber",
  "seriesText",
  "seriesTitle",
  "session",
  "shortTitle",
  "system",
  "tags",
  "title",
  "translatorFirst",
  "translatorLast",
  "type",
  "url",
  "versionNumber",
  "volume",
  "wordsByFirst",
  "wordsByLast"
]

// selection steps
export const selections = [
  {
    type: "citoid",
    config: [
      {
        name: "fieldname",
        type: "string",
        validationFn: () => true,  // a regex or a validation function
        options: CITOID_FIELDS
      }
    ]
  },
  {
    type: "xpath",
    config: [
      {
        name: "expression",
        type: "string",
        validationFn: () => true,
        options: []      
      }
    ]
  },
  {
    type: "fixed",
    config: [
      {
        name: "value",
        type: "string",
        validationFn: () => true,
        options: []
      }
    ]
  }
]

export const transformations = [
  {
    type: "",
    params: [
      {
        name: "",
        type: "string",
        validationFn: () => true,
        options: []
      }
    ],
    itemwise: true
  }
]