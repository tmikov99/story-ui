export type Genre =
  | 'FANTASY'
  | 'SCIENCE_FICTION'
  | 'HORROR'
  | 'MYSTERY'
  | 'ADVENTURE'
  | 'ROMANCE'
  | 'COMEDY'
  | 'DRAMA'
  | 'THRILLER'
  | 'POST_APOCALYPTIC';

interface GenreInfo {
  label: string;
  color: string;
}

const genreMap: Record<Genre | string, GenreInfo> = {
  FANTASY: { label: 'Fantasy', color: '#8e44ad' },
  SCIENCE_FICTION: { label: 'Science Fiction', color: '#2980b9' },
  HORROR: { label: 'Horror', color: '#c0392b' },
  MYSTERY: { label: 'Mystery', color: '#7f8c8d' },
  ADVENTURE: { label: 'Adventure', color: '#27ae60' },
  ROMANCE: { label: 'Romance', color: '#e91e63' },
  COMEDY: { label: 'Comedy', color: '#f1c40f' },
  DRAMA: { label: 'Drama', color: '#34495e' },
  THRILLER: { label: 'Thriller', color: '#e67e22' },
  POST_APOCALYPTIC: { label: 'Post-Apocalyptic', color: '#95a5a6' },
};

export function getGenreLabel(genre: Genre | string): string {
  if (genreMap[genre as Genre]) {
    return genreMap[genre as Genre].label;
  }

  return genre
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
export function getGenreColor(genre: Genre | string): string {
  return genreMap[genre]?.color ?? '#bbb';
}