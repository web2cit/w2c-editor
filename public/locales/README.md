translation.json
all the rest

itemTypes.json
From Zotero

languageCodes.json
Based after https://en.wikipedia.org/wiki/Template:Citation_Style_documentation/language/doc,
which uses Cs1 documentation support module's LANG_LISTER to get names for ISO 639-1,
-2 and -3 codes, and corresponding IETF language tags:
https://en.wikipedia.org/wiki/Module:Cs1_documentation_support
{{#invoke:cs1 documentation support|lang_lister|list=2char|lang=en}}
{{#invoke:cs1 documentation support|lang_lister|list=3char|lang=en}}
{{#invoke:cs1 documentation support|lang_lister|list=ietf2|lang=en}}
{{#invoke:cs1 documentation support|lang_lister|list=ietf3|lang=en}}

Note that some names include a dagger (†) at the end, indicating that their were
overriden from those returned by MediaWiki (see remappings in https://en.m.wikipedia.org/wiki/Module:Citation/CS1/Configuration). Remove this dagger.
