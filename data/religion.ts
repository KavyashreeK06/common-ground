export const RELIGION_TAGS = [
  "Christian",
  "Muslim",
  "Jewish",
  "Hindu",
  "Buddhist",
  "Sikh",
  "Bahá'í",
  "Another spiritual practice",
  "Not religious or spiritual",
] as const;

export const RELIGION_ORG_KEYWORDS: Record<string, string[]> = {
  "Christian": [
    "christian", "catholic", "cru", "navigators", "intervarsity", "orthodox christian",
    "fellowship", "campus ministry", "newman club", "encounter", "compass koinonia",
  ],
  "Muslim": ["muslim", "msa", "islamic", "niyyah"],
  "Jewish": [
    "jewish", "hillel", "kesher", "koach", "chabad", "kehillah", "keshet",
    "shalhevet", "beit sagol",
  ],
  "Hindu": ["hindu"],
  "Buddhist": ["buddhis", "buddhism"],
  "Sikh": ["sikh"],
  "Bahá'í": ["bahá'í", "bahai"],
  "Another spiritual practice": ["spiritual", "meditation", "mindfulness", "lotus lounge"],
  "Not religious or spiritual": [],
};
