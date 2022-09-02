import {
  fetch,
  HttpVerb,
  ResponseType as TauriResponseType,
  Body,
} from "@tauri-apps/api/http";

import { AxiosRequestConfig, ResponseType as AxiosResponseType } from "axios";
import settle from "axios/lib/core/settle";

export default function axiosTauriAdapter(
  config: AxiosRequestConfig
): Promise<any> {
  return new Promise(async function (resolve, reject) {
    const response = await fetch(config.url as string, {
      method: (config.method?.toUpperCase() as HttpVerb) || "GET",
      // timeout: config.timeout,
      headers: config.headers,
      responseType: responseTypeParser(config.responseType),
      query: config.params,
      body: bodyParser(config.data),
    });

    let resData;
    try {
      resData = JSON.parse(response.data as string);
    } catch (e) {
      resData = response.data;
    }

    settle(resolve, reject, {
      data: resData,
      status: response.status,
      statusText:
        response.status >= 200 && response.status < 300 ? "OK" : "Error",
      headers: response.headers,
      config,
      request: {},
    });
  });
}

const responseTypeParser = (
  responseType?: AxiosResponseType
): TauriResponseType => {
  switch (responseType) {
    case "arraybuffer":
      return TauriResponseType.Binary;
    case "blob":
      return TauriResponseType.Binary;
    case "document":
      return TauriResponseType.Text;
    case "json":
      return TauriResponseType.JSON;
    case "text":
      return TauriResponseType.Text;
    case "stream":
      return TauriResponseType.Binary;
    default:
      return TauriResponseType.Text;
  }
};

const bodyParser = (data?: any): Body | undefined => {
  if (typeof data === "string") {
    return { type: "Text", payload: data };
  } else if (typeof data === "object") {
    return { type: "JSON", payload: JSON.stringify(data) };
  } else {
    return undefined;
  }
};
