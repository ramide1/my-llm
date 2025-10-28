import { ImageUrl } from "./imageUrl.interface";
import { InputAudio } from "./inputAudio.interface";

export interface Content {
  type: 'text' | 'image_url' | 'input_audio';
  text?: string;
  image_url?: ImageUrl;
  input_audio?: InputAudio;
}