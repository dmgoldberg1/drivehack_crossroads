export namespace DataTypes {
  export interface Line {
    points: [number, number, number, number];
    name: string;
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
    name: string;
    count: number;
  }
}
