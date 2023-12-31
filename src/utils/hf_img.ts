import randomIp from "./randomIp";
import { ImgModels, ImgResult, imgModels } from "./types";

type GIMGProps = {
  model?: ImgModels;
  prompt?: string;
  amount?: number;
};
const censoredContent = "iiigAooooAKKKKAC".repeat(339);

function convertBlobToBase64(blob: Blob) {
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };

    reader.readAsDataURL(blob);
  });
}

export async function generate(prompt: string, model: ImgModels) {
  try {
    const data = {
      headers: {
        authorization: `Bearer ${import.meta.env.VITE_HUGGINGFACE_TOKEN}`,
        "content-type": "application/json",
        "cache-control": "no-cache",
        pragma: "no-cache",
        "x-forwarded-for": randomIp(),
        "x-use-cache": "false",
        "x-wait-for-model": "true",
      },
      body: JSON.stringify({
        inputs: `${prompt}, hd, 8k`,
        parameters: {
          width: 1024,
          height: 1024,
        },
      }),
      method: "POST",
    };
    const url = `https://api-inference.huggingface.co/models/${model}`;
    const fetchResult = await fetch(url, data);
    const blob = await fetchResult.blob();

    if (blob.type === "application/json") {
      return {
        model,
        prompt: prompt ?? "",
        img: null,
        censored: false,
        regenerating: false,
      };
    }

    const imgRes = URL.createObjectURL(blob);
    const _res: ImgResult = {
      model,
      prompt: prompt ?? "",
      img: imgRes,
      censored: (await convertBlobToBase64(blob)).includes(censoredContent),
      regenerating: false,
    } as ImgResult;

    return _res;
  } catch (err) {
    console.log(`Error generate: ${err}`);
    return {
      model,
      prompt: prompt ?? "",
      img: null,
      censored: false,
      regenerating: false,
    };
  }
}

export default async function generateImage(
  props: GIMGProps,
  setResults: React.Dispatch<React.SetStateAction<ImgResult[]>>,
  setResultsLoaded: React.Dispatch<React.SetStateAction<boolean>>
) {
  if (typeof props.prompt != "string") {
    return {
      code: 400,
      data: {
        status: "error",
        message: "prompt must a string!",
      },
    };
  }

  if (!props.prompt?.length) {
    return {
      code: 400,
      data: {
        status: "error",
        message: "prompt is required!",
      },
    };
  }

  if (props.amount && isNaN(props.amount)) {
    return {
      code: 400,
      data: {
        status: "error",
        message: "amount must a number.",
      },
    };
  }

  if (props.model && typeof props.model != "string") {
    return {
      code: 400,
      data: {
        status: "error",
        message: "model must a string.",
      },
    };
  }

  if (props.model && !imgModels.includes(props.model)) {
    return {
      code: 400,
      data: {
        status: "error",
        message: "Invalid model.",
      },
    };
  }

  const model: string | null = (props.model as string) || null;
  const amountProps: number = props.amount ?? 1;
  const amount: number =
    amountProps < 1 ? 1 : amountProps > 4 ? 4 : amountProps;

  const results: ImgResult[] = [];

  await Promise.all(
    Array(amount)
      .fill(0)
      .map(async () => {
        const usedModel: string =
          model || imgModels[Math.floor(Math.random() * imgModels.length)];
        try {
          const _res: ImgResult = await generate(
            props.prompt ?? "",
            usedModel as ImgModels
          );
          setResults([...results, _res]);
          results.push(_res);
        } catch (err) {
          console.log(err);
          setResults([
            ...results,
            {
              prompt: props.prompt ?? "",
              model: usedModel as ImgModels,
              img: null,
              censored: false,
              regenerating: false,
            },
          ]);
          results.push({
            prompt: props.prompt ?? "",
            model: usedModel as ImgModels,
            img: null,
            censored: false,
            regenerating: false,
          });
        } finally {
          setResultsLoaded(true);
        }
      })
  );

  return {
    code: 200,
    data: {
      status: "success",
      result: results,
    },
  };
}
