export interface Filters {
  modeIds: number[];
  experienceMin: number | undefined;
  experienceMax: number | undefined;
  feesMin: number | undefined;
  feesMax: number | undefined;
  languageIds: number[];
  facilityIds: number[];
  sortBy: string;
  page: number;
}
