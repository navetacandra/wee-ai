export type CompletionModel = {
  model_name: string;
  type: string;
  reported_type: string;
  description: string;
  cover_img_url: string;
  tags: string[];
};

export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

const _imgModels = [
  "stablediffusionapi/anything-midjourney",
  "stablediffusionapi/realism-engine-sdxl",
  "stablediffusionapi/epicrealism",
  "stablediffusionapi/ae-sdxl-v1",
  "stablediffusionapi/realistic-vision-v51",
  "stablediffusionapi/sdxl-basemodel-1",
  "stablediffusionapi/portrait-realistic-sdxl",
  "stablediffusionapi/sdxl-10-vae-fix",
  "stablediffusionapi/realistic-vision",
  "playgroundai/playground-v2-1024px-aesthetic",
  // "stabilityai/stable-diffusion-2-1",
  // "stabilityai/stable-diffusion-2-1-base",
  // "stabilityai/stable-diffusion-xl-base-1.0",
  // "prompthero/openjourney",
] as const;

export const imgModels = [..._imgModels] as string[];
export type ImgModels = (typeof _imgModels)[number];
export type ImgResult = {
  model: ImgModels;
  img: string;
  censored: boolean;
} | null;
