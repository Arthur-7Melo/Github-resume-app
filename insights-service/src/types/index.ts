export interface LanguageStat {
  name: string;
  bytes: number;
  pct: number;
}

export interface Snapshot {
  repo: string;
  fetchedAt: string;
  top_languages: LanguageStat[];
  commits_last_week: number;
  stars: number;
}