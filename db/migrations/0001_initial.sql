CREATE TABLE IF NOT EXISTS disciplines (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL DEFAULT '',
  color TEXT NOT NULL,
  term TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY,
  discipline_id TEXT NOT NULL,
  title TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('assignment', 'exam', 'project', 'reading', 'other')),
  due_at TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'done')),
  weight REAL CHECK (weight IS NULL OR (weight >= 0 AND weight <= 100)),
  grade REAL CHECK (grade IS NULL OR (grade >= 0 AND grade <= 10)),
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (discipline_id) REFERENCES disciplines(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS activities_discipline_idx ON activities(discipline_id);
CREATE INDEX IF NOT EXISTS activities_due_at_idx ON activities(due_at);
CREATE INDEX IF NOT EXISTS activities_status_idx ON activities(status);
