export interface ExportSettings {
  primaryColor: string;   // Hex, e.g. "#3B82F6"
  accentColor: string;    // Hex, e.g. "#F43F5E"
}

export interface ExportOptions {
  target: 'timeline' | 'analytics';
  whitespace: number;     // 5-25%, Default 15
}
