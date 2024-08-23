export namespace DataTypes {
  export interface Line {
    points: [number, number, number, number];
    id: string;
  }
  export interface LineRequest {
    video_id: number;
    lines: Line[];
  }
  export interface Image {
    success: boolean;
    width;
    height;
    preview: string;
    video_id: number;
  }
  export interface LineResult {
    id: string;
    count: number;
  }
}
